import { Address, DecodeFunctionDataReturnType } from "viem";
import { abi } from "./constants";

export type EVCBatchArgs = {
  targetContract: `0x${string}`;
  onBehalfOfAccount: `0x${string}`;
  value: bigint;
  data: `0x${string}`;
};

export type DecodedItem = DecodeFunctionDataReturnType<typeof abi>;

export type DecodedEVCCall = EVCBatchArgs & {
  decoded: DecodedItem;
  targetLabel?: string;
  argLabels?: { [index: number]: string };
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
  };
};

export type Diffs = {
  vaults: { [address: Address]: VaultDiff };
  routers: { [address: Address]: RouterDiff };
};
