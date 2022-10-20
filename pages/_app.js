import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { ThemeProvider } from "next-themes";
import { connectorsForWallets, RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { injectedWallet,
  rainbowWallet,
  metaMaskWallet,
  coinbaseWallet, 
  omniWallet, 
  walletConnectWallet 
} from '@rainbow-me/rainbowkit/wallets';
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
// Import known recommended wallets
import { Valora, CeloWallet, CeloDance } from "@celo/rainbowkit-celo/wallets";
// Import CELO chain information
import { Celo } from "@celo/rainbowkit-celo/chains";

const { chains, provider } = configureChains(
  [Celo],
  [jsonRpcProvider({ rpc: (chain) => ({ http: chain.rpcUrls.default }) })]
);

const connectors = connectorsForWallets([
  {
    groupName: "Recommended with CELO",
    wallets: [
      Valora({ chains }),
      CeloWallet({ chains }),
      CeloDance({ chains }),
      omniWallet({ chains }),
      injectedWallet({ chains }),
      rainbowWallet({ chains }),
      metaMaskWallet({ chains }),
      coinbaseWallet({ chains, appName: 'dhen padilla gallery' }),
      walletConnectWallet({ chains }),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});


const App = ({ Component, pageProps }) => {
  return (
    <ThemeProvider>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider 
          chains={chains} 
          theme={
            lightTheme({
              accentColor: '#666666',  //color of wallet  try #703844
              accentColorForeground: '#fff', //color of text
              borderRadius: 'small', //rounded edges
              // fontStack: 'times',
            })}>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </ThemeProvider>
  );
};

export default App;
