import { useEffect, useState } from "react";

import { decodeEVCBatch } from "./lib/decode";
import safeTx1 from "./assets/safe_tx1.json";
import safeTx2 from "./assets/safe_tx2.json";
import { OracleInfoMap, VaultInfoMap, type DecodedEVCCall } from "./lib/types";
import { Address } from "viem";
import { indexOracles, indexVaults } from "./lib/indexers";
import BatchBox from "./components/BatchBox";

function App() {
  const [text, setText] = useState<string>("");
  const [error, setError] = useState<string>();
  const [items, setItems] = useState<DecodedEVCCall[]>();
  const [oracleInfoMap, setOracleInfoMap] = useState<OracleInfoMap>({});
  const [vaultInfoMap, setVaultInfoMap] = useState<VaultInfoMap>({});

  const doDecode = () => {
    setError(undefined);
    setItems(undefined);

    try {
      setItems(decodeEVCBatch(JSON.parse(text)));
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
  }, [items]);

  const richItems = items
    ? items.map((item) => ({
        ...item,
        targetName:
          oracleInfoMap[item.targetContract]?.name ??
          vaultInfoMap[item.targetContract]?.name ??
          undefined,
      }))
    : undefined;

  return (
    <div className="main">
      <h1>EVC Batch Viz</h1>

      <textarea
        placeholder="Encoded batch"
        onChange={(e) => setText(e.target.value)}
        value={text}
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
          Load safe_tx1.json
        </button>
        <button
          style={{ backgroundColor: "aqua" }}
          onClick={() => loadPayload(safeTx2)}
        >
          Load safe_tx2.json
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}

      {richItems && (
        <div className="decoded-box">
          <BatchBox items={richItems} />
        </div>
      )}
    </div>
  );
}

export default App;
