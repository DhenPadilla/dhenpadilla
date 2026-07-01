// Media ingestion for the /now page.
//
//   1. Drop image/video files into  media-inbox/
//   2. Run:  npm run media
//   3. Paste the printed <MediaRow> blocks into src/app/now/page.mdx
//
// Images  -> resized + encoded to AVIF and WebP.
// Videos  -> web-friendly MP4 (muted, +faststart) + a WebP poster frame.
// Everything is uploaded to R2; originals are moved to media-inbox/processed/.
// No binaries are committed; the script only prints ready-to-paste JSX.

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import sharp from "sharp";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// ─────────────────────────────────────────────────────────────────────────
// Tune these. Defaults bias toward quality to preserve film grain.
// ─────────────────────────────────────────────────────────────────────────
const IMAGE_MAX_WIDTH = 2400; // px, downscale only — never upscaled
const AVIF_QUALITY = 72; // sharp AVIF quality (1–100)
const WEBP_QUALITY = 85; // sharp WebP quality (1–100)
const AVIF_EFFORT = 4; // 0–9, higher = smaller/slower encode
// Video: uploaded AS-IS by default (best quality; source must be a web-playable
// mp4/webm — H.264/AAC or VP9/AV1 — for cross-browser autoplay).
const TRANSCODE_VIDEO = false; // set true to re-encode to web-friendly H.264 mp4
const VIDEO_MAX_WIDTH = 1600; // only used when TRANSCODE_VIDEO = true
const VIDEO_CRF = 20; // only used when TRANSCODE_VIDEO = true (lower = better)
const POSTER_MAX_WIDTH = 1600; // poster still-frame width cap
// ─────────────────────────────────────────────────────────────────────────

const KEY_PREFIX = process.env.MEDIA_KEY_PREFIX || "now/";
const CACHE_CONTROL = "public, max-age=31536000, immutable";
const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".tif", ".tiff", ".webp", ".heic", ".heif"]);
const VIDEO_EXTS = new Set([".mp4", ".mov", ".m4v", ".webm", ".avi"]);
const VIDEO_CT = { ".mp4": "video/mp4", ".m4v": "video/mp4", ".webm": "video/webm", ".mov": "video/quicktime", ".avi": "video/x-msvideo" };

const INBOX = path.resolve("media-inbox");
const PROCESSED = path.join(INBOX, "processed");

function requireEnv(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing required env var: ${name} (set it in .env)`);
    process.exit(1);
  }
  return v;
}

const ACCOUNT_ID = requireEnv("R2_ACCOUNT_ID");
const BUCKET = requireEnv("R2_BUCKET");
const PUBLIC_BASE = requireEnv("R2_PUBLIC_BASE_URL").replace(/\/+$/, "");
const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
    secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
  },
});

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function ffprobeSize(file) {
  const out = execFileSync("ffprobe", [
    "-v", "error",
    "-select_streams", "v:0",
    "-show_entries", "stream=width,height",
    "-of", "csv=p=0",
    file,
  ]).toString().trim();
  const [w, h] = out.split(",").map(Number);
  return { w, h };
}

async function upload(key, body, contentType) {
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: CACHE_CONTROL,
  }));
  return `${PUBLIC_BASE}/${key}`;
}

async function processImage(file, base, hash) {
  const buf = fs.readFileSync(file);
  const pipeline = sharp(buf).rotate().resize({ width: IMAGE_MAX_WIDTH, withoutEnlargement: true });

  const avif = await pipeline
    .clone()
    .avif({ quality: AVIF_QUALITY, effort: AVIF_EFFORT, chromaSubsampling: "4:4:4" })
    .toBuffer({ resolveWithObject: true });
  const webp = await pipeline
    .clone()
    .webp({ quality: WEBP_QUALITY })
    .toBuffer({ resolveWithObject: true });

  const { width: w, height: h } = avif.info;
  const avifUrl = await upload(`${KEY_PREFIX}${base}-${hash}.avif`, avif.data, "image/avif");
  const webpUrl = await upload(`${KEY_PREFIX}${base}-${hash}.webp`, webp.data, "image/webp");

  return { w, h, snippet:
`<MediaRow>
  <Img avif="${avifUrl}" webp="${webpUrl}" w={${w}} h={${h}} />
</MediaRow>` };
}

async function processVideo(file, base, hash) {
  const ext = path.extname(file).toLowerCase();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "now-media-"));
  const posterPath = path.join(tmp, "poster.png");
  try {
    // Poster from the first frame — a derived still, does not alter the video.
    execFileSync("ffmpeg", [
      "-y", "-i", file, "-frames:v", "1", posterPath,
    ], { stdio: ["ignore", "ignore", "inherit"] });
    const poster = await sharp(fs.readFileSync(posterPath))
      .resize({ width: POSTER_MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    let videoBuf, videoExt, contentType, dims;
    if (TRANSCODE_VIDEO) {
      // Opt-in: re-encode to a web-friendly H.264 mp4 (capped width, faststart, no audio).
      const mp4Path = path.join(tmp, "out.mp4");
      execFileSync("ffmpeg", [
        "-y", "-i", file,
        "-vf", `scale='min(${VIDEO_MAX_WIDTH},iw)':-2`,
        "-c:v", "libx264", "-crf", String(VIDEO_CRF), "-preset", "slow",
        "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart",
        mp4Path,
      ], { stdio: ["ignore", "ignore", "inherit"] });
      videoBuf = fs.readFileSync(mp4Path);
      videoExt = ".mp4";
      contentType = "video/mp4";
      dims = ffprobeSize(mp4Path);
    } else {
      // Default: upload the original bytes untouched.
      videoBuf = fs.readFileSync(file);
      videoExt = ext;
      contentType = VIDEO_CT[ext] || "application/octet-stream";
      dims = ffprobeSize(file);
    }

    const videoUrl = await upload(`${KEY_PREFIX}${base}-${hash}${videoExt}`, videoBuf, contentType);
    const posterUrl = await upload(`${KEY_PREFIX}${base}-${hash}.webp`, poster, "image/webp");

    return { w: dims.w, h: dims.h, snippet:
`<MediaRow>
  <Vid mp4="${videoUrl}" poster="${posterUrl}" w={${dims.w}} h={${dims.h}} />
</MediaRow>` };
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

async function main() {
  if (!fs.existsSync(INBOX)) {
    fs.mkdirSync(INBOX, { recursive: true });
    console.log(`Created ${path.relative(process.cwd(), INBOX)}/ — drop files in and re-run.`);
    return;
  }
  fs.mkdirSync(PROCESSED, { recursive: true });

  const files = fs.readdirSync(INBOX)
    .filter((f) => !f.startsWith("."))
    .map((f) => path.join(INBOX, f))
    .filter((f) => fs.statSync(f).isFile());

  if (files.length === 0) {
    console.log("media-inbox/ is empty — nothing to do.");
    return;
  }

  const snippets = [];
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const base = slug(path.basename(file, ext));
    const hash = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex").slice(0, 8);

    let result;
    if (IMAGE_EXTS.has(ext)) {
      result = await processImage(file, base, hash);
    } else if (VIDEO_EXTS.has(ext)) {
      result = await processVideo(file, base, hash);
    } else {
      console.log(`• skipped ${path.basename(file)} (unsupported type)`);
      continue;
    }

    fs.renameSync(file, path.join(PROCESSED, path.basename(file)));
    console.log(`✓ ${base}-${hash}  (${result.w}×${result.h})`);
    snippets.push(result.snippet);
  }

  if (snippets.length) {
    console.log(`\nPaste these into src/app/now/page.mdx where you want them.`);
    console.log(`(To place two side by side, move both inner tags into one <MediaRow>.)\n`);
    console.log(snippets.join("\n\n"));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
