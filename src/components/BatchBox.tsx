import { Flex, Heading, HStack, Switch, Text } from "@chakra-ui/react";
import { DecodedEVCCall } from "../lib/types";
import ItemBox from "./ItemBox";
import { useState } from "react";
import { useAddressMetadata } from "../context/AddressContext";

type Props = {
  items: DecodedEVCCall[];
};

function BatchBox({ items }: Props) {
  const [isAdvancedMode, setAdvancedMode] = useState<boolean>(true);
  const { metadata } = useAddressMetadata();

  return (
    <Flex direction="column" gap={2}>
      <Heading size="lg" mb={2}>
        Items
      </Heading>
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
        <ItemBox key={i} item={item} i={i} isAdvancedMode={isAdvancedMode} />
      ))}
    </Flex>
  );
}

export default BatchBox;
