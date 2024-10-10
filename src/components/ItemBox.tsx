import { DecodedEVCCall } from "../lib/types";
import AddressValue from "./values/AddressValue";
import BoolValue from "./values/BoolValue";
import CapValue from "./values/CapValue";
import LTVValue from "./values/LTVValue";

type Props = {
  item: DecodedEVCCall;
  i: number;
};

function ItemBox({ item, i }: Props) {
  const { functionName, args } = item.decoded;
  return (
    <div className="batch-item">
      <div className="header-row">
        <div>#{i}</div>

        <div>{item.decoded.functionName}</div>

        <AddressValue a={item.targetContract} />
      </div>
      <div className="args">
        {functionName === "setGovernorAdmin" && (
          <div>
            newGovernorAdmin &rarr; <AddressValue a={args[0]} />
          </div>
        )}

        {functionName === "setFeeReceiver" && (
          <div>
            newFeeReceiver &rarr; <AddressValue a={args[0]} />
          </div>
        )}

        {functionName === "setLTV" && (
          <div>
            <div>
              collateral &rarr; <AddressValue a={args[0]} />
            </div>
            <div>
              borrowLTV &rarr; <LTVValue ltv={args[1]} />
            </div>
            <div>
              liquidationLTV &rarr; <LTVValue ltv={args[2]} />
            </div>
            <div>
              rampDuration &rarr; <span>{args[3]}</span>
            </div>
          </div>
        )}

        {functionName === "setMaxLiquidationDiscount" && (
          <div>
            newDiscount &rarr; <span>{args[0]}</span>
          </div>
        )}

        {functionName === "setLiquidationCoolOffTime" && (
          <div>
            newCoolOffTime &rarr; <span>{args[0]}</span>
          </div>
        )}

        {functionName === "setInterestRateModel" && (
          <div>
            newModel &rarr; <AddressValue a={args[0]} />
          </div>
        )}

        {functionName === "setHookConfig" && (
          <div>
            <div>
              newHookTarget &rarr; <AddressValue a={args[0]} />
            </div>
            <div>
              newHookedOps &rarr; <span>{args[1]}</span>
            </div>
          </div>
        )}

        {functionName === "setConfigFlags" && (
          <div>
            newConfigFlags &rarr; <span>args[0]</span>
          </div>
        )}

        {functionName === "setCaps" && (
          <div>
            <div>
              supplyCap &rarr; <CapValue cap={args[0]} />
            </div>
            <div>
              borrowCap &rarr; <CapValue cap={args[1]} />
            </div>
          </div>
        )}

        {functionName === "setInterestFee" && (
          <div>
            interestFee &rarr; <span>args[0]</span>
          </div>
        )}

        {functionName === "govSetConfig" && (
          <div>
            <div>(price router method)</div>
            <div>
              base: <AddressValue a={args[0]} />
            </div>
            <div>
              quote: <AddressValue a={args[1]} />
            </div>
            <div>
              oracle &rarr; <AddressValue a={args[2]} />
            </div>
          </div>
        )}

        {functionName === "govSetResolvedVault" && (
          <div>
            <div>(price router method)</div>
            <div>
              vault: <AddressValue a={args[0]} />
            </div>
            <div>
              set &rarr; <BoolValue v={args[1]} />
            </div>
          </div>
        )}

        {functionName === "govSetFallbackOracle" && (
          <div>
            <div>(price router method)</div>
            <div>
              fallbackOracle &rarr; <AddressValue a={args[0]} />
            </div>
          </div>
        )}

        {functionName === "transferGovernance" && (
          <div>
            <div>(price router method)</div>
            <div>
              newGovernor &rarr; <AddressValue a={args[0]} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemBox;
