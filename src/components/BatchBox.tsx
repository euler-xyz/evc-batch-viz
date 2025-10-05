import { Flex, Heading, HStack, Switch, Text } from "@chakra-ui/react";
import { DecodedEVCCall } from "../lib/types";
import ItemBox from "./ItemBox";
import { useState } from "react";
import { useAddressMetadata } from "../context/AddressContext";

type Props = {
  items: DecodedEVCCall[];
  timelockInfo?: any;
  isNested?: boolean;
  oracleQuotes?: Map<string, bigint>;
};

function BatchBox({ items, timelockInfo, isNested = false, oracleQuotes }: Props) {
  const [isAdvancedMode, setAdvancedMode] = useState<boolean>(true);
  const { metadata } = useAddressMetadata();

  return (
    <Flex direction="column" gap={2}>
      {!isNested && (
        <Heading size="lg" mb={2}>
          Calls
        </Heading>
      )}
      {timelockInfo && (
        <Flex direction="column" gap={1} mb={2}>
          <Text fontSize="sm" color="green.700" fontWeight="bold">
            Timelock:
          </Text>
          <Text fontSize="sm" color="green.700" ml={2}>
            delay = {timelockInfo.delay}s
          </Text>
          {timelockInfo.predecessor && (
            <Text fontSize="sm" color="green.700" ml={2}>
              predecessor = {timelockInfo.predecessor}
            </Text>
          )}
          {timelockInfo.salt && (
            <Text fontSize="sm" color="green.700" ml={2}>
              salt = {timelockInfo.salt}
            </Text>
          )}
        </Flex>
      )}
      <Flex direction="row" align="baseline" gap={4}>
        <Heading size="md">{items.length} batch items</Heading>
        <HStack>
          <Text>Advanced Mode</Text>
          <Switch
            isChecked={isAdvancedMode}
            onChange={(e) => {
              setAdvancedMode(e.target.checked);
            }}
            size="sm"
          />
        </HStack>
      </Flex>
      {items.map((item, i) => (
        <ItemBox key={i} item={item} i={i} isAdvancedMode={isAdvancedMode} oracleQuotes={oracleQuotes} />
      ))}
    </Flex>
  );
}

export default BatchBox;
