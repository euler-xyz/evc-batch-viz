import { useEffect, useState } from "react";

import { decodeEVCBatch } from "./lib/decode";
import safeTx1 from "./assets/safe_tx1.json";
import ItemBox from "./components/ItemBox";
import { OracleInfo, OracleInfoMap, type DecodedEVCCall } from "./lib/types";
import { Address } from "viem";
import { indexOracles } from "./lib/indexers";
import BatchBox from "./components/BatchBox";

function App() {
  const [text, setText] = useState<string>(JSON.stringify(safeTx1));
  const [error, setError] = useState<string>();
  const [items, setItems] = useState<DecodedEVCCall[]>();
  const [oracleInfoMap, setOracleInfoMap] = useState<OracleInfoMap>({});

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
  }, [items]);

  return (
    <div className="main">
      <h1>EVC Batch Viz</h1>

      <textarea
        placeholder="Encoded batch"
        onChange={(e) => setText(e.target.value)}
        value={text}
      />

      <button className="decode-button" onClick={() => doDecode()}>
        Decode
      </button>

      {error && <div className="error-box">{error}</div>}

      {items && (
        <div className="decoded-box">
          <BatchBox items={items} />
        </div>
      )}
    </div>
  );
}

export default App;
