import { Address } from "viem";
import { Diffs, LTVDiff } from "../lib/types";
import AddressValue from "./values/AddressValue";
import CapValue from "./values/CapValue";
import LTVValue from "./values/LTVValue";

type Props = { diffs: Diffs };

function DiffsBox({ diffs }: Props) {
  return (
    <>
      <div className="summary" style={{ fontSize: "16px" }}>
        <div style={{ marginBottom: "16px", fontWeight: "bold" }}>
          {Object.keys(diffs.vaults).length} modified vaults
        </div>
        {Object.entries(diffs.vaults).map(([address, vaultDiff]) => (
          <div style={{ marginBottom: "16px" }}>
            <div>
              Vault <AddressValue a={address as Address} />
            </div>
            {Object.entries(vaultDiff.newValues).map(([key, value]) => {
              if (key === "supplyCap" || key === "borrowCap") {
                return (
                  <div>
                    {key} &rarr; <CapValue cap={value as number} />
                  </div>
                );
              } else if (
                key === "interestRateModel" ||
                key === "governorAdmin" ||
                key === "feeReceiver"
              ) {
                return (
                  <div>
                    {key} &rarr; <AddressValue a={value as Address} />
                  </div>
                );
              } else if (key === "ltvs") {
                return (
                  <div>
                    {(value as LTVDiff[]).map((ltvDiff) => {
                      return (
                        <div>
                          LTV for <AddressValue a={ltvDiff.collateral} />:
                          borrowLTV=
                          <LTVValue ltv={ltvDiff.borrowLTV} />, liquidationLTV=
                          <LTVValue ltv={ltvDiff.liquidationLTV} />,
                          rampDuration={ltvDiff.rampDuration}
                        </div>
                      );
                    })}
                  </div>
                );
              }
              return (
                <div>
                  {key} &rarr; {value as any}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="summary" style={{ fontSize: "16px" }}>
        {Object.keys(diffs.routers).length} modified routers
      </div>
    </>
  );
}

export default DiffsBox;
