import Head from "next/head";
import Link from "next/link";
import Button from "../../components/Button";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { createClient } from "urql";
import { useAccount, useSigner, useContract } from "wagmi";
import { stagger } from "../../animations";
import Header from "../../components/Header";
import { SUBGRAPH_URL, NFT_MARKETPLACE_ADDRESS } from "../../constants";
import MarketplaceABI from "../../abis/NFTMarketplace.json"
import data from "../../data/portfolio.json";
import { useIsomorphicLayoutEffect } from "../../utils";
import { getAllPosts, getPostBySlug } from "../../utils/api";
import { findListing } from "../../utils/graphQueries";
import { utils } from "ethers";
import { convert } from "../../utils/converter";
import { CustomConnect } from "../../components/CustomConnect";

const BlogPost = ({ post }) => {
  const textOne = useRef();
  const textTwo = useRef();
  const router = useRouter();

  const [listing, setListing] = useState();
  const [price, setPrice] = useState();
  const [name, setName] = useState();
  const [buying, setBuying] = useState();
  const [buyingError, setBuyingError] = useState();
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  // Get the provider, connected address, and a contract instance
  // for the NFT contract using wagmi
  const { data: signer } = useSigner();
  const MarketplaceContract = useContract({
    address: NFT_MARKETPLACE_ADDRESS,
    abi: MarketplaceABI,
    signerOrProvider: signer,
  });
  

  useIsomorphicLayoutEffect(() => {
    stagger([textOne.current, textTwo.current], { y: 30 }, { y: 0 });
  }, []);

  const { isConnected, address } = useAccount();

  // Function to fetch listings from the subgraph
  const fetchListing = async () => {
    setLoading(true);
    // Create a urql client
    const urqlClient = createClient({
      url: SUBGRAPH_URL,
    });

    // Send the query to the subgraph GraphQL API, and get the response
    const response = await urqlClient.query(findListing(post.slug)).toPromise();
    const listing = response.data.listingEntities[0];
    setListing(listing);

    const celoPrice = utils.formatUnits(listing.price, 18);
    const usdPrice = await convert(celoPrice);
    setPrice(usdPrice);
    setLoading(false);
  }

  useEffect(() => {
    setName(post.slug < 10 ? `untitled 0${post.slug}` : `untitled ${post.slug}`);
    if(isConnected) {
      fetchListing();
    }
  }, []);

  // Function to call `buyListing` in the smart contract
  const buyListing = async () => {
    setBuying(true);
    try {
      const buyTxn = await MarketplaceContract.purchaseListing(
        listing.nftAddress,
        post.slug,
        {
          value: listing.price,
        }
      );
      await buyTxn.wait();
      await fetchListing();
      setPurchaseSuccess(`https://dhenpadilla-nfts.s3.eu-west-1.amazonaws.com/${post.slug}.jpg`);
    } catch (err) { 
      if (err.data.message.includes("insufficient funds")) {
        setBuyingError("you do not have the right funds in your wallet")
      }
      else {
        setBuyingError(err.data.message);
      }
    }
    setBuying(false);
  }

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.preview} />
      </Head>

      <div
        className={`px-10 mt-10 ${
          data.showCursor && "cursor-none"
        }`}
      >
        <Header isBlog={true} />

        <div className="mt-10 flex flex-col w-full h-[500px]">
          <img
            className="w-full h-full object-contain object-left"
            src={post.image}
            alt={post.title}
          ></img>
          <h1
            ref={textOne}
            className="mt-10 text-2xl mob:text-md laptop:text-3xl text-bold"
          >
            {name}
          </h1>
          <p
            className="mt-2 max-w-4xl text-darkgray opacity-20"
          >
            {post.date} 
          </p>
          <div className="flex justify-between">
            { isConnected &&
              <div className="w-1/2 mb-10">
                <h2 className="mt-2 mob:hidden tablet:block max-w-4xl text-gray-400">
                  id: <span className="text-gray-600">{ loading ? 'loading...' : listing !== undefined ? listing.id : '' }</span>
                </h2>
                <h2 className="mob:max-w-sm tablet:max-w-4xl text-gray-400">
                  token address: <span className="text-gray-600 mob:max-w-sm">{loading ? 'loading...' : listing ? listing.nftAddress : ''}</span>
                </h2>
                { listing !== undefined && listing.buyer === null && 
                  <div>
                    <h2 className="max-w-4xl text-gray-400">
                      price: <span className="text-gray-600">${price}</span>
                    </h2>
                    <h2 className="max-w-4xl text-gray-400">
                      <span className="text-gray-600">available</span>
                    </h2>
                  </div>
                }
                { listing !== undefined && listing.buyer !== null &&
                  <h2 className="max-w-4xl text-gray-400">
                    buyer: <span className="text-gray-600">{listing.buyer}</span>
                  </h2>
                }
              </div>
            }
            { isConnected && listing !== undefined && listing.buyer === null &&
              <div className="w-[500px] float-right">
                <CustomConnect accountStatus="avatar"/>
                <button
                  className="hover:opacity-60"
                  disabled={buying}
                  onClick={buyListing}
                >
                  { buying ? "loading" : `click here to purchase '${name}'` }
                </button>
                <p className="mt-2">
                  { buyingError }
                </p>
              </div>
            }
            { purchaseSuccess &&
              <p className="mt-2">
                  <Link href={purchaseSuccess} passHref={true}>
                    <Button>See photo source</Button>
                  </Link>
                </p>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug, [
    "date",
    "slug",
    "preview",
    "title",
    "tagline",
    "preview",
    "image",
    "content",
  ]);

  return {
    props: {
      post: {
        ...post,
      },
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts(["slug"]);

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}
export default BlogPost;
