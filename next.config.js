
/** @type {import('next').NextConfig} */
require("dotenv").config({ path: ".env" })

const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['https://dhenpadilla-nfts.s3.eu-west-1.amazonaws.com'],
  },
  env: {
    ALFAJORES_NFT_ADDRESS: "0x9A47c22630553B4C705a69e4A079aB23199E9EFA",
    ALFAJORES_NFT_MARKETPLACE_ADDRESS: "0x6b9eF3C39D2B31698D9C6b20E3871baA737539d3"
  }
}

module.exports = nextConfig
