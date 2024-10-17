import { useEffect, useState } from "react";

import { decodeEVCBatch } from "./lib/decode";
import safeTx1 from "./assets/safe_tx1.json";
import {
  AddressMetadata,
  AddressMetadataMap,
  type DecodedEVCCall,
} from "./lib/types";
import { Address, Hash } from "viem";
import {
  getTxCalldata,
  indexTokens,
  indexOracles,
  indexVaults,
} from "./lib/indexers";
import BatchBox from "./components/BatchBox";
import { getDiffs } from "./lib/diffs";
import DiffsBox from "./components/DiffsBox";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Input,
  Spacer,
  Textarea,
} from "@chakra-ui/react";
import ErrorBox from "./components/ErrorBox";
import {
  eulerRouterFunctionNames,
  eVaultFunctionNames,
  initAddressMetadataMap,
} from "./lib/constants";

function App() {
  const [text, setText] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const [error, setError] = useState<string>();
  const [items, setItems] = useState<DecodedEVCCall[]>();
  const [addressMetadata, setAddressMetadata] = useState<
    AddressMetadataMap<AddressMetadata>
  >(initAddressMetadataMap);

  const doDecode = () => {
    setError(undefined);
    setItems(undefined);

    try {
      let cleanedText = text.trim();
      const parsed = cleanedText.startsWith("0x")
        ? { data: cleanedText }
        : JSON.parse(cleanedText);

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
      const [oracleMap, vaultMap, tokenMap] = await Promise.all([
        indexOracles(Array.from(oracleAddresses)),
        indexVaults(Array.from(vaultAddresses)),
        indexTokens(Array.from(tokenAddresses)),
      ]);

      setAddressMetadata((prev) => ({
        ...prev,
        ...{ ...oracleMap, ...tokenMap, ...vaultMap },
      }));
    })();
  }, [items]);

  const diffs = items ? getDiffs(items) : undefined;

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
              <Button colorScheme="green" onClick={() => doDecode()}>
                Decode
              </Button>
              <Button colorScheme="red" onClick={() => loadPayload({})}>
                Clear
              </Button>
              <Button colorScheme="blue" onClick={() => loadPayload(safeTx1)}>
                Load Example
              </Button>
            </ButtonGroup>
          </Flex>
          <Spacer />
          <Flex direction="row" align="center" gap={2} w="25%">
            <Input
              placeholder="Tx hash"
              size="sm"
              onChange={(e) => setTxHash(e.target.value.trim())}
            />
            <Button colorScheme="blue" size="sm" onClick={() => loadTx()}>
              Load Tx
            </Button>
          </Flex>
        </Flex>

        {error && <ErrorBox msg={error} />}

        {diffs && <DiffsBox diffs={diffs} metadata={addressMetadata} />}

        {items && <BatchBox items={items} metadata={addressMetadata} />}
      </Flex>
    </Box>
  );
}

export default App;
