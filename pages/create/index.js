import { Contract } from "ethers";
import { isAddress, parseEther } from "ethers/lib/utils";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "urql";
import { useSigner, useContract } from "wagmi";
import MarketplaceABI from "../../abis/NFTMarketplace.json";
import Header from "../../components/Header";
import {
    dhenNFTAbi,
    NFT_CONTRACT_ADDRESS,
    NFT_MARKETPLACE_ADDRESS,
    SUBGRAPH_URL
} from "../../constants";
import { listingsQuery } from "../../utils/graphQueries";

export const Create = () => {
  // State variables to contain information about the NFT being sold
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [showListingLink, setShowListingLink] = useState(false);
  const [tokenId, setTokenId] = useState(0);

  // Create a urql client
  const urqlClient = createClient({
    url: SUBGRAPH_URL,
  });

  // Get signer from wagmi
  const { data: signer } = useSigner();
  const MarketplaceContract = useContract({
    address: NFT_MARKETPLACE_ADDRESS,
    abi: MarketplaceABI,
    signerOrProvider: signer,
  });

  useEffect(() => {
    getNewTokenId();
  }, [])

  // Main function to be called when Create button is clicked;
  const handleCreateListing = async () => {
    // Set loading status to true
    setLoading(true);

    try {
      // Make sure the contract address is a valid address
      const isValidAddress = isAddress(NFT_CONTRACT_ADDRESS);
      if (!isValidAddress) {
        throw new Error(`invalid contract address`);
      }

      const signerAddress = await signer.getAddress();

      // Initialise a contract instance for the NFT contract
      const DheNFTContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        dhenNFTAbi,
        signer
      );

        
      // Mint a new DheNFT
      await mintToken(DheNFTContract);
      // Make sure it's me
      const dhen = await DheNFTContract.ownerOf(tokenId);
      if (dhen.toLowerCase() !== signerAddress.toLowerCase()) {
        throw new Error(`You do not own this.`);
      }

      // Request approval over NFTs if required, then create listing
      await requestApproval(DheNFTContract, signerAddress);
      await createListing(MarketplaceContract);

    //   Start displaying a button to view the NFT details
      setShowListingLink(true);
    } catch (err) {
      console.log(err);
    }
  };

  const mintToken = async (dheNFTContract) => {
    await dheNFTContract.mintDhenToken();
  };

  const getNewTokenId = async() => {
    const response = await urqlClient.query(listingsQuery).toPromise();
    const size = response.data.listingEntities.length;
    setTokenId(size + 1);
  }

  // Function to check if NFT approval is required
  const requestApproval = async (DheNFTContract, signerAddress) => {
    // Check if user already gave approval to the marketplace
    const isApproved = await DheNFTContract.isApprovedForAll(
      signerAddress,
      NFT_MARKETPLACE_ADDRESS
    );

    // If not approved
    if (!isApproved) {
      console.log("Requesting approval over NFTs...");

      // Send approval transaction to NFT contract
      const approvalTxn = await DheNFTContract.setApprovalForAll(
        NFT_MARKETPLACE_ADDRESS,
        true
      );
      await approvalTxn.wait();
    }
  };

  const createListing = async (MarketplaceContract) => {
    const createListingTxn = await MarketplaceContract.createListing(
      NFT_CONTRACT_ADDRESS,
      tokenId,
      parseEther(price)
    );

    await createListingTxn.wait();
  };

  return (
    <>
      <Head>
        <title>create dhenft</title>
      </Head>
      <div className={`px-10 mb-10`}>
        <Header isBlog={false}></Header>
        <div className="mt-10">
          <h1 className="mob:p-2 text-bold text-2xl laptop:text-2xl">
            create dhenft
          </h1>
        </div>
        <div className="mt-10">
          <h1 className="mob:p-2 text-bold text-2xl laptop:text-2xl">
              potential new token id: {tokenId}
          </h1>
        </div>
        <div className="mt-10">
          <h1 className="mob:p-2 text-bold text-2xl laptop:text-2xl">
            contract address: {NFT_CONTRACT_ADDRESS}
          </h1>
        </div>
        <div className="mt-10">
          <input
            className="m-4 w-full"
            type="text"
            placeholder="Price (in CELO)"
            value={price}
            onChange={(e) => {
              if (e.target.value === "") {
                setPrice("0");
              } else {
                setPrice(e.target.value);
              }
            }}
          />
        </div>
        <div className="mt-10 ml-4">
          {/* Button to create the listing */}
          <button onClick={handleCreateListing} disabled={loading}>
            {loading ? "Loading..." : "Create"}
          </button>

          {/* Button to take user to the NFT details page after listing is created */}
          {showListingLink && (
            <Link href={`/gallery/${tokenId}`}>
              <a>
                <button>View Listing</button>
              </a>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Create;