import { decodeFunctionData, zeroAddress } from "viem";
import { abi } from "./constants";
import { DecodedEVCCall, DecodedItem } from "./types";

export function decodeEVCBatch(contents: { data: any }): { items: any[], timelockInfo?: any } {
  let timelockInfo;
  let decodedBatch = decodeFunctionData({
    abi,
    data: contents.data,
  });

  let items = [];

  if (decodedBatch.functionName === "batch") {
      for (const item of decodedBatch.args[0]) {
        try {
          const decodedItem: DecodedItem = decodeFunctionData({
            abi,
            data: item.data,
          });

          items.push({ ...item, decoded: decodedItem, batchType: 'batch', });
        } catch (e) {
          console.warn(e);

          items.push({ ...item });
        }
      }
  } else if (decodedBatch.functionName === "scheduleBatch") {
    let args = decodedBatch.args;

    for (let i = 0; i < args[0].length; i++) {
        let decodedItem = decodeFunctionData({
            abi,
            data: args[2][i],
        });

        // Check if this call is to an EVC batch function
        let nestedBatch;
        if (decodedItem.functionName === "batch") {
          try {
            nestedBatch = decodeEVCBatch({ data: args[2][i] });
          } catch (e) {
            console.warn("Failed to decode nested batch:", e);
          }
        }

        items.push({ 
          data: args[2][i], 
          targetContract: args[0][i], 
          value: args[1][i], 
          decoded: decodedItem, 
          batchType: 'scheduleBatch',
          nestedBatch
        });
    }

    timelockInfo = { delay: args[5], };
  } else if (decodedBatch.functionName === "schedule") {
    let args = decodedBatch.args;
    
    let decodedItem = decodeFunctionData({
      abi,
      data: args[2],
    });

    // Check if this call is to an EVC batch function
    let nestedBatch;
    if (decodedItem.functionName === "batch") {
      try {
        nestedBatch = decodeEVCBatch({ data: args[2] });
      } catch (e) {
        console.warn("Failed to decode nested batch:", e);
      }
    }

    items.push({ 
      data: args[2], 
      targetContract: args[0], 
      value: args[1], 
      decoded: decodedItem, 
      batchType: 'schedule',
      predecessor: args[3],
      salt: args[4],
      nestedBatch
    });

    timelockInfo = { delay: args[5] };
  } else {
    items.push({ data: contents.data, targetContract: zeroAddress, value: 0n, decoded: decodedBatch, });
  }

  return { items, timelockInfo };
}
