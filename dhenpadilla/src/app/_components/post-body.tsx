'use client'

import Link from "next/link";
import markdownStyles from "./markdown-styles.module.css";
import { useState } from "react";

type Props = {
  content: string;
};

export function PostBody({ content }: Props) {

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  
  return (
    <>
    <div className="max-w-2xl mx-auto md:pr-[100px] pt-4 md:pt-[100px]">
      <div
        className={markdownStyles["markdown"]}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
    </>
  );
}
