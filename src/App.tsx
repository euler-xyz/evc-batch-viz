import { useEffect, useState } from "react";

import { decodeEVCBatch } from "./lib/decode";
import safeTx1 from "./assets/safe_tx1.json";
import {
  AssetInfoMap,
  OracleInfoMap,
  VaultInfoMap,
  type DecodedEVCCall,
} from "./lib/types";
import { Address } from "viem";
import { indexAssets, indexOracles, indexVaults } from "./lib/indexers";
import BatchBox from "./components/BatchBox";
import { getDiffs } from "./lib/diffs";
import DiffsBox from "./components/DiffsBox";

function App() {
  const [text, setText] = useState<string>("");
  const [error, setError] = useState<string>();
  const [items, setItems] = useState<DecodedEVCCall[]>();
  const [oracleInfoMap, setOracleInfoMap] = useState<OracleInfoMap>({});
  const [vaultInfoMap, setVaultInfoMap] = useState<VaultInfoMap>({});
  const [assetInfoMap, setAssetInfoMap] = useState<AssetInfoMap>({});

  const doDecode = () => {
    setError(undefined);
    setItems(undefined);

    try {
      let cleanedText = text.trim();
      let parsed;

      if (cleanedText.startsWith('0x')) parsed = { data: cleanedText, };
      else parsed = JSON.parse(cleanedText);

      setItems(decodeEVCBatch(parsed));
    } catch (e: any) {
      console.error(e);
      setError(e.toString());
      return;
    }
  };

  const loadPayload = (payload: any) => {
    setError(undefined);
    setItems(undefined);
    setText(JSON.stringify(payload));
  };

  useEffect(() => {
    if (!items) return;
    const oracleAddresses: Set<Address> = new Set();
    const vaultAddresses: Set<Address> = new Set();
    const tokenAddresses: Set<Address> = new Set();

    items.forEach((call) => {
      const f = call.decoded.functionName;
      if (f === "govSetConfig") {
        oracleAddresses.add(call.targetContract);
        tokenAddresses.add(call.decoded.args[0]);
        tokenAddresses.add(call.decoded.args[1]);
        oracleAddresses.add(call.decoded.args[2]);
      } else if (f === "govSetResolvedVault") {
        vaultAddresses.add(call.decoded.args[0]);
      } else if (f === "setLTV") {
        vaultAddresses.add(call.targetContract);
        vaultAddresses.add(call.decoded.args[0]);
      } else if (f === "setCaps") {
        vaultAddresses.add(call.targetContract);
      } else if (f === "setInterestRateModel") {
        vaultAddresses.add(call.targetContract);
      } else if (f === "setHookConfig") {
        vaultAddresses.add(call.targetContract);
      }
    });

    (async () => {
      const oracleInfo = await indexOracles(Array.from(oracleAddresses));

      const infoMap: OracleInfoMap = {};
      oracleInfo.forEach(({ address, ...rest }) => {
        infoMap[address] = {
          address,
          ...rest,
        };
      });
      setOracleInfoMap(infoMap);
    })();

    (async () => {
      const vaultInfo = await indexVaults(Array.from(vaultAddresses));

      const infoMap: OracleInfoMap = {};
      vaultInfo.forEach(({ address, ...rest }) => {
        infoMap[address] = {
          address,
          ...rest,
        };
      });
      setVaultInfoMap(infoMap);
    })();

    (async () => {
      const assetInfo = await indexAssets(Array.from(tokenAddresses));

      const infoMap: AssetInfoMap = {};
      assetInfo.forEach(({ address, ...rest }) => {
        infoMap[address] = {
          ...infoMap[address],
          address,
          ...rest,
        };
      });
      infoMap["0x0000000000000000000000000000000000000348"] = {
        address: "0x0000000000000000000000000000000000000348",
        name: "USD Designator Address",
      };
      setAssetInfoMap(infoMap);
    })();
  }, [items]);

  const richItems = items
    ? items.map((item) => {
        const targetLabel =
          oracleInfoMap[item.targetContract]?.name ??
          vaultInfoMap[item.targetContract]?.name ??
          undefined;

        let argLabels: { [index: number]: string } = {};

        if (item.decoded.functionName === "govSetConfig") {
          const baseLabel = assetInfoMap[item.decoded.args[0]]?.name;
          if (baseLabel) argLabels[0] = baseLabel;

          const quoteLabel = assetInfoMap[item.decoded.args[1]]?.name;
          if (quoteLabel) argLabels[1] = quoteLabel;

          const oracleLabel = oracleInfoMap[item.decoded.args[2]]?.name;
          if (oracleLabel) argLabels[2] = oracleLabel;
        }

        if (item.decoded.functionName === "setLTV") {
          const collateralLabel = vaultInfoMap[item.decoded.args[0]]?.name;
          if (collateralLabel) argLabels[0] = collateralLabel;
        }

        if (item.decoded.functionName === "govSetResolvedVault") {
          const collateralLabel = vaultInfoMap[item.decoded.args[0]]?.name;
          if (collateralLabel) argLabels[0] = collateralLabel;
        }

        return {
          ...item,
          targetLabel,
          argLabels,
        };
      })
    : undefined;

  const diffs = richItems ? getDiffs(richItems) : undefined;

  return (
    <div className="main">
      <h1>🧙‍♂️ EVC Batch Viz</h1>

      <textarea
        placeholder="Encoded batch"
        onChange={(e) => setText(e.target.value)}
        value={text}
        style={{ height: "60px" }}
      />

      <div style={{ width: "100%" }}>
        <button
          className="decode-button"
          onClick={() => doDecode()}
          style={{ marginRight: "4px" }}
        >
          Decode
        </button>
        <button
          style={{ backgroundColor: "pink", marginRight: "4px" }}
          onClick={() => loadPayload({})}
        >
          Clear
        </button>
        <button
          style={{ backgroundColor: "aqua", marginRight: "4px" }}
          onClick={() => loadPayload(safeTx1)}
        >
          Load example (safe_tx1.json)
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}

      {diffs && (
        <div className="decoded-box">
          <DiffsBox diffs={diffs} />
        </div>
      )}

      {richItems && (
        <div className="decoded-box">
          <BatchBox items={richItems} />
        </div>
      )}
    </div>
  );
}

export default App;
