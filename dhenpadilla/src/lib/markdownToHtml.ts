import { remark } from "remark";
import html from "remark-html";
import breaks from "remark-breaks";
import supersub from 'remark-supersub'


export default async function markdownToHtml(markdown: string) {
  const result = await remark()
    .use(breaks)
    .use(html)
    .use(supersub)
    .process(markdown);
  return result.toString();
}
