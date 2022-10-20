import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  ListingCancelled,
  ListingCreated,
  ListingPurchased,
  ListingUpdated
} from "../generated/NFTMarketplace/NFTMarketplace"

export function createListingCancelledEvent(
  dheNFTAddress: Address,
  tokenId: BigInt,
  seller: Address
): ListingCancelled {
  let listingCancelledEvent = changetype<ListingCancelled>(newMockEvent())

  listingCancelledEvent.parameters = new Array()

  listingCancelledEvent.parameters.push(
    new ethereum.EventParam(
      "dheNFTAddress",
      ethereum.Value.fromAddress(dheNFTAddress)
    )
  )
  listingCancelledEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  listingCancelledEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )

  return listingCancelledEvent
}

export function createListingCreatedEvent(
  dheNFTAddress: Address,
  tokenId: BigInt,
  price: BigInt,
  seller: Address
): ListingCreated {
  let listingCreatedEvent = changetype<ListingCreated>(newMockEvent())

  listingCreatedEvent.parameters = new Array()

  listingCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "dheNFTAddress",
      ethereum.Value.fromAddress(dheNFTAddress)
    )
  )
  listingCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  listingCreatedEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )
  listingCreatedEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )

  return listingCreatedEvent
}

export function createListingPurchasedEvent(
  dheNFTAddress: Address,
  tokenId: BigInt,
  seller: Address,
  buyer: Address
): ListingPurchased {
  let listingPurchasedEvent = changetype<ListingPurchased>(newMockEvent())

  listingPurchasedEvent.parameters = new Array()

  listingPurchasedEvent.parameters.push(
    new ethereum.EventParam(
      "dheNFTAddress",
      ethereum.Value.fromAddress(dheNFTAddress)
    )
  )
  listingPurchasedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  listingPurchasedEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  listingPurchasedEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )

  return listingPurchasedEvent
}

export function createListingUpdatedEvent(
  dheNFTAddress: Address,
  tokenId: BigInt,
  newPrice: BigInt,
  seller: Address
): ListingUpdated {
  let listingUpdatedEvent = changetype<ListingUpdated>(newMockEvent())

  listingUpdatedEvent.parameters = new Array()

  listingUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "dheNFTAddress",
      ethereum.Value.fromAddress(dheNFTAddress)
    )
  )
  listingUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  listingUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newPrice",
      ethereum.Value.fromUnsignedBigInt(newPrice)
    )
  )
  listingUpdatedEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )

  return listingUpdatedEvent
}
