import { decodeFunctionData } from "viem";
import { abi } from "./constants";
import { DecodedEVCCall, DecodedItem } from "./types";

export function decodeEVCBatch(contents: { data: any }): DecodedEVCCall[] {
  let decodedBatch = decodeFunctionData({
    abi,
    data: contents.data,
  });

  if (decodedBatch.functionName !== "batch") {
    throw Error(
      `unexpected EVC function invocation: ${decodedBatch.functionName}`
    );
  }

  const items: DecodedEVCCall[] = [];

  for (const item of decodedBatch.args[0]) {
    try {
      const decodedItem: DecodedItem = decodeFunctionData({
        abi,
        data: item.data,
      });

      items.push({ ...item, decoded: decodedItem });
    } catch (e) {
      console.warn(e);

      items.push({ ...item });
    }
  }

  return items;
}
