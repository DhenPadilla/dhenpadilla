import { AudioPlayer } from "@/app/_components/audio-player";
import Container from "@/app/_components/container";
import CopyLinkButton from "@/app/_components/copy-link";
import { PostBody } from "@/app/_components/post-body";
import { PostHeader } from "@/app/_components/post-header";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Post(props: Params) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || "");

  return (
    <main>
      <Container>
        <article className="flex flex-col md:flex-row w-full gap-6">
          <PostHeader
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
          />
          <PostBody content={content} />
        </article>
        <div className="w-full text-xs pt-20 pb-[200px]">
          If you're reading this, I'm really glad you're <span className="italic">here</span>.
          <br />
          If this resonates, <Link href="mailto:dhenepadilla@gmail.com" className="underline text-gray-500 hover:text-gray-700">
            share your thoughts with me
          </Link>, or <CopyLinkButton>
            send it to someone
          </CopyLinkButton>
        </div>
        {post.audio && (
          <AudioPlayer src={post.audio} title={post.title} audioTitle={post.audioTitle} />
        )}
      </Container>
    </main>
  );
}

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const post = getPostBySlug(params.slug);
  console.log(post);

  if (!post) {
    return notFound();
  }

  const title = `${post.title} | Dhen Padilla`;

  const images = post.coverImage ? [post.coverImage] : [];

  return {
    title,
    openGraph: {
      title,
      images,
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
