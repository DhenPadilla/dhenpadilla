
/** @type {import('next').NextConfig} */
require("dotenv").config({ path: ".env" })

const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['https://dhenpadilla-nfts.s3.eu-west-1.amazonaws.com'],
  },
  env: {
    ALFAJORES_NFT_ADDRESS: "0x9A47c22630553B4C705a69e4A079aB23199E9EFA",
    ALFAJORES_NFT_MARKETPLACE_ADDRESS: "0x6b9eF3C39D2B31698D9C6b20E3871baA737539d3",
    MAINNET_NFT_ADDRESS: "0xac2FA32Ad39F162570E6d749B676143CceF98fd6",
    MAINNET_NFT_MARKETPLACE_ADDRESS: "0x048eD040c29c21432720e69029a34Ef3eF792326",
  }
}

module.exports = nextConfig
