import { useEffect, useState } from "react";

import { decodeEVCBatch } from "./lib/decode";
import { type DecodedEVCCall } from "./lib/types";
import { Address, checksumAddress, Hash } from "viem";
import {
  getTxCalldata,
  indexTokens,
  indexOracles,
  indexVaults,
  indexGovernors,
  getOracleQuote,
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
  const [timelockInfo, setTimelockInfo] = useState();
  const [oracleQuotes, setOracleQuotes] = useState<Map<string, bigint>>(new Map());
  const { metadata, setMetadata } = useAddressMetadata();
  const { chain, setChain } = useChainConfig();

  useEffect(() => {
    setMetadata(initAddressMetadataMap(chain.id));
  }, [chain]);

  const doDecode = () => {
    setError(undefined);
    setItems(undefined);
    setTimelockInfo(undefined);

    try {
      let parsed = text.trim();

      if (parsed.match(/^[\[\{"]/)) {
        parsed = JSON.parse(parsed);
      } else {
        if (!parsed.startsWith("0x")) parsed = `0x${parsed}`;
        parsed = parsed.toLowerCase();
        parsed = { data: parsed, };
      }

      let decoded = decodeEVCBatch(parsed);
      setItems(decoded.items);
      setTimelockInfo(decoded.timelockInfo);
    } catch (e: any) {
      console.error(e);
      setError(e.toString());
      return;
    }
  };

  const loadTx = async () => {
    setError(undefined);
    setItems(undefined);
    setTimelockInfo(undefined);

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
    setTimelockInfo(undefined);
    setText(payload ? JSON.stringify(payload) : '');
  };

  useEffect(() => {
    if (!items) return;
    const oracleAddresses: Set<Address> = new Set();
    const vaultAddresses: Set<Address> = new Set();
    const tokenAddresses: Set<Address> = new Set();
    const governorAddresses: Set<Address> = new Set();

    // Helper function to process calls recursively
    function processCalls(callList: DecodedEVCCall[]) {
      callList.forEach((call) => {
        const f = call.decoded?.functionName;
        if (!f) return;

        let targetContract = call.targetContract;
        let proxiedAddress: Address | undefined;

        const targetIsGAC =
          targetContract &&
          metadata[targetContract]?.kind === "global" &&
          (metadata[targetContract] as any).label === 'governor/accessControlEmergencyGovernor'
          ;

        const targetIsCapRiskSteward =
          targetContract &&
          metadata[targetContract]?.kind === "global" &&
          (metadata[targetContract] as any).label === 'governor/capRiskSteward'
          ;

        // Check if this might be a governor contract call with appended address
        const hasAppendedAddress = call.data.length >= 42 && call.data.slice(-40).match(/^[0-9a-f]{40}$/i);
        
        if (hasAppendedAddress) {
          // Extract the appended address (this might be the proxied address)
          proxiedAddress = checksumAddress(`0x${call.data.slice(-40)}`);
          
          // Only add to governor addresses if it's not a known global address
          const isKnownGlobal = metadata[targetContract]?.kind === "global";
          if (!isKnownGlobal) {
            governorAddresses.add(targetContract);
            // Optimistically mark as governor proxy call
            call.isGovernorProxy = true;
            call.proxiedAddress = proxiedAddress;
          }
        }

        // Handle known governor contracts from metadata (if available)
        if (targetIsGAC || targetIsCapRiskSteward) {
          const proxiedAddress = checksumAddress(`0x${call.data.slice(-40)}`);
          targetContract = proxiedAddress;
          call.isGovernorProxy = true;
          call.proxiedAddress = proxiedAddress;
        }

        if (eVaultFunctionNames.includes(f)) {
          // If we have a proxied address, use that instead of the target contract
          if (call.isGovernorProxy && call.proxiedAddress) {
            vaultAddresses.add(call.proxiedAddress);
          } else {
            vaultAddresses.add(targetContract);
          }
        } else if (eulerRouterFunctionNames.includes(f)) {
          if (call.isGovernorProxy && call.proxiedAddress) {
            oracleAddresses.add(call.proxiedAddress);
          } else {
            oracleAddresses.add(targetContract);
          }
        }

        if (
          metadata[targetContract]?.kind === "global" &&
          (metadata[targetContract] as any).label === "periphery/oracleAdapterRegistry"
        ) {
          if (f === "add") {
            oracleAddresses.add(call.decoded.args[0] as Address);
            tokenAddresses.add(call.decoded.args[1] as Address);
            tokenAddresses.add(call.decoded.args[2] as Address);
          } else if (f === "revoke") {
            oracleAddresses.add(call.decoded.args[0] as Address);
          }
        }

        if (f === "govSetConfig") {
          tokenAddresses.add(call.decoded.args[0] as Address);
          tokenAddresses.add(call.decoded.args[1] as Address);
          oracleAddresses.add(call.decoded.args[2] as Address);
        } else if (f === "govSetResolvedVault") {
          vaultAddresses.add(call.decoded.args[0] as Address);
        } else if (f === "setLTV") {
          vaultAddresses.add(call.decoded.args[0] as Address);
        }

        // Process nested batch if it exists
        if (call.nestedBatch?.items) {
          processCalls(call.nestedBatch.items);
        }
      });
    }

    processCalls(items);

    (async () => {
      const [oracleMap, vaultMap, tokenMap, governorMap] = await Promise.all([
        indexOracles(Array.from(oracleAddresses), chain.client),
        indexVaults(Array.from(vaultAddresses), chain.client),
        indexTokens(Array.from(tokenAddresses), chain.client),
        indexGovernors(Array.from(governorAddresses), chain.client, metadata),
      ]);

      const updatedMetadata = {
        ...metadata,
        ...{ ...oracleMap, ...tokenMap, ...vaultMap, ...governorMap },
      };

      setMetadata((prev) => ({
        ...prev,
        ...{ ...oracleMap, ...tokenMap, ...vaultMap, ...governorMap },
      }));

      // Reset governor proxy flags for addresses that are not actually governors
      function resetInvalidGovernorFlags(callList: DecodedEVCCall[]) {
        callList.forEach((call) => {
          if (call.isGovernorProxy && call.targetContract) {
            // Check if the target contract is actually a governor
            const isActuallyGovernor = updatedMetadata[call.targetContract]?.kind === "governor";
            if (!isActuallyGovernor) {
              // Reset the flags if it's not a governor
              call.isGovernorProxy = false;
              call.proxiedAddress = undefined;
            }
          }

          // Process nested batch if it exists
          if (call.nestedBatch?.items) {
            resetInvalidGovernorFlags(call.nestedBatch.items);
          }
        });
      }

      resetInvalidGovernorFlags(items);

      // Fetch oracle quotes for govSetConfig calls
      const oracleQuotePromises: Promise<void>[] = [];

      function collectOracleQuotes(callList: DecodedEVCCall[]) {
        callList.forEach((call) => {
          if (call.decoded?.functionName === "govSetConfig") {
            const baseToken = call.decoded.args[0] as Address;
            const quoteToken = call.decoded.args[1] as Address;
            const oracleAddress = call.decoded.args[2] as Address;
            
            // Use 1 unit of the base token for the quote
            const amount = 10n ** BigInt(updatedMetadata[baseToken]?.decimals || 18);
            const quoteKey = `${oracleAddress}-${baseToken}-${quoteToken}`;
            
            oracleQuotePromises.push(
              getOracleQuote(oracleAddress, baseToken, quoteToken, amount, chain.client)
                .then(quote => {
                  if (quote !== null) {
                    setOracleQuotes(prev => new Map(prev).set(quoteKey, quote));
                  }
                })
            );
          }

          // Process nested batch if it exists
          if (call.nestedBatch?.items) {
            collectOracleQuotes(call.nestedBatch.items);
          }
        });
      }

      collectOracleQuotes(items);
      
      // Wait for all oracle quotes to complete (for cleanup)
      Promise.all(oracleQuotePromises).then(() => {
        // All quotes completed
      });
    })();
  }, [items]);

  const diffs = items ? getDiffs(items) : undefined;

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
              <Button colorScheme="red" onClick={() => loadPayload('')}>
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

        {diffs && <DiffsBox diffs={diffs} oracleQuotes={oracleQuotes} />}

        {items && <BatchBox items={items} timelockInfo={timelockInfo} oracleQuotes={oracleQuotes} />}
      </Flex>
    </Box>
  );
}

export default App;
