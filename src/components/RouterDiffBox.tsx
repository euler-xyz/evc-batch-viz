import { Address } from "viem";
import {
  AddressMetadata,
  AddressMetadataMap,
  ConfigDiff,
  ResolvedVaultDiff,
  RouterDiff,
} from "../lib/types";
import AddressValue from "./values/AddressValue";
import {
  Collapse,
  Flex,
  Icon,
  IconButton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { useAddressMetadata } from "../context/AddressContext";

type Props = {
  address: Address;
  routerDiff: RouterDiff;
  oracleQuotes?: Map<string, bigint>;
};

function RouterDiffBox({ address, routerDiff, oracleQuotes }: Props) {
  const { isOpen, onToggle } = useDisclosure();
  const { metadata } = useAddressMetadata();

  return (
    <Flex
      direction="column"
      gap={2}
      borderRadius="md"
      borderColor="gray.200"
      borderWidth="1px"
      p={2}
    >
      <Flex direction="row" gap={2} align="center">
        <Text fontSize="lg">
          Router <AddressValue a={address as Address} />
        </Text>
        <IconButton
          onClick={onToggle}
          size="xs"
          aria-label={"expand"}
          icon={<Icon as={isOpen ? FaChevronUp : FaChevronDown} />}
        />
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        {Object.entries(routerDiff.newValues).map(([key, value]) => (
          <Flex direction="column" key={key} gap={2}>
            {(() => {
              if (key === "fallbackOracle") {
                return (
                  <Text>
                    {key} &rarr; <AddressValue a={value as Address} />
                  </Text>
                );
              } else if (key === "configs") {
                return (
                  <Flex direction="column" gap={2}>
                    {(value as ConfigDiff[]).map((configDiff, i) => {
                      const quoteKey = `${configDiff.oracle}-${configDiff.base}-${configDiff.quote}`;
                      const quote = oracleQuotes?.get(quoteKey);
                      
                      // Format quote based on quote token decimals
                      let formattedQuote = null;
                      if (quote) {
                        const quoteTokenMetadata = metadata[configDiff.quote];
                        const decimals = quoteTokenMetadata?.decimals || 18; // Default to 18 if not found
                        const formattedValue = Number(quote) / Math.pow(10, decimals);
                        const isUSD = configDiff.quote.toLowerCase() === '0x0000000000000000000000000000000000000348';
                        
                        if (isUSD) {
                          formattedQuote = ` (@ ${formattedValue.toFixed(2)})`;
                        } else {
                          formattedQuote = ` (@ ${formattedValue.toFixed(6)})`;
                        }
                      }
                      
                      return (
                        <Text key={i}>
                          Configure oracle{" "}
                          <AddressValue a={configDiff.oracle} /> to resolve{" "}
                          <AddressValue a={configDiff.base} />
                          /
                          <AddressValue a={configDiff.quote} />{formattedQuote}
                        </Text>
                      );
                    })}
                  </Flex>
                );
              } else if (key === "resolvedVaults") {
                return (
                  <Flex direction="column" gap={2}>
                    {(value as ResolvedVaultDiff[]).map(
                      (resolvedVaultDiff, i) => {
                        return (
                          <Text key={i}>
                            {resolvedVaultDiff.set ? "Enable" : "Disable"}{" "}
                            <AddressValue a={resolvedVaultDiff.vault} /> as a
                            resolved vault.
                          </Text>
                        );
                      }
                    )}
                  </Flex>
                );
              } else if (key === "governor") {
                return (
                  <Text>
                    {key} &rarr; <AddressValue a={value as Address} />
                  </Text>
                );
              }
              return <div>{key} &rarr; unknown</div>;
            })()}
          </Flex>
        ))}
      </Collapse>
    </Flex>
  );
}

export default RouterDiffBox;
