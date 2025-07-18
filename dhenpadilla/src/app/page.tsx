import Container from "@/app/_components/container";
import { HomeSection } from "@/app/_components/Section";
import { getAllPosts } from "@/lib/api";
import Link from "next/link";

export default function Index() {
  const allPosts = getAllPosts();

  return (
    <main>
      <Container>
      <div className="flex flex-row w-full h-[85%]">
          <div className="flex flex-col w-1/2 gap-2 pt-[200px]">
            <div className="h-auto w-auto">
              <div className="flex flex-col">
                <div className="text-lg">Dhen Padilla</div>
                <div className="text-sm/[1.25em] italic">b. 7.7.1998</div>
              </div>

              <div className="mt-16 text-sm/[1.25em]">
                <p>dhenepadilla@gmail.com</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-1/2 pt-[200px] gap-16 text-left overflow-y-auto">
            <div className="flex text-sm leading-relaxed max-w-xl italic">
              Dhen is currently playing with liminality. Based in London and New York. Currently in Tokyo.
            </div>
            <HomeSection title="Writing">
              <ul className="flex flex-col gap-2">
                {allPosts.map((post) => (
                  <li className="flex flex-row w-full justify-between" key={post.slug}>
                    <span className="text-sm/[1.25em]">{new Date(post.date).getMonth()}.{new Date(post.date).getFullYear()}</span>
                    <Link href={`/writing/${post.slug}`} className="ml-2 text-sm/[1.25em] italic hover:underline">
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </HomeSection>
          </div>
        </div>
        <footer className="flex flex-row w-full">
          <div className="flex flex-col w-1/2"/>
          <div className="flex flex-col w-1/2 gap-2">
            <Link href="/cv" className="text-sm/[1.25em] italic hover:underline">
              CV
            </Link>
          </div>
        </footer>
      </Container>
    </main>
  );
}
