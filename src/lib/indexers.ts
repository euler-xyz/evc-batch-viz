import { Address, Hash, Hex, parseAbi, PublicClient } from "viem";
import {
  AddressMetadataMap,
  OracleMetadata,
  TokenMetadata,
  VaultMetadata,
} from "./types";

export async function indexOracles(
  addresses: Address[],
  client: PublicClient
): Promise<AddressMetadataMap<OracleMetadata>> {
  const callResults = await client.multicall({
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

  const metadataMap: AddressMetadataMap<OracleMetadata> = {};

  addresses.forEach((address, i) => {
    const name = callValues[i] as string | undefined;
    if (!name) return;
    metadataMap[address] = {
      kind: "oracle",
      name: callValues[i * 1] as string,
    };
  });

  return metadataMap;
}

export async function indexVaults(
  addresses: Address[],
  client: PublicClient
): Promise<AddressMetadataMap<VaultMetadata>> {
  const callResults = await client.multicall({
    contracts: addresses.flatMap((address) => [
      {
        address,
        abi: parseAbi(["function name() view returns (string)"]),
        functionName: "name",
      },
      {
        address,
        abi: parseAbi(["function asset() view returns (address)"]),
        functionName: "asset",
      },
    ]),
  });

  const callValues = callResults.map(({ result, error }) =>
    error ? undefined : result
  );

  const metadataMap: AddressMetadataMap<VaultMetadata> = {};

  addresses.forEach((address, i) => {
    const name = callValues[i * 2] as string | undefined;
    const asset = callValues[i * 2 + 1] as Address | undefined;
    if (!name || !asset) return;
    metadataMap[address] = {
      kind: "vault",
      name: callValues[i * 2] as string,
      asset: callValues[i * 2 + 1] as Address,
    };
  });

  return metadataMap;
}

export async function indexTokens(
  addresses: Address[],
  client: PublicClient
): Promise<AddressMetadataMap<TokenMetadata>> {
  const callResults = await client.multicall({
    contracts: addresses.flatMap((address) => [
      {
        address,
        abi: parseAbi(["function name() view returns (string)"]),
        functionName: "name",
      },
      {
        address,
        abi: parseAbi(["function symbol() view returns (string)"]),
        functionName: "symbol",
      },
      {
        address,
        abi: parseAbi(["function decimals() view returns (uint8)"]),
        functionName: "decimals",
      },
    ]),
  });

  const callValues = callResults.map(({ result, error }) =>
    error ? undefined : result
  );

  const metadataMap: AddressMetadataMap<TokenMetadata> = {};

  addresses.forEach((address, i) => {
    const name = callValues[i * 3];
    const symbol = callValues[i * 3 + 1];
    const decimals = callValues[i * 3 + 2];

    if (!decimals || !name || !symbol) return;
    metadataMap[address] = {
      kind: "token",
      name: name as string,
      symbol: symbol as string,
      decimals: decimals as number,
    };
  });

  return metadataMap;
}

export async function getTxCalldata(
  hash: Hash,
  client: PublicClient
): Promise<Hex> {
  const tx = await client.getTransaction({ hash });
  return tx.input;
}
