import fs from "fs";
import { join } from "path";
import matter from "gray-matter";

const listingsDirectory = join(process.cwd(), "_listings");

export function getListingIds() {
  return fs.readdirSync(listingsDirectory);
}

export function getListingByTokenId(tokenId, fields = []) {
  const realTokenId = tokenId.replace(/\.md$/, "");
  const fullPath = join(listingsDirectory, `${realTokenId}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const items = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === "tokenId") {
      items[field] = realTokenId;
    }
    if (field === "content") {
      items[field] = content;
    }

    if (typeof data[field] !== "undefined") {
      items[field] = data[field];
    }
  });

  return items;
}

export function getAllListings(fields = []) {
  const tokenIds = getListingIds();
  const listings = tokenIds
    .map((tokenId) => getListingByTokenId(tokenId, fields))
    // sort posts by date in descending order
    .sort((listing1, listing2) => (listing1.tokenId < listing2.tokenId ? -1 : 1));
  console.log("listings: ", listings);
  return listings;
}
