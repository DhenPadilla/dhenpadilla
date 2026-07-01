import Container from "@/app/_components/container";
import { NowEntrance } from "@/app/_components/now-entrance";
import { POSTED_STAMP } from "./posted";

// Server wrapper: same Container as the rest of the site. The interactive
// entrance (intro passage → dated button → reveal) lives in NowEntrance.
export default function NowLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Container>
        <article className="flex flex-col w-full pb-[150px]">
          <NowEntrance stamp={POSTED_STAMP}>{children}</NowEntrance>
        </article>
      </Container>
    </main>
  );
}
