"use client";

import { useEffect, useState } from "react";
import markdownStyles from "./markdown-styles.module.css";

// The /now entrance: an intro passage that fades out — via a dated button —
// to reveal the page's content. The button is the only way in; the same date
// then settles into the corner as the "now" marker.
export function NowEntrance({ stamp, children }: { stamp: string; children: React.ReactNode }) {
  const [entered, setEntered] = useState(false);
  const [introGone, setIntroGone] = useState(false);

  // Hold the page still while the entrance is up.
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
      {/* Revealed content */}
      <div
        aria-hidden={!entered}
        className={`${markdownStyles["markdown"]} pt-16 md:pt-[100px] transition-opacity duration-700 delay-200 ${
          entered ? "opacity-100" : "opacity-0"
        }`}
      >
        {children}
      </div>

      {/* Entrance passage — fades out to reveal the content */}
      {!introGone && (
        <div
          className={`fixed inset-0 z-20 flex flex-col justify-center overflow-y-auto px-16 md:px-[20vw] py-16 transition-opacity duration-500 ${
            entered ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="text-sm leading-relaxed italic max-w-xl">
            <p>
              A place to let a thought exist and expire is rare now. To let a moment ring until the next tone replaces it is muddled by persistence, portfolios and collations of 'who I am'.
              <br/>
              'Who am I' lives only until you let it. Answers to that - if any - even more ephemeral. 
            </p>
            <p className="mt-4">
This is a study of only the state, not the stream. <br/>
Each moment only replaced when the next is one chooses to.
What you see here will not live longer than when the next. There is no archive to this. There is just what you will see.
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
