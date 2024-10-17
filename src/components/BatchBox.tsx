import {
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Switch,
  Text,
} from "@chakra-ui/react";
import {
  AddressMetadata,
  AddressMetadataMap,
  DecodedEVCCall,
} from "../lib/types";
import ItemBox from "./ItemBox";
import { useState } from "react";

type Props = {
  items: DecodedEVCCall[];
  metadata: AddressMetadataMap<AddressMetadata>;
};

function BatchBox({ items, metadata }: Props) {
  const [isAdvancedMode, setAdvancedMode] = useState<boolean>(true);

  return (
    <Flex direction="column" gap={4}>
      <Heading size="lg">Items</Heading>
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
        <ItemBox
          key={i}
          item={item}
          i={i}
          metadata={metadata}
          isAdvancedMode={isAdvancedMode}
        />
      ))}
    </Flex>
  );
}

export default BatchBox;
