import { Address, checksumAddress } from "viem";
import {
  ConfigDiff,
  DecodedEVCCall,
  Diffs,
  LTVDiff,
  ResolvedVaultDiff,
  RouterDiff,
  VaultDiff,
} from "./types";
import { useAddressMetadata } from "../context/AddressContext";

// Hook operation constants
const HOOK_OPERATIONS = {
  OP_DEPOSIT: 1 << 0,
  OP_MINT: 1 << 1,
  OP_WITHDRAW: 1 << 2,
  OP_REDEEM: 1 << 3,
  OP_TRANSFER: 1 << 4,
  OP_SKIM: 1 << 5,
  OP_BORROW: 1 << 6,
  OP_REPAY: 1 << 7,
  OP_REPAY_WITH_SHARES: 1 << 8,
  OP_PULL_DEBT: 1 << 9,
  OP_CONVERT_FEES: 1 << 10,
  OP_LIQUIDATE: 1 << 11,
  OP_FLASHLOAN: 1 << 12,
  OP_TOUCH: 1 << 13,
  OP_VAULT_STATUS_CHECK: 1 << 14,
} as const;

function decodeHookedOperations(hookedOps: bigint): string[] {
  const operations: string[] = [];
  const opsValue = Number(hookedOps);
  
  for (const [opName, opValue] of Object.entries(HOOK_OPERATIONS)) {
    if (opsValue & opValue) {
      operations.push(opName);
    }
  }
  
  return operations;
}

export function getDiffs(calls: DecodedEVCCall[]): Diffs | undefined {
  const { metadata } = useAddressMetadata();
  const vaults: { [address: Address]: VaultDiff } = {};
  const routers: { [address: Address]: RouterDiff } = {};

  if (!calls) return undefined;

  // Helper function to process calls recursively
  function processCalls(callList: DecodedEVCCall[]) {
    callList.forEach((call) => {
      const f = call.decoded?.functionName;
      if (!f) return;

      let targetContract = call.targetContract;

      const targetIsGAC =
        targetContract &&
        metadata[targetContract]?.kind === "global" &&
        (metadata[targetContract] as any).label === 'governor/accessControlEmergencyGovernor';

      const targetIsCapRiskSteward =
        targetContract &&
        metadata[targetContract]?.kind === "global" &&
        (metadata[targetContract] as any).label === 'governor/capRiskSteward';

      const targetIsGovernor =
        targetContract &&
        metadata[targetContract]?.kind === "governor";

      // Handle governor proxy calls
      if (call.isGovernorProxy && call.proxiedAddress) {
        targetContract = call.proxiedAddress;
      } else if (targetIsGAC || targetIsCapRiskSteward) {
        targetContract = checksumAddress(`0x${call.data.slice(-40)}`);
      }

      if (f === "setCaps") {
        const existingVault = vaults[targetContract];
        vaults[targetContract] = {
          ...existingVault,
          newValues: {
            ...existingVault?.newValues,
            supplyCap: call.decoded.args[0] as number,
            borrowCap: call.decoded.args[1] as number,
          },
        };
      } else if (f === "setGovernorAdmin") {
        const existingVault = vaults[targetContract];
        vaults[targetContract] = {
          ...existingVault,
          newValues: {
            ...existingVault?.newValues,
            governorAdmin: call.decoded.args[0] as Address,
          },
        };
      } else if (f === "setFeeReceiver") {
        const existingVault = vaults[targetContract];
        vaults[targetContract] = {
          ...existingVault,
          newValues: {
            ...existingVault?.newValues,
            feeReceiver: call.decoded.args[0] as Address,
          },
        };
      } else if (f === "setInterestRateModel") {
        const existingVault = vaults[targetContract];
        vaults[targetContract] = {
          ...existingVault,
          newValues: {
            ...existingVault?.newValues,
            interestRateModel: call.decoded.args[0] as Address,
          },
        };
      } else if (f === "setMaxLiquidationDiscount") {
        const existingVault = vaults[targetContract];
        vaults[targetContract] = {
          ...existingVault,
          newValues: {
            ...existingVault?.newValues,
            maxLiquidationDiscount: call.decoded.args[0] as number,
          },
        };
      } else if (f === "setHookConfig") {
        const existingVault = vaults[targetContract];
        const hookedOps = call.decoded.args[1] as bigint;
        const hookedOperations = decodeHookedOperations(hookedOps);
        vaults[targetContract] = {
          ...existingVault,
          newValues: {
            ...existingVault?.newValues,
            hookTarget: call.decoded.args[0] as Address,
            hookedOps: hookedOperations.length > 0 ? `${hookedOperations.join(", ")} (${hookedOps})` : `None (${hookedOps})`,
          },
        };
      } else if (f === "setInterestFee") {
        const existingVault = vaults[targetContract];
        vaults[targetContract] = {
          ...existingVault,
          newValues: {
            ...existingVault?.newValues,
            // interestFee: call.decoded.args[0] as number,
          },
        };
      } else if (f === "setLiquidationCoolOffTime") {
        const existingVault = vaults[targetContract];
        vaults[targetContract] = {
          ...existingVault,
          newValues: {
            ...existingVault?.newValues,
            liquidationCoolOffTime: call.decoded.args[0] as number,
          },
        };
      } else if (f === "setLTV") {
        const existingVault = vaults[targetContract];
        const ltvDiff: LTVDiff = {
          collateral: call.decoded.args[0] as Address,
          borrowLTV: call.decoded.args[1] as number,
          liquidationLTV: call.decoded.args[2] as number,
          rampDuration: call.decoded.args[3] as number,
        };
        vaults[targetContract] = {
          ...existingVault,
          newValues: {
            ...existingVault?.newValues,
            ltvs: [...(existingVault?.newValues?.ltvs ?? []), ltvDiff],
          },
        };
      } else if (f === "govSetConfig") {
        const existingRouter = routers[targetContract];

        const configDiff: ConfigDiff = {
          base: call.decoded.args[0] as Address,
          quote: call.decoded.args[1] as Address,
          oracle: call.decoded.args[2] as Address,
        };
        routers[targetContract] = {
          ...existingRouter,
          newValues: {
            ...existingRouter?.newValues,
            configs: [...(existingRouter?.newValues?.configs ?? []), configDiff],
          },
        };
      } else if (f === "transferGovernance") {
        const existingRouter = routers[targetContract];

        routers[targetContract] = {
          ...existingRouter,
          newValues: {
            ...existingRouter?.newValues,
            // governor: call.decoded.args[0] as Address,
          },
        };
      } else if (f === "govSetResolvedVault") {
        const existingRouter = routers[targetContract];

        const resolvedVaultDiff: ResolvedVaultDiff = {
          vault: call.decoded.args[0] as Address,
          set: call.decoded.args[1] as boolean,
        };
        routers[targetContract] = {
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
        const existingRouter = routers[targetContract];

        routers[targetContract] = {
          ...existingRouter,
          newValues: {
            ...existingRouter?.newValues,
            fallbackOracle: call.decoded.args[0] as Address,
          },
        };
      }

      // Process nested batch if it exists
      if (call.nestedBatch?.items) {
        processCalls(call.nestedBatch.items);
      }
    });
  }

  processCalls(calls);

  return {
    vaults,
    routers,
  };
}
