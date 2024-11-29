import { createRoot } from "react-dom/client";
import "@fontsource-variable/inter";

import App from "./App";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { AddressMetadataProvider } from "./context/AddressContext";
import { initAddressMetadataMap, supportedChains } from "./lib/constants";
import { mainnet } from "viem/chains";
import { ChainConfigProvider } from "./context/ChainContext";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <ChainConfigProvider initialChain={supportedChains[mainnet.id]}>
    <AddressMetadataProvider
      initialMetadata={initAddressMetadataMap(mainnet.id)}
    >
      <ChakraProvider
        theme={extendTheme({
          fonts: {
            heading: `'Inter Variable', sans-serif`,
            body: `'Inter Variable', sans-serif`,
          },
        })}
      >
        <App />
      </ChakraProvider>
    </AddressMetadataProvider>
  </ChainConfigProvider>
);
