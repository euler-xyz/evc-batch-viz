import { Abi, createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

import abiEulerRouter from "../abi/EulerRouter";
import abiEVault from "../abi/EVault";
import abiEvc from "../abi/EthereumVaultConnector";
import abiPerspective from "../abi/BasePerspective";
import abiSwapper from "../abi/Swapper";
import abiSwapVerifier from "../abi/SwapVerifier";

export const ethereumClient = createPublicClient({
  chain: mainnet,
  transport: http("https://rpc.ankr.com/eth"),
});

export const abi = [
  ...abiEvc,
  ...abiEVault,
  ...abiEulerRouter,
  ...abiPerspective,
  ...abiSwapper,
  ...abiSwapVerifier,
];

function extractFunctionNames(a: Abi): string[] {
  return a
    .flatMap((abiItem) => {
      if (abiItem.type === "function") return abiItem.name;
      return [];
    })
}

export const evcFunctionNames = extractFunctionNames(abiEvc); 
export const eVaultFunctionNames = extractFunctionNames(abiEVault); 
export const eulerRouterFunctionNames = extractFunctionNames(abiEulerRouter); 
export const perpsectiveFunctionNames = extractFunctionNames(abiPerspective); 