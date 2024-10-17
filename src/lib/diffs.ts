import { Address } from "viem";
import {
  ConfigDiff,
  DecodedEVCCall,
  Diffs,
  LTVDiff,
  ResolvedVaultDiff,
  RouterDiff,
  VaultDiff,
} from "./types";

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
    } else if (f === "setInterestRateModel") {
      const existingVault = vaults[call.targetContract];
      vaults[call.targetContract] = {
        ...existingVault,
        newValues: {
          ...existingVault?.newValues,
          interestRateModel: call.decoded.args[0],
        },
      };
    } else if (f === "setMaxLiquidationDiscount") {
      const existingVault = vaults[call.targetContract];
      vaults[call.targetContract] = {
        ...existingVault,
        newValues: {
          ...existingVault?.newValues,
          maxLiquidationDiscount: call.decoded.args[0],
        },
      };
    } else if (f === "setLiquidationCoolOffTime") {
      const existingVault = vaults[call.targetContract];
      vaults[call.targetContract] = {
        ...existingVault,
        newValues: {
          ...existingVault?.newValues,
          liquidationCoolOffTime: call.decoded.args[0],
        },
      };
    } else if (f === "setLTV") {
      const existingVault = vaults[call.targetContract];
      const ltvDiff: LTVDiff = {
        collateral: call.decoded.args[0],
        borrowLTV: call.decoded.args[1],
        liquidationLTV: call.decoded.args[2],
        rampDuration: call.decoded.args[3],
      };
      vaults[call.targetContract] = {
        ...existingVault,
        newValues: {
          ...existingVault?.newValues,
          ltvs: [...(existingVault?.newValues?.ltvs ?? []), ltvDiff],
        },
      };
    } else if (f === "govSetConfig") {
      const existingRouter = routers[call.targetContract];

      const configDiff: ConfigDiff = {
        base: call.decoded.args[0],
        quote: call.decoded.args[1],
        oracle: call.decoded.args[2],
      };
      routers[call.targetContract] = {
        ...existingRouter,
        newValues: {
          ...existingRouter?.newValues,
          configs: [...(existingRouter?.newValues?.configs ?? []), configDiff],
        },
      };
    } else if (f === "govSetResolvedVault") {
      const existingRouter = routers[call.targetContract];

      const resolvedVaultDiff: ResolvedVaultDiff = {
        vault: call.decoded.args[0],
        set: call.decoded.args[1],
      };
      routers[call.targetContract] = {
        ...existingRouter,
        newValues: {
          ...existingRouter?.newValues,
          resolvedVaults: [
            ...(existingRouter?.newValues?.resolvedVaults ?? []),
            resolvedVaultDiff,
          ],
        },
      };
    } else if (f === "govSetFallbackOracle") {
      const existingRouter = routers[call.targetContract];

      routers[call.targetContract] = {
        ...existingRouter,
        newValues: {
          ...existingRouter?.newValues,
          fallbackOracle: call.decoded.args[0],
        },
      };
    }
  });

  return {
    vaults,
    routers,
  };
}
