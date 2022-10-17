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