import {
  ListingCancelled,
  ListingCreated,
  ListingPurchased,
  ListingUpdated
} from "../generated/NFTMarketplace/NFTMarketplace"
import { store } from "@graphprotocol/graph-ts";
import { ListingEntity } from "../generated/schema"

export function handleListingCancelled(event: ListingCancelled): void {
  const id = event.params.dheNFTAddress.toHex() + event.params.tokenId.toString() + event.params.seller.toHex();

  let listing = ListingEntity.load(id);

  if (listing) {
    store.remove("ListingEntity", id);
  }
}

export function handleListingCreated(event: ListingCreated): void {
  const id = event.params.dheNFTAddress.toHex() + event.params.tokenId.toString() + event.params.seller.toHex();

  let listing = new ListingEntity(id);

  listing.seller = event.params.seller;
  listing.nftAddress = event.params.dheNFTAddress;
  listing.tokenId = event.params.tokenId;
  listing.price = event.params.price;

  listing.save();
}

export function handleListingPurchased(event: ListingPurchased): void {
  const id = event.params.dheNFTAddress.toHex() + event.params.tokenId.toString() + event.params.seller.toHex();

  let listing = ListingEntity.load(id);

  if (listing) {
    listing.buyer = event.params.buyer;

    listing.save();
  }
}

export function handleListingUpdated(event: ListingUpdated): void {
  const id = event.params.dheNFTAddress.toHex() + event.params.tokenId.toString() + event.params.seller.toHex();

  let listing = ListingEntity.load(id);

  if (listing) {
    // Update the price
    listing.price = event.params.newPrice;
    // Save the chagnes
    listing.save();
  }

}