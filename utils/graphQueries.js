// The GraphQL query to run
export const listingsQuery = `
    query ListingsQuery {
    listingEntities {
        id
        nftAddress
        tokenId
        price
        seller
        buyer
    }
    }
`;

export const findListing = (tokenId) => {
  console.log("tokenId? ", tokenId);
  return `
    query ListingQuery {
        listingEntities(where: {tokenId: ${tokenId}}) {
          id
          nftAddress
          tokenId
          price
          buyer
        }
    }`;
};