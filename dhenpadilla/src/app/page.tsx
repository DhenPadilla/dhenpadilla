import { HomeSection } from "@/components/Section";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
      <div className="flex flex-col max-h-[100vh] gap-4 max-w-3xl px-[20vw] w-[100vw] max-w-[100vw] m-auto h-[100vh]">
        <div className="flex flex-row w-full h-[90%]">
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
            <div className="flex text-sm leading-relaxed max-w-xl">
              Dhen is a multidisciplinary based in New York, London and Manila.
            </div>
            <HomeSection title="Writing">
              <ul className="flex flex-col gap-2">
                <li className="flex flex-row w-full justify-between">
                  <span className="text-sm/[1.25em]">2025</span>
                  <Link href="/blog/post-title" className="ml-2 text-sm/[1.25em] italic hover:underline">
                    Title of Your Post
                  </Link>
                </li>
                <li className="flex flex-row w-full justify-between">
                  <span className="text-sm/[1.25em]">2024</span>
                  <Link href="/blog/another-post" className="ml-2 text-sm/[1.25em] italic hover:underline">
                    Another Post Title
                  </Link>
                </li>
                <li className="flex flex-row w-full justify-between">
                  <span className="text-sm/[1.25em]">2023</span>
                  <Link href="/blog/third-post" className="ml-2 text-sm/[1.25em] italic hover:underline">
                    A Third Post Title
                  </Link>
                </li>
              </ul>
            </HomeSection>
          </div>
        </div>
        <footer className="flex flex-row w-full">
          <div className="flex flex-col w-1/2"/>
          <div className="flex flex-col w-1/2 gap-2">
            <div className="flex text-sm/[1.25em] uppercase">NEWSLETTER</div>
            <Link href="https://substack.com/yourname" className="text-sm/[1.25em] italic hover:underline">
              Subscribe to my Substack
            </Link>
          </div>
        </footer>
      </div>
  );
}
