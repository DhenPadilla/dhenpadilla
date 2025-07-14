'use client';

import { useState } from "react";

type Props = {
    children: React.ReactNode;
}

export default function CopyLinkButton({ children }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
        <span onClick={handleCopy} className="underline text-gray-500 hover:text-gray-700 cursor-pointer">
            {children}
        </span>
        <span className="text-black">.</span>
        <span className="text-gray-500 ml-1">
            {copied ? "- copied" : null}
        </span>
    </>
  );
}