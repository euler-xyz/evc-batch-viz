import { decodeFunctionData } from "viem";
import { abi } from "./constants";
import { DecodedEVCCall, DecodedItem } from "./types";

/*
const file = process.argv[2];
if (!file) throw Error("usage: decode.js <file.json>");

decodeEVCBatch(JSON.parse(fs.readFileSync(file)));
*/

export function decodeEVCBatch(contents: { data: any }): DecodedEVCCall[] {
  let decodedBatch = decodeFunctionData({
    abi,
    data: contents.data,
  });

  if (decodedBatch.functionName !== "batch") {
    throw Error(`unexpected function invocation: ${decodedBatch.functionName}`);
  }

  const items: DecodedEVCCall[] = [];

  for (const item of decodedBatch.args[0]) {
    let decodedItem: DecodedItem = decodeFunctionData({
      abi,
      data: item.data,
    });

    items.push({ ...item, decoded: decodedItem });
  }

  return items;
}
