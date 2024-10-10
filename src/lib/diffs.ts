import { Address } from "viem";
import { DecodedEVCCall, Diffs, RouterDiff, VaultDiff } from "./types";

export function getDiffs(calls: DecodedEVCCall[]): Diffs {
  const vaults: { [address: Address]: VaultDiff } = {};
  const routers: { [address: Address]: RouterDiff } = {};

  calls.forEach((call) => {
    const f = call.decoded.functionName;
    if (f === "setCaps") {
      const existingVault = vaults[call.targetContract];
      vaults[call.targetContract] = {
        ...existingVault,
        newValues: {
          ...existingVault?.newValues,
          supplyCap: call.decoded.args[0],
          borrowCap: call.decoded.args[1],
        },
      };
    } else if (f === "setGovernorAdmin") {
      const existingVault = vaults[call.targetContract];
      vaults[call.targetContract] = {
        ...existingVault,
        newValues: {
          ...existingVault?.newValues,
          governorAdmin: call.decoded.args[0],
        },
      };
    } else if (f === "setFeeReceiver") {
      const existingVault = vaults[call.targetContract];
      vaults[call.targetContract] = {
        ...existingVault,
        newValues: {
          ...existingVault?.newValues,
          feeReceiver: call.decoded.args[0],
        },
      };
    }
  });

  return {
    vaults,
    routers,
  };
}
