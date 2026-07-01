import type { MDXComponents } from "mdx/types";
import { MediaRow, Img, Vid } from "@/app/_components/now-media";

// Makes <MediaRow>, <Img>, <Vid> usable in any .mdx file with no imports.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    MediaRow,
    Img,
    Vid,
    ...components,
  };
}
