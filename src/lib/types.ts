import {
  Address,
  DecodeFunctionDataParameters,
  DecodeFunctionDataReturnType,
  PublicClient,
} from "viem";
import { abi } from "./constants";

export type EVCBatchArgs = {
  targetContract: `0x${string}`;
  onBehalfOfAccount: `0x${string}`;
  value: bigint;
  data: `0x${string}`;
};

export type DecodedItem = DecodeFunctionDataReturnType<typeof abi>;

export type SetGovernorAdminCall = {
  functionName: "setGovernorAdmin";
  decodedArgs: {
    newGovernorAdmin: Address;
  };
};

export type SetFeeReceiverCall = {
  functionName: "setFeeReceiver";
  decodedArgs: {
    newFeeReceiver: Address;
  };
};

export type SetLTVCall = {
  functionName: "setLTV";
  decodedArgs: {
    collateral: Address;
    borrowLTV: number;
    liquidationLTV: number;
    rampDuration: number;
  };
};

export type SetMaxLiquidationDiscountCall = {
  functionName: "setMaxLiquidationDiscount";
  decodedArgs: {
    newDiscount: number;
  };
};

export type SetLiquidationCoolOffTimeCall = {
  functionName: "setLiquidationCoolOffTime";
  decodedArgs: {
    newCoolOffTime: number;
  };
};

export type SetInterestRateModelCall = {
  functionName: "setInterestRateModel";
  decodedArgs: {
    newModel: Address;
  };
};

export type SetHookConfigCall = {
  functionName: "setHookConfig";
  decodedArgs: {
    newHookTarget: Address;
    newHookedOps: bigint;
  };
};

export type SetCapsCall = {
  functionName: "setCaps";
  decodedArgs: {
    supplyCap: number;
    borrowCap: number;
  };
};

export type SetInterestFeeCall = {
  functionName: "setCaps";
  decodedArgs: {
    interestFee: number;
  };
};

export type GovSetConfigCall = {
  functionName: "govSetConfig";
  decodedArgs: {
    base: Address;
    quote: Address;
    oracle: Address;
  };
};

export type GovSetResolvedVaultCall = {
  functionName: "govSetResolvedVault";
  decodedArgs: {
    vault: Address;
    set: boolean;
  };
};

export type GovSetFallbackOracleCall = {
  functionName: "govSetFallbackOracle";
  decodedArgs: {
    fallbackOracle: Address;
  };
};

export type TransferGovernanceCall = {
  functionName: "transferGovernance";
  decodedArgs: {
    newGovernor: Address;
  };
};

export type PerspectiveVerifyCall = {
  functionName: "transferGovernance";
  decodedArgs: {
    vault: Address;
    failEarly: boolean;
  };
};

export type UnknownCall = {
  functionName: string;
  decodedArgs: undefined;
};

export type DecodedEVCCall = EVCBatchArgs & {
  decoded?: DecodedItem;
};

export type AddressKind = "vault" | "oracle" | "token" | "global";

export type VaultMetadata = {
  kind: "vault";
  name: string;
  asset: Address;
};

export type OracleMetadata = {
  kind: "oracle";
  name: string;
};

export type TokenMetadata = {
  kind: "token";
  name: string;
  symbol: string;
  decimals: number;
};

export type GlobalMetadata = {
  kind: "global";
  label: string;
};

export type AddressMetadata =
  | VaultMetadata
  | OracleMetadata
  | TokenMetadata
  | GlobalMetadata;

export type AddressMetadataMap<T extends AddressMetadata> = {
  [address: Address]: T;
};

export type OracleInfo = {
  address: Address;
  name?: string;
};

export type OracleInfoMap = {
  [address: Address]: OracleInfo;
};

export type VaultInfo = {
  address: Address;
  name?: string;
};

export type VaultInfoMap = {
  [address: Address]: VaultInfo;
};

export type AssetInfo = {
  address: Address;
  name?: string;
};

export type AssetInfoMap = {
  [address: Address]: AssetInfo;
};

export type LabelMap = {
  [address: Address]: string;
};

export type LTVDiff = {
  collateral: Address;
  borrowLTV: number;
  liquidationLTV: number;
  rampDuration: number;
};

export type VaultDiff = {
  address: Address;
  newValues: {
    supplyCap: number;
    borrowCap: number;
    interestRateModel: Address;
    ltvs: LTVDiff[];
    governorAdmin: Address;
    feeReceiver: Address;
    maxLiquidationDiscount: number;
    liquidationCoolOffTime: number;
  };
};

export type ConfigDiff = {
  base: Address;
  quote: Address;
  oracle: Address;
};

export type ResolvedVaultDiff = {
  vault: Address;
  set: boolean;
};

export type RouterDiff = {
  address: Address;
  newValues: {
    configs: ConfigDiff[];
    resolvedVaults: ResolvedVaultDiff[];
    fallbackOracle: Address;
  };
};

export type Diffs = {
  vaults: { [address: Address]: VaultDiff };
  routers: { [address: Address]: RouterDiff };
};

export type CoreAddresses = {
  balanceTracker: Address;
  eVaultFactory: Address;
  eVaultFactoryGovernor: Address;
  eVaultImplementation: Address;
  evc: Address;
  permit2: Address;
  protocolConfig: Address;
  sequenceRegistry: Address;
};

export type PeripheryAddresses = {
  escrowedCollateralPerspective: Address;
  eulerUngoverned0xPerspective: Address;
  eulerUngovernedNzxPerspective: Address;
  evkFactoryPerspective: Address;
  externalVaultRegistry: Address;
  feeFlowController: Address;
  governedPerspective: Address;
  irmRegistry: Address;
  kinkIRMFactory: Address;
  oracleAdapterRegistry: Address;
  oracleRouterFactory: Address;
  swapVerifier: Address;
  swapper: Address;
  termsOfUseSigner: Address;
};

export type ChainConfig = {
  id: number;
  explorerUrl: String;
  client: PublicClient;
};
