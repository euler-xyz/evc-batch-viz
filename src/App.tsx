import { useEffect, useState } from "react";

import { decodeEVCBatch } from "./lib/decode";
import safeTx1 from "./assets/safe_tx1.json";
import {
  AssetInfoMap,
  OracleInfoMap,
  VaultInfoMap,
  type DecodedEVCCall,
} from "./lib/types";
import { Address, Hash } from "viem";
import { getTxCalldata, indexAssets, indexOracles, indexVaults } from "./lib/indexers";
import BatchBox from "./components/BatchBox";
import { getDiffs } from "./lib/diffs";
import DiffsBox from "./components/DiffsBox";
import { Box, Button, ButtonGroup, Flex, Heading, Input, Spacer, Textarea } from "@chakra-ui/react";
import ErrorBox from "./components/ErrorBox";
import { eulerRouterFunctionNames, eVaultFunctionNames } from "./lib/constants";

function App() {
  const [text, setText] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
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
      const parsed = cleanedText.startsWith('0x') ? { data: cleanedText, } : JSON.parse(cleanedText);

      setItems(decodeEVCBatch(parsed));
    } catch (e: any) {
      console.error(e);
      setError(e.toString());
      return;
    }
  };

  const loadTx = async () => {
    setError(undefined);
    setItems(undefined);

    try {
      const txCalldata = await getTxCalldata(txHash as Hash);
      setText(txCalldata);
    } catch (e: any) {
      console.error(e);
      setError(e.toString());
      return;
    }
  }

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
      const f = call.decoded?.functionName;
      if (!f) return;

      if (eVaultFunctionNames.includes(f)) {
        vaultAddresses.add(call.targetContract);
      } else if (eulerRouterFunctionNames.includes(f)) {
        oracleAddresses.add(call.targetContract);
      }

      if (f === "govSetConfig") {
        tokenAddresses.add(call.decoded.args[0]);
        tokenAddresses.add(call.decoded.args[1]);
        oracleAddresses.add(call.decoded.args[2]);
      } else if (f === "govSetResolvedVault") {
        vaultAddresses.add(call.decoded.args[0]);
      } else if (f === "setLTV") {
        vaultAddresses.add(call.decoded.args[0]);
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
      if (!item.decoded?.functionName) return item;

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
    <Box px={6} py={6}>

      <Flex direction="column" gap={4}>
        <Heading>🧙‍♂️ EVC Batch Viz</Heading>

        <Textarea
          placeholder="Encoded batch"
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
        <Flex direction="row" align="center">
          <Flex direction="row">
            <ButtonGroup size="sm">
              <Button colorScheme="green" onClick={() => doDecode()}>Decode</Button>
              <Button colorScheme="red" onClick={() => loadPayload({})}>Clear</Button>
              <Button colorScheme="blue" onClick={() => loadPayload(safeTx1)}>Load Example</Button>
            </ButtonGroup>
          </Flex>
          <Spacer />
          <Flex direction="row" align="center" gap={2} w="25%">
            <Input placeholder="Tx hash" size="sm" onChange={(e) => setTxHash(e.target.value.trim())} />
            <Button colorScheme="blue" size="sm" onClick={() => loadTx()}>Load Tx</Button>
          </Flex>
        </Flex>

        {error && <ErrorBox msg={error} />}

        {diffs && <DiffsBox diffs={diffs} />}

        {richItems && <BatchBox items={richItems} />}
      </Flex>
    </Box>
  );
}

export default App;
