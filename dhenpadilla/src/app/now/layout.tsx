import Container from "@/app/_components/container";
import { NowEntrance } from "@/app/_components/now-entrance";
import { POSTED } from "./posted";

// Server wrapper: same Container as the rest of the site. The interactive
// entrance (intro passage → dated button → reveal) lives in NowEntrance.
export default function NowLayout({ children }: { children: React.ReactNode }) {
  const d = new Date(POSTED);
  const stamp = `${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;

  return (
    <main>
      <Container>
        <article className="flex flex-col w-full">
          <NowEntrance stamp={stamp}>{children}</NowEntrance>
        </article>
      </Container>
    </main>
  );
}
