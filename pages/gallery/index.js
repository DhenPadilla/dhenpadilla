import Head from "next/head";
import Router, { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { stagger } from "../../animations";
import Button from "../../components/Button";
import Cursor from "../../components/Cursor";
import Header from "../../components/Header";
import data from "../../data/portfolio.json";
import { ISOToDate, useIsomorphicLayoutEffect } from "../../utils";
import { getAllPosts } from "../../utils/api";
const Gallery = ({ posts }) => {
  const text = useRef();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);


  useEffect(() => {
    setMounted(true);
  }, []);

  return (
      <>
        {data.showCursor && <Cursor />}
        <Head>
          <title>nft gallery</title>
        </Head>
        <div
          className={`px-10 mb-10 ${
            data.showCursor && "cursor-none"
          }`}
        >
          <Header isBlog={true}></Header>
          <div className="mt-10">
            <h1
              ref={text}
              className="mob:p-2 text-bold text-2xl laptop:text-2xl"
            >
              gallery
            </h1>
            <p className="p-2">all work is my own. each one is a dhen-nft built by me and deployed on celo. contact me to buy one</p>
            <div className="relative flex flex-row my-10 h-[500px] w-full overflow-x-scroll scroll whitespace-nowrap scroll-smooth">
              {posts &&
                posts.map((post) => (
                  <div className="inline-block flex-none mx-2 h-[400px] align-bottom ease-in duration-100 hover:cursor-pointer hover:opacity-70" 
                       key={post.slug}
                       onClick={() => router.push(`/gallery/${post.slug}`)}>
                    <img
                      className="object-cover h-full"
                      src={post.image}
                      alt={post.title}
                    />
                    <h2 className="mt-2 text-md">{post.title}</h2>
                    <span className="text-sm my-2 opacity-25">{ISOToDate(post.date)}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </>
  );
};

export async function getStaticProps() {
  const posts = getAllPosts([
    "slug",
    "title",
    "image",
    "preview",
    "author",
    "date",
  ]);

  return {
    props: {
      posts: [...posts],
    },
  };
}

export default Gallery;
