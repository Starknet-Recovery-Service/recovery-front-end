import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// 1. import `ChakraProvider` component
import { ChakraProvider } from "@chakra-ui/react";
import { WagmiConfig, createClient, chain, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { getDefaultProvider } from "ethers";
import {
  StarknetProvider,
  getInstalledInjectedConnectors,
} from "@starknet-react/core";

// const client = createClient({
//   autoConnect: true,
//   provider: getDefaultProvider(),
// });
const connectors = getInstalledInjectedConnectors();

const { chains, provider, webSocketProvider } = configureChains(
  [chain.goerli],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <StarknetProvider connectors={connectors}>
      <WagmiConfig client={client}>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </WagmiConfig>
    </StarknetProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
