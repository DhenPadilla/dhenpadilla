import markdownStyles from "./markdown-styles.module.css";

type Props = {
  content: string;
};

export function PostBody({ content }: Props) {
  return (
    <div className="max-w-2xl mx-auto md:pr-[100px] py-4 md:py-[100px]">
      <div
        className={markdownStyles["markdown"]}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
