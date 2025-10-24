import Container from "@/app/_components/container";
import { HomeSection } from "@/app/_components/Section";
import { getAllPosts } from "@/lib/api";
import Link from "next/link";

export default function Index() {
  const allPosts = getAllPosts();

  return (
    <main>
      <Container>
      <div className="flex flex-col md:flex-row w-full md:h-[85%] h-[90%]">
          <div className="flex flex-col w-full md:w-1/2 gap-2 pt-[100px] md:pt-[200px]">
            <div className="h-auto w-auto">
              <div className="flex flex-col">
                <div className="text-[13pt]/[2em]">Dhen Padilla</div>
                <div className="text-sm/[1.25em] italic">b. 7.7.1998</div>
              </div>

              <div className="mt-4 md:mt-16 text-sm/[1.25em]">
                <p>dhenepadilla@gmail.com</p>
              </div>

              <div className="mt-4 md:hidden text-sm leading-relaxed max-w-xl italic">
                Dhen is playing with liminality. Based in New York and Tokyo. Currently in Tokyo.
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full pt-[70px] md:w-1/2 md:pt-[200px] gap-16 text-left overflow-y-auto">
            <div className="hidden md:flex text-sm leading-relaxed max-w-xl italic">
              Dhen is playing with liminality. Based in New York and Tokyo. <br/>
              Currently in Tokyo.
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
          <div className="flex flex-col md:w-1/2"/>
          <div className="flex flex-col w-full items-end md:items-start md:w-1/2 gap-2">
            <Link href="/cv" className="text-sm/[1.25em] italic hover:underline">
              CV
            </Link>
          </div>
        </footer>
      </Container>
    </main>
  );
}
