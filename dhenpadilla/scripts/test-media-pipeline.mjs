// Self-verifying end-to-end test for the /now media pipeline.
//
//   node --env-file=.env scripts/test-media-pipeline.mjs
//
// Generates synthetic assets, runs the REAL ingestion script under a _test/
// key prefix, asserts encode/upload/snippet/render stages, then deletes the
// test objects from R2 and restores page.mdx. Cleanup runs in finally, so the
// bucket and repo are left pristine even if an assertion fails. Commits nothing.

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { execFileSync, spawn } from "node:child_process";
import sharp from "sharp";
import {
  S3Client, PutObjectCommand, HeadObjectCommand,
  ListObjectsV2Command, DeleteObjectsCommand,
} from "@aws-sdk/client-s3";

const ROOT = process.cwd();
const INBOX = path.join(ROOT, "media-inbox");
const PROCESSED = path.join(INBOX, "processed");
const PAGE_MDX = path.join(ROOT, "src/app/now/page.mdx");
const TEST_PREFIX = "_test/";
const TEST_PORT = 3137;

const results = [];
const ok = (stage, name, pass, detail = "") => {
  results.push({ stage, name, pass, detail });
  console.log(`  [${pass ? "PASS" : "FAIL"}] ${stage} · ${name}${detail ? ` — ${detail}` : ""}`);
};

function reqEnv(n) { const v = process.env[n]; if (!v) { console.error(`Missing env ${n}`); process.exit(2); } return v; }
const ACCOUNT_ID = reqEnv("R2_ACCOUNT_ID");
const BUCKET = reqEnv("R2_BUCKET");
const PUBLIC_BASE = reqEnv("R2_PUBLIC_BASE_URL").replace(/\/+$/, "");
const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: reqEnv("R2_ACCESS_KEY_ID"), secretAccessKey: reqEnv("R2_SECRET_ACCESS_KEY") },
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchInfo(url, { retries = 6, delay = 800 } = {}) {
  let last;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      const buf = Buffer.from(await res.arrayBuffer());
      return { status: res.status, ct: res.headers.get("content-type") || "", len: buf.length, buf };
    } catch (e) { last = e; await sleep(delay); }
  }
  return { status: 0, ct: "", len: 0, buf: Buffer.alloc(0), error: String(last) };
}

function makeImage(file, w, h) {
  const raw = crypto.randomBytes(w * h * 3); // real bytes so encoders produce non-trivial output
  return sharp(raw, { raw: { width: w, height: h, channels: 3 } }).png().toFile(file);
}

function parseSnippets(stdout) {
  const imgs = [...stdout.matchAll(/<Img avif="([^"]+)" webp="([^"]+)" w=\{(\d+)\} h=\{(\d+)\} \/>/g)]
    .map((m) => ({ type: "image", avif: m[1], webp: m[2], w: +m[3], h: +m[4] }));
  const vids = [...stdout.matchAll(/<Vid mp4="([^"]+)" poster="([^"]+)" w=\{(\d+)\} h=\{(\d+)\} \/>/g)]
    .map((m) => ({ type: "video", mp4: m[1], poster: m[2], w: +m[3], h: +m[4] }));
  return [...imgs, ...vids];
}
const byBase = (items, base) =>
  items.find((it) => (it.avif || it.mp4).includes(`/${base}-`));

async function main() {
  let serverProc;
  const originalMdx = fs.readFileSync(PAGE_MDX, "utf8");
  const createdInbox = [];

  try {
    // ── PREREQS ────────────────────────────────────────────────────────────
    console.log("\n# Prereqs");
    const envOk = ["R2_ACCOUNT_ID","R2_ACCESS_KEY_ID","R2_SECRET_ACCESS_KEY","R2_BUCKET","R2_PUBLIC_BASE_URL"]
      .every((k) => !!process.env[k]);
    ok("prereq", "R2 env vars present in .env", envOk);

    for (const dep of ["sharp", "@aws-sdk/client-s3", "@next/mdx"]) {
      const exists = fs.existsSync(path.join(ROOT, "node_modules", dep));
      ok("prereq", `dep installed: ${dep}`, exists);
    }
    let ffmpeg = true;
    try { execFileSync("ffmpeg", ["-version"], { stdio: "ignore" }); } catch { ffmpeg = false; }
    ok("prereq", "ffmpeg available (video stage)", ffmpeg);

    // Bucket reachability via authenticated probe put/head/delete.
    let bucketOk = false, bucketErr = "";
    try {
      const probeKey = `${TEST_PREFIX}__probe-${crypto.randomBytes(4).toString("hex")}.txt`;
      await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: probeKey, Body: "ok", ContentType: "text/plain" }));
      await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: probeKey }));
      await s3.send(new DeleteObjectsCommand({ Bucket: BUCKET, Delete: { Objects: [{ Key: probeKey }] } }));
      bucketOk = true;
    } catch (e) { bucketErr = e?.name || String(e); }
    ok("prereq", `R2 bucket '${BUCKET}' reachable (auth)`, bucketOk, bucketErr);
    if (!bucketOk) {
      console.error("\nSTOP: bucket not reachable with current creds. This is a Cloudflare/credentials gap (browser fix), not a code bug.");
      throw new Error("bucket-unreachable");
    }

    // ── GENERATE ASSETS ──────────────────────────────────────────────────────
    console.log("\n# Generate synthetic assets");
    fs.mkdirSync(INBOX, { recursive: true });
    // Basenames chosen to be slug-stable (no leading underscore — slug() strips it).
    const assets = {
      landscape: { file: path.join(INBOX, "test-landscape.png"), w: 3000, h: 2000 }, // → downscale 2400×1600
      portrait:  { file: path.join(INBOX, "test-portrait.png"),  w: 1600, h: 2400 }, // unchanged (w<2400)
      small:     { file: path.join(INBOX, "test-small.png"),     w: 800,  h: 600  }, // unchanged (no upscale)
    };
    for (const a of Object.values(assets)) { await makeImage(a.file, a.w, a.h); createdInbox.push(a.file); }
    ok("generate", "3 source images created", Object.values(assets).every((a) => fs.existsSync(a.file)));

    let videoFile;
    if (ffmpeg) {
      videoFile = path.join(INBOX, "test-clip.mp4");
      execFileSync("ffmpeg", ["-y","-f","lavfi","-i","testsrc=duration=1:size=320x240:rate=10","-pix_fmt","yuv420p", videoFile], { stdio: "ignore" });
      createdInbox.push(videoFile);
      ok("generate", "tiny test clip created", fs.existsSync(videoFile));
    }

    // ── RUN INGESTION (real script, _test/ prefix) ───────────────────────────
    console.log("\n# Run ingestion script");
    let stdout = "";
    try {
      stdout = execFileSync("node", ["scripts/ingest-media.mjs"], {
        env: { ...process.env, MEDIA_KEY_PREFIX: TEST_PREFIX },
        encoding: "utf8",
      });
    } catch (e) { stdout = (e.stdout || "") + (e.stderr || ""); }
    const items = parseSnippets(stdout);
    ok("ingest", "script emitted snippets for all assets", items.length === (ffmpeg ? 4 : 3), `${items.length} parsed`);

    const L = byBase(items, "test-landscape");
    const P = byBase(items, "test-portrait");
    const S = byBase(items, "test-small");
    const V = ffmpeg ? byBase(items, "test-clip") : null;

    // ── ENCODE ASSERTIONS ────────────────────────────────────────────────────
    console.log("\n# Encode");
    ok("encode", "landscape downscaled to 2400×1600", !!L && L.w === 2400 && L.h === 1600, L && `${L.w}×${L.h}`);
    ok("encode", "portrait unchanged 1600×2400", !!P && P.w === 1600 && P.h === 2400, P && `${P.w}×${P.h}`);
    ok("encode", "small NOT upscaled (800×600)", !!S && S.w === 800 && S.h === 600, S && `${S.w}×${S.h}`);

    // Download AVIF/WebP and confirm real pixel dimensions + format.
    for (const [name, it, ew, eh] of [["landscape",L,2400,1600],["portrait",P,1600,2400],["small",S,800,600]]) {
      if (!it) { ok("encode", `${name}: dimensions verifiable`, false, "no snippet"); continue; }
      const a = await fetchInfo(it.avif);
      const am = a.status === 200 ? await sharp(a.buf).metadata() : {};
      ok("encode", `${name}: AVIF decodes at ${ew}×${eh}`, ["heif","avif"].includes(am.format) && am.width === ew && am.height === eh, `${am.width}×${am.height} ${am.format}`);
      const wbuf = await fetchInfo(it.webp);
      const wm = wbuf.status === 200 ? await sharp(wbuf.buf).metadata() : {};
      ok("encode", `${name}: WebP decodes at ${ew}×${eh}`, wm.format === "webp" && wm.width === ew && wm.height === eh, `${wm.width}×${wm.height} ${wm.format}`);
    }

    // ── UPLOAD ASSERTIONS (public URLs) ──────────────────────────────────────
    console.log("\n# Upload (public R2 URLs)");
    const urlChecks = [
      ...(L ? [[L.avif, "image/avif"], [L.webp, "image/webp"]] : []),
      ...(P ? [[P.avif, "image/avif"], [P.webp, "image/webp"]] : []),
      ...(S ? [[S.avif, "image/avif"], [S.webp, "image/webp"]] : []),
      ...(V ? [[V.mp4, "video/mp4"], [V.poster, "image/webp"]] : []),
    ];
    for (const [url, ct] of urlChecks) {
      const r = await fetchInfo(url);
      const short = url.replace(PUBLIC_BASE + "/", "");
      ok("upload", `200 + ${ct} + non-empty: ${short}`, r.status === 200 && r.ct.includes(ct) && r.len > 0, `HTTP ${r.status}, ${r.ct}, ${r.len}B`);
    }

    // ── SNIPPET ("frontmatter" equivalent) ───────────────────────────────────
    // NOTE: design changed to MDX — the script no longer writes a now.md
    // frontmatter array; it prints ready-to-paste <MediaRow> JSX instead.
    console.log("\n# Snippet payload (absolute URL + w/h + type)");
    for (const [name, it] of [["landscape",L],["portrait",P],["small",S],...(V?[["video",V]]:[])]) {
      const src = it && (it.avif || it.mp4);
      const good = !!it && src.startsWith(PUBLIC_BASE + "/") && Number.isInteger(it.w) && it.w > 0 && Number.isInteger(it.h) && it.h > 0 && !!it.type;
      ok("snippet", `${name}: absolute URL + w/h + type`, good, it && `${it.type} ${it.w}×${it.h}`);
    }

    // ── RENDER ───────────────────────────────────────────────────────────────
    console.log("\n# Render (build + serve + curl)");
    // Portrait + landscape in ONE row exercises the unequal-width flex logic.
    const row2 = `<MediaRow>\n  <Img avif="${P.avif}" webp="${P.webp}" w={${P.w}} h={${P.h}} />\n  <Img avif="${L.avif}" webp="${L.webp}" w={${L.w}} h={${L.h}} />\n</MediaRow>`;
    const rowSmall = `<MediaRow>\n  <Img avif="${S.avif}" webp="${S.webp}" w={${S.w}} h={${S.h}} />\n</MediaRow>`;
    const rowVid = V ? `\n\n<MediaRow>\n  <Vid mp4="${V.mp4}" poster="${V.poster}" w={${V.w}} h={${V.h}} />\n</MediaRow>` : "";
    fs.writeFileSync(PAGE_MDX, `Test render.\n\n${row2}\n\nMore text.\n\n${rowSmall}${rowVid}\n`);

    let built = false;
    try {
      const out = execFileSync("npx", ["next", "build"], { encoding: "utf8", env: process.env });
      built = /Compiled successfully/.test(out);
    } catch (e) { built = false; }
    ok("render", "next build compiles", built);

    let html = "";
    if (built) {
      serverProc = spawn("npx", ["next", "start", "-p", String(TEST_PORT)], { detached: true, stdio: "ignore", env: process.env });
      for (let i = 0; i < 40; i++) {
        const r = await fetchInfo(`http://localhost:${TEST_PORT}/now`, { retries: 1 });
        if (r.status === 200) { html = r.buf.toString(); break; }
        await sleep(500);
      }
      ok("render", "/now served (HTTP 200)", html.length > 0);
    }

    if (html) {
      ok("render", "HTML contains landscape AVIF + WebP URLs", html.includes(L.avif) && html.includes(L.webp));
      ok("render", "<picture> with avif + webp <source>", /type="image\/avif"/.test(html) && /type="image\/webp"/.test(html));
      ok("render", "landscape <img> width=2400 height=1600", html.includes('width="2400"') && html.includes('height="1600"'));
      ok("render", "small <img> width=800 height=600", html.includes('width="800"') && html.includes('height="600"'));

      const flexes = [...html.matchAll(/style="flex:([0-9.]+)"/g)].map((m) => +m[1]);
      const hasUnequal = flexes.length >= 2 && new Set(flexes).size >= 2;
      const expLand = +(L.w / L.h).toFixed(4), expPort = +(P.w / P.h).toFixed(4);
      const matchWeights = flexes.some((f) => Math.abs(f - L.w / L.h) < 0.01) && flexes.some((f) => Math.abs(f - P.w / P.h) < 0.01);
      ok("render", "side-by-side row has unequal aspect-ratio flex", hasUnequal && matchWeights, `flex=[${flexes.join(", ")}] exp≈[${expPort}, ${expLand}]`);
      ok("render", "landscape gets more width (flex_land > flex_port)", Math.max(...flexes) > Math.min(...flexes) && (L.w / L.h) > (P.w / P.h));

      if (V) {
        const v = /<video[^>]*>/.test(html);
        ok("render", "video: <video> autoplay/loop/playsinline + poster + src", v && html.includes(V.mp4) && html.includes(V.poster) && /loop/.test(html) && /autoplay/i.test(html) && /playsinline/i.test(html), "muted enforced at runtime via ref");
      }
    }
  } finally {
    // ── CLEANUP ───────────────────────────────────────────────────────────────
    console.log("\n# Cleanup");
    if (serverProc?.pid) { try { process.kill(-serverProc.pid, "SIGTERM"); } catch {} }

    // Restore page.mdx
    try { fs.writeFileSync(PAGE_MDX, originalMdx); } catch {}
    const restored = fs.readFileSync(PAGE_MDX, "utf8") === originalMdx;
    ok("cleanup", "page.mdx restored to original", restored);

    // Delete all _test/ objects from R2, then confirm via HeadObject → NotFound
    let deletedKeys = [];
    try {
      const listed = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET, Prefix: TEST_PREFIX }));
      deletedKeys = (listed.Contents || []).map((o) => o.Key);
      if (deletedKeys.length) {
        await s3.send(new DeleteObjectsCommand({ Bucket: BUCKET, Delete: { Objects: deletedKeys.map((Key) => ({ Key })) } }));
      }
    } catch (e) { ok("cleanup", "delete test objects", false, String(e)); }

    let allGone = true;
    for (const Key of deletedKeys) {
      try { await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key })); allGone = false; }
      catch { /* NotFound = good */ }
    }
    ok("cleanup", `R2 test objects deleted (${deletedKeys.length}) + verified gone`, allGone);

    // Remove generated local files (inbox originals + processed copies)
    const baseNames = createdInbox.map((f) => path.basename(f));
    try {
      for (const f of createdInbox) { fs.rmSync(f, { force: true }); }
      for (const b of baseNames) { fs.rmSync(path.join(PROCESSED, b), { force: true }); }
    } catch {}
    const stillThere = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir).filter((n) => baseNames.includes(n)).length : 0);
    const inboxClean = stillThere(INBOX) === 0 && stillThere(PROCESSED) === 0;
    ok("cleanup", "generated local files removed", inboxClean);
  }

  // ── REPORT ──────────────────────────────────────────────────────────────────
  const pass = results.filter((r) => r.pass).length;
  const fail = results.length - pass;
  console.log(`\n================ SUMMARY ================`);
  for (const r of results.filter((r) => !r.pass)) console.log(`  FAIL · ${r.stage} · ${r.name}${r.detail ? ` — ${r.detail}` : ""}`);
  console.log(`  ${pass}/${results.length} passed, ${fail} failed`);
  console.log(`========================================`);
  process.exit(fail ? 1 : 0);
}

main().catch((e) => { console.error("FATAL", e); process.exit(1); });
