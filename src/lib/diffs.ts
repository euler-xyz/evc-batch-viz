import { Address } from "viem";
import { DecodedEVCCall, Diffs, LTVDiff, RouterDiff, VaultDiff } from "./types";

export function getDiffs(calls: DecodedEVCCall[]): Diffs {
  const vaults: { [address: Address]: VaultDiff } = {};
  const routers: { [address: Address]: RouterDiff } = {};

  calls.forEach((call) => {
    const f = call.decoded?.functionName;
    if (!f) return;
    if (f === "setCaps") {
      const existingVault = vaults[call.targetContract];
      vaults[call.targetContract] = {
        ...existingVault,
        label: call.targetLabel,
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
        label: call.targetLabel,
        newValues: {
          ...existingVault?.newValues,
          governorAdmin: call.decoded.args[0],
        },
      };
    } else if (f === "setFeeReceiver") {
      const existingVault = vaults[call.targetContract];
      vaults[call.targetContract] = {
        ...existingVault,
        label: call.targetLabel,
        newValues: {
          ...existingVault?.newValues,
          feeReceiver: call.decoded.args[0],
        },
      };
    } else if (f === "setInterestRateModel") {
      const existingVault = vaults[call.targetContract];
      vaults[call.targetContract] = {
        ...existingVault,
        label: call.targetLabel,
        newValues: {
          ...existingVault?.newValues,
          interestRateModel: call.decoded.args[0],
        },
      };
    } else if (f === "setMaxLiquidationDiscount") {
      const existingVault = vaults[call.targetContract];
      vaults[call.targetContract] = {
        ...existingVault,
        label: call.targetLabel,
        newValues: {
          ...existingVault?.newValues,
          maxLiquidationDiscount: call.decoded.args[0],
        },
      };
    } else if (f === "setLiquidationCoolOffTime") {
      const existingVault = vaults[call.targetContract];
      vaults[call.targetContract] = {
        ...existingVault,
        label: call.targetLabel,
        newValues: {
          ...existingVault?.newValues,
          liquidationCoolOffTime: call.decoded.args[0],
        },
      };
    } else if (f === "setLTV") {
      const existingVault = vaults[call.targetContract];
      const ltvDiff: LTVDiff = {
        collateral: call.decoded.args[0],
        collateralName: call.argLabels?.[0],
        borrowLTV: call.decoded.args[1],
        liquidationLTV: call.decoded.args[2],
        rampDuration: call.decoded.args[3],
      };
      vaults[call.targetContract] = {
        ...existingVault,
        label: call.targetLabel,
        newValues: {
          ...existingVault?.newValues,
          ltvs: [...(existingVault?.newValues?.ltvs ?? []), ltvDiff],
        },
      };
    }
  });

  return {
    vaults,
    routers,
  };
}
