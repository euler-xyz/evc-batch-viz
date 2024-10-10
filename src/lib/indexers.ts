import { Address, parseAbi } from "viem";
import { ethereumClient } from "./constants";
import { AssetInfo, OracleInfo, VaultInfo } from "./types";

export async function indexOracles(
  addresses: Address[]
): Promise<OracleInfo[]> {
  const callResults = await ethereumClient.multicall({
    contracts: addresses.flatMap((address) => [
      {
        address,
        abi: parseAbi(["function name() view returns (string)"]),
        functionName: "name",
      },
    ]),
  });

  const callValues = callResults.map(({ result, error }) =>
    error ? undefined : result
  );

  return addresses.map((address, i) => ({
    address: address as Address,
    name: callValues[i * 1] as string | undefined,
  }));
}

export async function indexVaults(addresses: Address[]): Promise<VaultInfo[]> {
  const callResults = await ethereumClient.multicall({
    contracts: addresses.flatMap((address) => [
      {
        address,
        abi: parseAbi(["function name() view returns (string)"]),
        functionName: "name",
      },
    ]),
  });

  const callValues = callResults.map(({ result, error }) =>
    error ? undefined : result
  );

  return addresses.map((address, i) => ({
    address: address as Address,
    name: callValues[i * 1] as string | undefined,
  }));
}

export async function indexAssets(addresses: Address[]): Promise<AssetInfo[]> {
  const callResults = await ethereumClient.multicall({
    contracts: addresses.flatMap((address) => [
      {
        address,
        abi: parseAbi(["function name() view returns (string)"]),
        functionName: "name",
      },
    ]),
  });

  const callValues = callResults.map(({ result, error }) =>
    error ? undefined : result
  );

  return addresses.map((address, i) => ({
    address: address as Address,
    name: callValues[i * 1] as string | undefined,
  }));
}
