import { useEffect, useState } from "react";

import { decodeEVCBatch } from "./lib/decode";
import { type DecodedEVCCall } from "./lib/types";
import { Address, checksumAddress, Hash } from "viem";
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
  Select,
  Spacer,
  Textarea,
  Text,
} from "@chakra-ui/react";
import ErrorBox from "./components/ErrorBox";
import {
  eulerRouterFunctionNames,
  eVaultFunctionNames,
  initAddressMetadataMap,
  supportedChains,
  supportedChainList,
} from "./lib/constants";
import { base, mainnet } from "viem/chains";
import { useAddressMetadata } from "./context/AddressContext";
import { chainConfig } from "viem/zksync";
import { useChainConfig } from "./context/ChainContext";

function App() {
  const [text, setText] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const [error, setError] = useState<string>();
  const [items, setItems] = useState<DecodedEVCCall[]>();
  const { metadata, setMetadata } = useAddressMetadata();
  const { chain, setChain } = useChainConfig();

  useEffect(() => {
    setMetadata(initAddressMetadataMap(chain.id));
  }, [chain]);

  const doDecode = () => {
    setError(undefined);
    setItems(undefined);

    try {
      let parsed = text.trim();

      if (parsed.match(/^[\[\{"]/)) {
        parsed = JSON.parse(parsed);
      } else {
        if (!parsed.startsWith("0x")) parsed = `0x${cleanedText}`;
        parsed = parsed.toLowerCase();
        parsed = { data: parsed, };
      }

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
      const txCalldata = await getTxCalldata(txHash as Hash, chain.client);
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

      let targetContract = call.targetContract;

      const targetIsGAC =
        targetContract &&
        metadata[targetContract]?.kind === "global" &&
        metadata[targetContract].label === 'governor/accessControlEmergencyGovernor'
        ;

      if (targetIsGAC) {
        targetContract = checksumAddress(`0x${call.data.slice(-40)}`);
      }

      if (eVaultFunctionNames.includes(f)) {
        vaultAddresses.add(targetContract);
      } else if (eulerRouterFunctionNames.includes(f)) {
        oracleAddresses.add(targetContract);
      }

      if (
        metadata[targetContract]?.kind === "global" &&
        metadata[targetContract]?.label === "periphery/oracleAdapterRegistry"
      ) {
        if (f === "add") {
          oracleAddresses.add(call.decoded.args[0]);
          tokenAddresses.add(call.decoded.args[1]);
          tokenAddresses.add(call.decoded.args[2]);
        } else if (f === "revoke") {
          oracleAddresses.add(call.decoded.args[0]);
        }
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
        indexOracles(Array.from(oracleAddresses), chain.client),
        indexVaults(Array.from(vaultAddresses), chain.client),
        indexTokens(Array.from(tokenAddresses), chain.client),
      ]);

      setMetadata((prev) => ({
        ...prev,
        ...{ ...oracleMap, ...tokenMap, ...vaultMap },
      }));
    })();
  }, [items]);

  const diffs = getDiffs(items);

  return (
    <Box px={6} py={6}>
      <Flex direction="column" gap={4}>
        <Flex direction="row" align="center" justify="space-between">
          <Heading>🧙‍♂️ EVC Batch Viz</Heading>
          <Flex direction="row" align="center" gap={2}>
            <Text fontWeight="bold">Chain</Text>
            <Select
              maxW="12rem"
              onChange={(e) => {
                e.preventDefault();
                setChain(supportedChains[+e.target.value]);
              }}
            >
              {supportedChainList.map(c => <option value={c.chainId} key={c.chainId}>{c.name}</option>)}
            </Select>
          </Flex>
        </Flex>

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

        {diffs && <DiffsBox diffs={diffs} />}

        {items && <BatchBox items={items} />}
      </Flex>
    </Box>
  );
}

export default App;
