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
  targetName?: string;
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
