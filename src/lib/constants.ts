import {
  type Abi,
  Chain,
  createPublicClient,
  getAddress,
  http,
  PublicClient,
  defineChain,
} from "viem";
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
  VaultGovernorAddresses,
} from "./types";

import coreAddresses_1 from "../../euler-interfaces/addresses/1/CoreAddresses.json";
import peripheryAddresses_1 from "../../euler-interfaces/addresses/1/PeripheryAddresses.json";
import vaultGovernorAddresses_1 from "../../euler-interfaces/addresses/1/GovernorAddresses.json";
import coreAddresses_1923 from "../../euler-interfaces/addresses/1923/CoreAddresses.json";
import peripheryAddresses_1923 from "../../euler-interfaces/addresses/1923/PeripheryAddresses.json";
import vaultGovernorAddresses_1923 from "../../euler-interfaces/addresses/1923/GovernorAddresses.json";
import coreAddresses_8453 from "../../euler-interfaces/addresses/8453/CoreAddresses.json";
import peripheryAddresses_8453 from "../../euler-interfaces/addresses/8453/PeripheryAddresses.json";
import vaultGovernorAddresses_8453 from "../../euler-interfaces/addresses/8453/GovernorAddresses.json";

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
    vaultGovernor?: VaultGovernorAddresses;
  };
} = {
  1: {
    core: coreAddresses_1 as CoreAddresses,
    periphery: peripheryAddresses_1 as PeripheryAddresses,
    vaultGovernor: vaultGovernorAddresses_1 as VaultGovernorAddresses,
  },
  1923: {
    core: coreAddresses_1923 as CoreAddresses,
    periphery: peripheryAddresses_1923 as PeripheryAddresses,
    vaultGovernor: vaultGovernorAddresses_1923 as VaultGovernorAddresses,
  },
  8453: {
    core: coreAddresses_8453 as CoreAddresses,
    periphery: peripheryAddresses_8453 as PeripheryAddresses,
    vaultGovernor: vaultGovernorAddresses_8453 as VaultGovernorAddresses,
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


const swellnetwork = defineChain({
  id: 1923,
  name: 'Swell',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://swell-mainnet.alt.technology'],
      webSocket: ['wss://swell-mainnet.alt.technology'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://explorer.swellnetwork.io' },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 1,
    },
  },
});


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
  [swellnetwork.id]: {
    id: swellnetwork.id,
    explorerUrl: "https://explorer.swellnetwork.io",
    client: createPublicClient({
      chain: swellnetwork,
      transport: http("https://swell-mainnet.alt.technology"),
    }) as PublicClient,
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
  const vaultGovernorAddresses = globalAddresses[chainId].vaultGovernor;

  const a: AddressMetadataMap<AddressMetadata> = {
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

  if (vaultGovernorAddresses) {
    a[getAddress(vaultGovernorAddresses.accessControlEmergencyGovernor)] = {
      kind: "global",
      label: "DAO Governor Access Control",
    };
  }

  return a;
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
    "0xEe009FAF00CF54C1B4387829aF7A8Dc5f0c8C8C5": {
      kind: "global",
      label: "Euler Deployer (Ethereum)",
    },
    "0xcAD001c30E96765aC90307669d578219D4fb1DCe": {
      kind: "global",
      label: "Euler DAO Treasury Multisig (Ethereum)",
    },
    "0xB1345E7A4D35FB3E6bF22A32B3741Ae74E5Fba27": {
      kind: "global",
      label: "Euler Labs Ops Multisig (Ethereum)",
    },
    "0xb3b84e8320250Afe7a5fb313Ee32B52982b73c53": {
      kind: "global",
      label: "Euler Security Council Multisig (Ethereum)",
    },
    "0x8731765b635D5Dc45159f0A2C7D748C3927d68a6": {
      kind: "global",
      label: "Euler Deployer (Base)",
    },
    "0x1e13B0847808045854Ddd908F2d770Dc902Dcfb8": {
      kind: "global",
      label: "Euler DAO Treasury Multisig (Base)",
    },
    "0x33C71422B3E20ef2472Bc9aa9252220CAeAF207e": {
      kind: "global",
      label: "Euler Labs Ops Multisig (Base)",
    },
    "0x5a3f0c8BC2ab1d35c5E7e9e98757CF2Ed762BC73": {
      kind: "global",
      label: "Euler Security Council Multisig (Base)",
    },
    "0x223c87de4e41448adfDe6F4F93D9bD4DEA9d88d1": {
      kind: "global",
      label: "DAO Governor Access Control (Base)",
    },
    "0x5B13E9c627d4114E9bCd6755fF174A6a5017D364": {
      kind: "global",
      label: "Euler Deployer (Polygon)",
    },
    "0x6849230767A5C61C6b9eEfb0405f0FB707eF14E6": {
      kind: "global",
      label: "Euler DAO Treasury Multisig (Polygon)",
    },
    "0x12dFb66acf7c67E4ED0678a479B65eE31bd8f3d2": {
      kind: "global",
      label: "Euler Labs Ops Multisig (Polygon)",
    },
    "0x2D27adb58A2DF0c3cC838C3071623E905f7400fd": {
      kind: "global",
      label: "Euler Security Council Multisig (Polygon)",
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
