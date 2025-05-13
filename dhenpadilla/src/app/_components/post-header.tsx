import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateFormatter from "./date-formatter";
import { PostTitle } from "@/app/_components/post-title";
import { type Author } from "@/interfaces/author";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  author: Author;
};

export function PostHeader({ title, date  }: Props) {
  return (
    <div className="flex flex-col sticky h-[100vh] gap-2 py-[200px]">
      <div className="text-lg font-base">{title}</div>
      <div className="text-sm italic">{new Date(date).getMonth()}.{new Date(date).getFullYear()}</div>
    </div>
  );
}
