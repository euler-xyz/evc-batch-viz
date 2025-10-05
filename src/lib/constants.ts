import {
  type Abi,
  Chain,
  createPublicClient,
  getAddress,
  http,
  PublicClient,
  defineChain,
  parseAbi,
} from "viem";
import * as viemChains from "viem/chains";
import eulerChains from "../../euler-interfaces/EulerChains.json";

import abiEulerRouter from "../abi/EulerRouter";
import abiEVault from "../abi/EVault";
import abiEvc from "../abi/EthereumVaultConnector";
import abiPerspective from "../abi/BasePerspective";
import abiGovernedPerspective from "../abi/GovernedPerspective";
import abiSwapper from "../abi/Swapper";
import abiSwapVerifier from "../abi/SwapVerifier";
import abiPermit2 from "../abi/Permit2";
import abiPythProxy from "../abi/PythProxy";
import abiTrackingRewardStreams from "../abi/TrackingRewardSteams";
import abiFeeFlowController from "../abi/FeeFlowController";
import abiSnapshotRegistry from "../abi/SnapshotRegistry";
import abiProtocolConfig from "../abi/ProtocolConfig";
import abiEulerEarn from "../abi/EulerEarn";
import type {
  AddressMetadata,
  AddressMetadataMap,
  ChainConfig,
  CoreAddresses,
  PeripheryAddresses,
  VaultGovernorAddresses,
} from "./types";

export const abi = [
  ...abiEvc,
  ...abiEVault,
  ...abiEulerRouter,
  ...abiPerspective,
  ...abiGovernedPerspective,
  ...abiSwapper,
  ...abiSwapVerifier,
  ...abiPermit2,
  ...abiPythProxy,
  ...abiTrackingRewardStreams,
  ...abiFeeFlowController,
  ...abiSnapshotRegistry,
  ...abiProtocolConfig,
  ...abiEulerEarn,
  ...parseAbi([
    'function scheduleBatch(address[] calldata targets, uint256[] calldata values, bytes[] calldata payloads, bytes32 predecessor, bytes32 salt, uint256 delay)',
    'function schedule(address target, uint256 value, bytes calldata data, bytes32 predecessor, bytes32 salt, uint256 delay)',
    'function grantRole(bytes32 role, address account)',
    'function revokeRole(bytes32 role, address account)',
    'function isGovernorAccessControl() external pure returns (bytes4)',
    'function getQuote(uint256 amount, address base, address quote) external view returns (uint256)',
    'function execTransaction(address to,uint256 value,bytes data,uint8 operation,uint256 safeTxGas,uint256 baseGas,uint256 gasPrice,address gasToken,address refundReceiver,bytes signatures)',
  ]),
];




let globalAddresses: Record<number, any> = {};

for (let chain of eulerChains) {
    globalAddresses[chain.chainId] = {
        core: chain.addresses.coreAddrs,
        periphery: chain.addresses.peripheryAddrs,
        vaultGovernor: chain.addresses.governorAddrs,
    };
}



function extractFunctionNames(a: Abi): string[] {
  return a.flatMap((abiItem) => {
    if (abiItem.type === "function") return abiItem.name;
    return [];
  });
}

export const evcFunctionNames = extractFunctionNames(abiEvc);
export const eVaultFunctionNames = extractFunctionNames(abiEVault);
export const eulerRouterFunctionNames = extractFunctionNames(abiEulerRouter);


export let supportedChains: Record<number, any> = {};
export let supportedChainList: any[] = [];

for (let config of eulerChains) {
    let chain = Object.values(viemChains).find(chain => chain.id === config.chainId);
    
    if (config.status === 'testing') continue;
    if (!chain) throw Error(`no viem entry found for chain ${config.name} (chainId: ${config.chainId})`);

    let client = createPublicClient({
        chain,
        transport: http(chain.rpcUrls.default.http[0]),
    });

    supportedChains[config.chainId] = {
        id: config.chainId,
        explorerUrl: chain.blockExplorers?.default?.url || '',
        client,
        config,
    };

    supportedChainList.push(config);
}


function loadDeploymentAddresses(
  chainId: number
): AddressMetadataMap<AddressMetadata> {
  let output: Record<string, AddressMetadata> = {};

  let chain = supportedChains[chainId];
  if (!chain) throw Error(`unable to load deployment addrs for chain ${chainId}`);

  for (let addrTypeKey of Object.keys(chain.config.addresses)) {
    let addrs = chain.config.addresses[addrTypeKey];
    let addrCategory = addrTypeKey.replace(/Addrs$/, '');

    for (let addrName of Object.keys(addrs)) {
      let addr = addrs[addrName];
      output[addr] = {
        kind: "global",
        label: `${addrCategory}/${addrName}`,
      };
    }
  }

  return output;
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
    "0x088756eB730A08CbEb98Dfe67Ca74697a8A63153": {
      kind: "global",
      label: "governor/accessControlEmergencyGovernor",
      legacy: true, // old mainnet gov
    },
  };
}
