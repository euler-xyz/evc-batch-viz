import { Box, Flex, Text } from "@chakra-ui/react";
import {
  AddressMetadata,
  AddressMetadataMap,
  DecodedEVCCall,
} from "../lib/types";
import AddressValue from "./values/AddressValue";
import ItemActionBox from "./ItemActionBox";
import CallBox from "./CallBox";

type Props = {
  item: DecodedEVCCall;
  i: number;
  metadata: AddressMetadataMap<AddressMetadata>;
  isAdvancedMode: boolean;
};

function ItemBox({ item, i, metadata, isAdvancedMode }: Props) {
  if (!item.decoded) {
    return (
      <Flex
        direction="column"
        borderColor="gray.200"
        borderWidth="1px"
        borderRadius="md"
        px={1}
      >
        <Flex direction="row" align="center" gap={2}>
          <Text whiteSpace="nowrap">
            <Box as="span" color="gray.500">
              #{i}
            </Box>{" "}
            <Box as="span">
              {"<"}
              <AddressValue
                a={item.targetContract}
                metadata={metadata[item.targetContract]}
              />
              {">"}.
            </Box>
            <Box as="span" fontStyle="italic">
              {item.data.substring(0, 10)}()
            </Box>
          </Text>
        </Flex>
      </Flex>
    );
  }

  return !isAdvancedMode ? (
    <ItemActionBox i={i} item={item} metadata={metadata} />
  ) : (
    <CallBox
      data={item.data}
      decoded={item.decoded}
      i={i}
      targetContract={item.targetContract}
      metadata={metadata}
    >
      <>
        ,{" "}
        <Box as="span" color="gray.500" fontStyle="italic">
          onBehalfOf=
        </Box>
        <AddressValue
          a={item.onBehalfOfAccount}
          metadata={metadata[item.onBehalfOfAccount]}
        />
        ,{" "}
        <Box as="span" color="gray.500" fontStyle="italic">
          value=
        </Box>
        {item.value.toString()}
      </>
    </CallBox>
  );
}

export default ItemBox;
