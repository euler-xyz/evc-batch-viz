import { Abi, AbiParameter, createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

import abiEulerRouter from "../abi/EulerRouter";
import abiEVault from "../abi/EVault";
import abiEvc from "../abi/EthereumVaultConnector";
import abiPerspective from "../abi/BasePerspective";
import abiSwapper from "../abi/Swapper";
import abiSwapVerifier from "../abi/SwapVerifier";
import abiPermit2 from "../abi/Permit2";
import abiPythProxy from "../abi/PythProxy";
import { AddressMetadata, AddressMetadataMap } from "./types";

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
  ...abiPermit2,
  ...abiPythProxy,
];

function extractFunctionNames(a: Abi): string[] {
  return a.flatMap((abiItem) => {
    if (abiItem.type === "function") return abiItem.name;
    return [];
  });
}

export const evcFunctionNames = extractFunctionNames(abiEvc);
export const eVaultFunctionNames = extractFunctionNames(abiEVault);
export const eulerRouterFunctionNames = extractFunctionNames(abiEulerRouter);
export const perpsectiveFunctionNames = extractFunctionNames(abiPerspective);

export const initAddressMetadataMap: AddressMetadataMap<AddressMetadata> = {
  "0x000000000022D473030F116dDEE9F6B43aC78BA3": {
    kind: "global",
    label: "Permit2",
  },
  "0x0C9a3dd6b8F28529d72d7f9cE918D493519EE383": {
    kind: "global",
    label: "EVC",
  },
  "0xcAD001c30E96765aC90307669d578219D4fb1DCe": {
    kind: "global",
    label: "Euler Multisig",
  },
  "0x4305FB66699C3B2702D4d05CF36551390A4c69C6": {
    kind: "global",
    label: "Pyth Proxy",
  },
  "0xbF893F7062FCcEB83d295e7FB407a64F941d5204": {
    kind: "global",
    label: "Swapper",
  },
  "0xae26485ACDDeFd486Fe9ad7C2b34169d360737c7": {
    kind: "global",
    label: "Swap Verifier",
  },
  "0x0000000000000000000000000000000000000348": {
    kind: "token",
    symbol: "USD",
    name: "USD (Designator)",
    decimals: 18,
  },
};
