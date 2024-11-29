import { type Abi, Chain, createPublicClient, http, PublicClient } from "viem";
import { base, mainnet } from "viem/chains";

import abiEulerRouter from "../abi/EulerRouter";
import abiEVault from "../abi/EVault";
import abiEvc from "../abi/EthereumVaultConnector";
import abiPerspective from "../abi/BasePerspective";
import abiSwapper from "../abi/Swapper";
import abiSwapVerifier from "../abi/SwapVerifier";
import abiPermit2 from "../abi/Permit2";
import abiPythProxy from "../abi/PythProxy";
import abiTrackingRewardStreams from "../abi/TrackingRewardSteams";
import abiFeeFlowController from "../abi/FeeFlowController";
import abiSnapshotRegistry from "../abi/SnapshotRegistry";
import type {
  AddressMetadata,
  AddressMetadataMap,
  ChainConfig,
  CoreAddresses,
  PeripheryAddresses,
} from "./types";

import coreAddresses_1 from "../../euler-interfaces/addresses/1/CoreAddresses.json";
import peripheryAddresses_1 from "../../euler-interfaces/addresses/1/PeripheryAddresses.json";
import coreAddresses_8453 from "../../euler-interfaces/addresses/8453/CoreAddresses.json";
import peripheryAddresses_8453 from "../../euler-interfaces/addresses/8453/PeripheryAddresses.json";

export const abi = [
  ...abiEvc,
  ...abiEVault,
  ...abiEulerRouter,
  ...abiPerspective,
  ...abiSwapper,
  ...abiSwapVerifier,
  ...abiPermit2,
  ...abiPythProxy,
  ...abiTrackingRewardStreams,
  ...abiFeeFlowController,
  ...abiSnapshotRegistry,
];

const globalAddresses: {
  [chainId: number]: {
    core: CoreAddresses;
    periphery: PeripheryAddresses;
  };
} = {
  1: {
    core: coreAddresses_1 as CoreAddresses,
    periphery: peripheryAddresses_1 as PeripheryAddresses,
  },
  8453: {
    core: coreAddresses_8453 as CoreAddresses,
    periphery: peripheryAddresses_8453 as PeripheryAddresses,
  },
};

function extractFunctionNames(a: Abi): string[] {
  return a.flatMap((abiItem) => {
    if (abiItem.type === "function") return abiItem.name;
    return [];
  });
}

export const evcFunctionNames = extractFunctionNames(abiEvc);
export const eVaultFunctionNames = extractFunctionNames(abiEVault);
export const eulerRouterFunctionNames = extractFunctionNames(abiEulerRouter);

export const supportedChains: {
  [chainId: number]: ChainConfig;
} = {
  [mainnet.id]: {
    id: mainnet.id,
    explorerUrl: "https://etherscan.io",
    client: createPublicClient({
      chain: mainnet,
      transport: http("https://rpc.ankr.com/eth"),
    }),
  },
  [base.id]: {
    id: base.id,
    explorerUrl: "https://basescan.org",
    client: createPublicClient({
      chain: base,
      transport: http("https://rpc.ankr.com/base"),
    }) as PublicClient,
  },
};

function loadDeploymentAddresses(
  chainId: number
): AddressMetadataMap<AddressMetadata> {
  const coreAddresses = globalAddresses[chainId].core;
  const peripheryAddresses = globalAddresses[chainId].periphery;

  return {
    [coreAddresses.balanceTracker]: {
      kind: "global",
      label: "Balance Tracker",
    },
    [coreAddresses.eVaultFactory]: {
      kind: "global",
      label: "EVault Factory",
    },
    [coreAddresses.eVaultFactoryGovernor]: {
      kind: "global",
      label: "EVault Factory Governor",
    },
    [coreAddresses.eVaultImplementation]: {
      kind: "global",
      label: "EVault Implementation",
    },
    [coreAddresses.evc]: {
      kind: "global",
      label: "EVC",
    },
    [coreAddresses.permit2]: {
      kind: "global",
      label: "Permit2",
    },
    [coreAddresses.protocolConfig]: {
      kind: "global",
      label: "Protocol Config",
    },
    [coreAddresses.sequenceRegistry]: {
      kind: "global",
      label: "Sequence Registry",
    },
    [peripheryAddresses.escrowedCollateralPerspective]: {
      kind: "global",
      label: "Escrowed Collateral Perspective",
    },
    [peripheryAddresses.eulerUngoverned0xPerspective]: {
      kind: "global",
      label: "Ungoverned 0x Perspective",
    },
    [peripheryAddresses.eulerUngovernedNzxPerspective]: {
      kind: "global",
      label: "Ungoverned NZX Perspective",
    },
    [peripheryAddresses.evkFactoryPerspective]: {
      kind: "global",
      label: "EVK Factory Perspective",
    },
    [peripheryAddresses.externalVaultRegistry]: {
      kind: "global",
      label: "External Vault Registry",
    },
    [peripheryAddresses.feeFlowController]: {
      kind: "global",
      label: "Fee Flow Controller",
    },
    [peripheryAddresses.governedPerspective]: {
      kind: "global",
      label: "Governed Perspective",
    },
    [peripheryAddresses.irmRegistry]: {
      kind: "global",
      label: "IRM Registry",
    },
    [peripheryAddresses.kinkIRMFactory]: {
      kind: "global",
      label: "Kink IRM Factory",
    },
    [peripheryAddresses.oracleAdapterRegistry]: {
      kind: "global",
      label: "Oracle Adapter Registry",
    },
    [peripheryAddresses.oracleRouterFactory]: {
      kind: "global",
      label: "Oracle Router Factory",
    },
    [peripheryAddresses.swapVerifier]: {
      kind: "global",
      label: "Swap Verifier",
    },
    [peripheryAddresses.swapper]: {
      kind: "global",
      label: "Swapper",
    },
    [peripheryAddresses.termsOfUseSigner]: {
      kind: "global",
      label: "Terms of Use Signer",
    },
  };
}

const designatorTokens: AddressMetadataMap<AddressMetadata> = {
  "0x0000000000000000000000000000000000000348": {
    kind: "token",
    symbol: "USD",
    name: "USD (Designator)",
    decimals: 18,
  },
  "0x00000000000000000000000000000000000003d2": {
    kind: "token",
    symbol: "EUR",
    name: "EUR (Designator)",
    decimals: 18,
  },
  "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB": {
    kind: "token",
    symbol: "BTC",
    name: "BTC (Designator)",
    decimals: 18,
  },
};

export function initAddressMetadataMap(
  chainId: number
): AddressMetadataMap<AddressMetadata> {
  return {
    ...loadDeploymentAddresses(chainId),
    ...designatorTokens,
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
      label: "Swapper [LEGACY]",
    },
    "0x9b2583d98fb39aA675CAA33b81EfbD539Bdf276c": {
      kind: "global",
      label: "Swapper [LEGACY]",
    },
    "0xae26485ACDDeFd486Fe9ad7C2b34169d360737c7": {
      kind: "global",
      label: "Swap Verifier",
    },
  };
}
