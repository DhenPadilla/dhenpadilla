import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import Cursor from "../components/Cursor";
import Header from "../components/Header";
import ProjectResume from "../components/ProjectResume";
import data from "../data/portfolio.json";

const resume = data.resume;
const name = data.name;

const Resume = () => {
  const router = useRouter();
  const theme = useTheme();
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);
  return (
    <>
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-6 right-6">
          <Button onClick={() => router.push("/edit")} type={"primary"}>
            Edit Resume
          </Button>
        </div>
      )}
      {data.showCursor && <Cursor />}
      <div
        className={`px-10 mb-10 ${
          data.showCursor && "cursor-none"
        }`}
      >
        <Header isBlog />
        {mount && (
          <div className="mt-10 w-full flex flex-col items-center">
            <div
              className={`w-full ${
                mount && theme.theme === "dark" ? "bg-slate-800" : "bg-gray-50"
              } max-w-4xl p-20 mob:p-5 desktop:p-20 rounded-lg shadow-sm`}
            >
              <h1 className="text-3xl font-light">{name}</h1>
              <h2 className="text-xl opacity-60">{resume.tagline}</h2>
              <div className="mt-5">
                <h1 className="text-2xl font-medium">experience</h1>

                {resume.experiences.map(
                  ({ id, dates, type, position, bullets }) => (
                    <ProjectResume
                      key={id}
                      dates={dates}
                      type={type}
                      position={position}
                      bullets={bullets}
                    ></ProjectResume>
                  )
                )}
              </div>
              <div className="mt-5">
                <h1 className="text-2xl font-medium">education</h1>
                <div className="mt-2">
                  <h2 className="text-lg">{resume.education.universityName}</h2>
                  <h3 className="text-sm opacity-75">
                    {resume.education.universityDate}
                  </h3>
                  <p className="text-sm mt-2 opacity-80">
                    {resume.education.universityPara}
                  </p>
                  <p className="text-sm opacity-50">
                    masters research thesis: semantic translation of legal contracts into smart contracts in the context of construction projects
                  </p>
                </div>
              </div>
              <div className="mt-5">
                <h1 className="text-2xl font-medium">skills</h1>
                <div className="flex mob:flex-col desktop:flex-row justify-between w-3/4">
                  {resume.languages && (
                    <div className="mt-2 mob:mt-5">
                      <h2 className="text-md mb-2">languages</h2>
                        {resume.languages.map((language, index) => (
                          <p key={index} className="text-sm">
                            {language}
                          </p>
                        ))}
                    </div>
                  )}
                  {resume.frameworks && (
                    <div className="mt-2 mob:mt-5">
                      <h2 className="text-md mb-2">frameworks</h2>
                        {resume.frameworks.map((framework, index) => (
                          <p key={index} className="text-sm">
                            {framework}
                          </p>
                        ))}
                    </div>
                  )}
                  {resume.others && (
                    <div className="mt-2 mob:mt-5">
                      <h2 className="text-md mb-2">others</h2>
                        {resume.others.map((other, index) => (
                          <p key={index} className="text-sm">
                            {other}
                          </p>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Resume;
