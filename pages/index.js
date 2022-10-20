import Head from "next/head";
import { useRef } from "react";
import { stagger } from "../animations";
import Cursor from "../components/Cursor";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Socials from "../components/Socials";
import WorkCard from "../components/WorkCard";
// Local Data
import data from "../data/portfolio.json";
// Styles
import styles from "../styles/Home.module.css";
import { useIsomorphicLayoutEffect } from "../utils";



export default function Home() {
  // Ref
  const workRef = useRef();
  const aboutRef = useRef();
  const textOne = useRef();
  const textTwo = useRef();
  const textThree = useRef();
  const textFour = useRef();

  // Handling Scroll
  const handleWorkScroll = () => {
    window.scrollTo({
      top: workRef.current.offsetTop,
      left: 0,
      behavior: "smooth",
    });
  };

  const handleAboutScroll = () => {
    window.scrollTo({
      top: aboutRef.current.offsetTop,
      left: 0,
      behavior: "smooth",
    });
  };

  useIsomorphicLayoutEffect(() => {
    stagger(
      [textOne.current, textTwo.current, textThree.current, textFour.current],
      { y: 40, x: -10, transform: "scale(0.95) skew(10deg)" },
      { y: 0, x: 0, transform: "scale(1)" }
    );
  }, []);

  return (
    <div className={`relative ${data.showCursor && "cursor-none"}`}>
      {data.showCursor && <Cursor />}
      <Head>
        <title className={styles.title}>{data.name}</title>
      </Head>

      <div className="px-10 mb-10">
        <Header
          handleWorkScroll={handleWorkScroll}
          handleAboutScroll={handleAboutScroll}
        />
        <div className="laptop:my-64 my-40">
          <div className="mt-5">
            <h1
              ref={textOne}
              className="text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl p-1 tablet:p-2 text-bold w-4/5 mob:w-full laptop:w-4/5"
            >
            </h1>
            <h1
              ref={textTwo}
              className="text-lg tablet:text-lg laptop:text-xl laptopl:text-2xl p-1 tablet:p-2 text-bold w-full laptop:w-4/5"
            >
              {data.headerTaglineTwo}
            </h1>
            <h1
              ref={textThree}
              className="text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl p-1 tablet:p-2 text-bold w-full laptop:w-4/5"
            >
              {data.headerTaglineThree}
            </h1>
            <h1
              ref={textFour}
              className="text-3xl tablet:text-3xl laptop:text-2xl laptopl:text-3xl p-1 tablet:p-2 text-medium w-full laptop:w-4/5 text-gray-300"
            >
              {data.headerTaglineFour}
            </h1>
          </div>

          <Socials className="mt-2 laptop:mt-5" />
        </div>
        <div className="mt-10 laptop:mt-30 p-2 laptop:p-0" ref={workRef}>
          <h1 className="text-2xl text-bold">work</h1>

          <div className="mt-5 laptop:mt-10 grid grid-cols-1 tablet:grid-cols-3 gap-4">
            {data.projects.map((project) => (
              <WorkCard
                key={project.id}
                img={project.imageSrc}
                name={project.title}
                description={project.description}
                onClick={() => window.open(project.url)}
              />
            ))}
          </div>
        </div>

        <div className="mt-10 laptop:mt-40 p-2 laptop:p-0" ref={aboutRef}>
          <h1 className="text-2xl text-bold">about</h1>
          <p className="mt-10 text-md laptop:text-md w-full break-normal">
            full-stack software engineer with 3 years of experience. <br/>
            currently at provenance, previously at arm. <br/>
            driven to create social change and determined to impact the world in a positive way.
          </p>
        </div>
        <div className="p-2 laptop:p-0">
          <p className="mt-10 text-sm laptop:text-sm w-full break-normal">
            film photographer<br />
            35mm
          </p>
        </div>
        <Footer />
      </div>
    </div>
  );
}
