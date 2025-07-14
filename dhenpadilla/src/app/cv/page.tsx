import { HomeSection } from "@/app/_components/Section";
import Link from "next/link";

export default async function CV() {

  return (
    <main>
      <div className="flex flex-col max-h-[100vh] gap-4 max-w-3xl px-6 md:px-[80px] w-[100vw] max-w-[100vw] m-auto h-[100vh]">
        <article className="flex flex-col md:flex-row w-full gap-10">
            <div className="flex flex-row md:flex-col sticky md:h-[100vh] py-[56px] md:w-[24%] w-full">
                <div className="text-md font-light italic">
                    Dhen Padilla (b. 1998) is a software engineer and artist based in London and New York.
                    <br/>
                    His engineering practice is concerned with social issues, and reinvention. He is also a volunteer contributor to multiple open source projects and the creative platform, <Link href="https://silk.cx" className="underline">Silk</Link>.
                    <br />
                    Whilst his artistic work is grounded in transitivity, and is focused on the morality and liminality in humanity.
                </div>
            </div>
            <div className="flex flex-col w-full md:w-1/2 md:ml-[70px] md:pt-[60px] gap-16 text-left overflow-y-auto">
                <HomeSection title="Technical">
                    <ul className="flex flex-col gap-2">
                        <li className="flex flex-row w-full justify-between">
                            <span className="text-sm/[1.25em]">2023-Present</span>
                            <span className="ml-2 text-sm/[1.25em] italic">Founding Engineer, Streamline, San Francisco, CA</span>
                        </li>
                        <li className="flex flex-row w-full justify-between">
                            <span className="text-sm/[1.25em]">2022-2023</span>
                            <span className="ml-2 text-sm/[1.25em] italic">Software Engineer, Provenance, London, UK</span>
                        </li>
                        <li className="flex flex-row w-full justify-between">
                            <span className="text-sm/[1.25em]">2020-2022</span>
                            <span className="ml-2 text-sm/[1.25em] italic">Software Engineer, Arm, Cambridge, UK</span>
                        </li>
                        <li className="flex flex-row w-full justify-between">
                            <span className="text-sm/[1.25em]">2018-2019</span>
                            <span className="ml-2 text-sm/[1.25em] italic">Software Engineer, Alice, London, UK</span>
                        </li>
                        <li className="flex flex-row w-full justify-between">
                            <span className="text-sm/[1.25em]">2019</span>
                            <span className="ml-2 text-sm/[1.25em] italic">Tech for Good accelerator, Google, London, UK</span>
                        </li>
                    </ul>
                </HomeSection>
                <HomeSection title="Shows">
                    <ul className="flex flex-col gap-2">
                        <li className="flex flex-row w-full justify-between">
                            <span className="text-sm/[1.25em]">11.2024</span>
                            <span className="ml-2 text-sm/[1.25em] italic">Untitled &mdash; Group show, safaricamp, Oakland, CA</span>
                        </li>
                        <li className="flex flex-row w-full justify-between">
                            <span className="text-sm/[1.25em]">05.2024</span>
                            <span className="ml-2 text-sm/[1.25em] italic">Meet me in SF &mdash; Group show, Lion's Den, San Francisco, CA</span>
                        </li>
                    </ul>
                </HomeSection>
                <HomeSection title="Education">
                    <ul className="flex flex-col gap-2 pb-20 md:pb-4">
                        <li className="flex flex-row w-full justify-between">
                            <span className="text-sm/[1.25em]">2016-2020</span>
                            <span className="ml-2 text-sm/[1.25em] italic">Master of Engineering, Computer Science, University College London</span>
                        </li>
                    </ul>
                </HomeSection>
          </div>
        </article>
      </div>
    </main>
  );
}
