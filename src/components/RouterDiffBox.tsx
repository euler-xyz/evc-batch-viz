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

type Props = {
  address: Address;
  routerDiff: RouterDiff;
  metadata: AddressMetadataMap<AddressMetadata>;
};

function RouterDiffBox({ address, routerDiff, metadata }: Props) {
  const { isOpen, onToggle } = useDisclosure();

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
                    {key} &rarr;{" "}
                    <AddressValue
                      a={value as Address}
                      metadata={metadata[value as Address]}
                    />
                  </Text>
                );
              } else if (key === "configs") {
                return (
                  <Flex direction="column" gap={2}>
                    {(value as ConfigDiff[]).map((configDiff, i) => {
                      return (
                        <Text key={i}>
                          Configure oracle{" "}
                          <AddressValue
                            a={configDiff.oracle}
                            metadata={metadata[configDiff.oracle]}
                          />{" "}
                          to resolve{" "}
                          <AddressValue
                            a={configDiff.base}
                            metadata={metadata[configDiff.base]}
                          />
                          /
                          <AddressValue
                            a={configDiff.quote}
                            metadata={metadata[configDiff.quote]}
                          />
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
                            <AddressValue
                              a={resolvedVaultDiff.vault}
                              metadata={metadata[resolvedVaultDiff.vault]}
                            />{" "}
                            as a resolved vault.
                          </Text>
                        );
                      }
                    )}
                  </Flex>
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
