import { Address, parseAbi } from "viem";
import { ethereumClient } from "./constants";

export async function indexOracles(addresses: Address[]) {
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
