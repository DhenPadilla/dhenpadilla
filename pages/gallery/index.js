import { ConnectButton } from "@rainbow-me/rainbowkit";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import Cursor from "../../components/Cursor";
import Header from "../../components/Header";
import data from "../../data/portfolio.json";
import { createClient } from "urql";
import { useAccount, useProvider } from "wagmi";

import { dhenNFTAbi, NFT_CONTRACT_ADDRESS, SUBGRAPH_URL, baseUri } from "../../constants";
import Listing from "../../components/Listing";
import { Contract } from "ethers";
import { listingsQuery } from "../../utils/graphQueries";

const Gallery = () => {
  const text = useRef();
  
  const [listings, setListings] = useState();
  const [loading, setLoading] = useState(false);
  
  // Get the provider, connected address, and a contract instance
  // for the NFT contract using wagmi
  const provider = useProvider();
  const { isConnected, address } = useAccount();

  // Function to fetch listings from the subgraph
  const fetchListings = async () => {
    setLoading(true);
    // Create a urql client
    const urqlClient = createClient({
      url: SUBGRAPH_URL,
    });

    // Send the query to the subgraph GraphQL API, and get the response
    const response = await urqlClient.query(listingsQuery).toPromise();
    const listingEntities = response.data.listingEntities.map((listing) => {
      return {
        ...listing, 
        name: parseInt(listing.tokenId) < 10 ? `untitled 0${listing.tokenId}` : `untitled ${listing.tokenId}`
      };
    });
    console.log(listingEntities);

    // Update state variables
    setListings(listingEntities);
    setLoading(false);
  }

  useEffect(() => {
    if (isConnected) {
      fetchListings();
    }
    else {
      const pseudoListings = Array.from({length: 20}, (_, i) => { 
        return { 
          tokenId: `${(i + 1)}`,
          name: (i < 10) ? `untitled 0${i}` : `untitled ${i}`
        }
      });
      setListings(pseudoListings);
    }
  }, []);

  return (
      <>
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
              nft gallery
            </h1>
            <div className="w-full flex justify-between">
              <p className="p-2 w-1/2">all work is my own. each one is a dhen-nft built by me and deployed on celo. { isConnected ? "have a browse." : "connect your celo wallet to see which are still available to purchase." }</p>
              <div className="float-right">
                <ConnectButton/>
              </div>
            </div>
            { loading ? 
              <div className="relative flex flex-row my-10 h-[500px] w-full overflow-x-scroll scroll whitespace-nowrap scroll-smooth">
                loading...
              </div>
              :
              <div className="relative flex flex-row my-10 h-[500px] w-full overflow-x-scroll scroll whitespace-nowrap scroll-smooth">
                {listings &&
                  listings.map((listing) => (
                    <div className="inline-block flex-none mx-2 h-[400px] align-bottom ease-in duration-100 hover:cursor-pointer hover:opacity-70">
                      <Listing key={listing.tokenId} name={listing.name} tokenId={listing.tokenId} imageUrl={`${baseUri}${listing.tokenId}.jpg`}/>
                    </div>
                  ))
                }
              </div> 
            }
          </div>
        </div>
      </>
  );
};

export default Gallery;
