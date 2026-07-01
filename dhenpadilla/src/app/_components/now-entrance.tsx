"use client";

import { useEffect, useState } from "react";
import markdownStyles from "./markdown-styles.module.css";

export function NowEntrance({ stamp, children }: { stamp: string; children: React.ReactNode }) {
  const [entered, setEntered] = useState(false);
  const [introGone, setIntroGone] = useState(false);

  useEffect(() => {
    if (introGone) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [introGone]);

  const enter = () => {
    setEntered(true);
    window.setTimeout(() => setIntroGone(true), 600);
  };

  return (
    <>
      <div
        aria-hidden={!entered}
        className={`${markdownStyles["markdown"]} pt-16 md:pt-[100px] transition-opacity duration-700 delay-200 ${
          entered ? "opacity-100" : "opacity-0"
        }`}
      >
        {children}
      </div>

      {!introGone && (
        <div
          className={`fixed inset-0 z-20 flex flex-col justify-center overflow-y-auto px-16 md:px-[20vw] py-16 transition-opacity duration-500 ${
            entered ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="text-sm leading-relaxed italic max-w-xl">
            <p>
            A thing is seen, and loved for the length of its seeing. Then the hour turns and takes it &mdash; I am not consulted; neither are you.
            <br/>
            What remains is the shadow, never the thing.<br/>
            The current state of me. See it now; already I am elsewhere.
            </p>
          </div>
          <button
            type="button"
            onClick={enter}
            className="mt-8 self-start text-sm text-gray-500 hover:text-gray-900 hover:underline transition-colors"
          >
            from {stamp} &mdash; <span className="italic">now</span>
          </button>
        </div>
      )}

      {/* Corner footnote — settles in once you're in "now" */}
      <div
        className={`fixed bottom-4 left-4 text-xs italic text-gray-500 transition-opacity duration-700 ${
          entered ? "opacity-100" : "opacity-0"
        }`}
      >
        {stamp}
      </div>
    </>
  );
}
