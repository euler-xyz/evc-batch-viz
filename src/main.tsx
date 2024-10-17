import { createRoot } from "react-dom/client";
import "@fontsource-variable/inter";

import App from "./App";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
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
);
