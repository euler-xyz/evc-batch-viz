import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

import abiEulerRouter from "../abi/EulerRouter";
import abiEVault from "../abi/EVault";
import abiEvc from "../abi/EthereumVaultConnector";
import abiPerspective from "../abi/BasePerspective";

export const ethereumClient = createPublicClient({
  chain: mainnet,
  transport: http(
    "https://eth-mainnet.g.alchemy.com/v2/EnSvsHJcAyHNTHaFvDiSjoHsmLlABN7P"
  ),
});

export const abi = [
  ...abiEvc,
  ...abiEVault,
  ...abiEulerRouter,
  ...abiPerspective,
];
