import { Box, Flex, Text } from "@chakra-ui/react";
import { DecodedEVCCall } from "../lib/types";
import AddressValue from "./values/AddressValue";
import ItemActionBox from "./ItemActionBox";
import CallBox from "./CallBox";
import BatchBox from "./BatchBox";

type Props = {
  item: DecodedEVCCall;
  i: number;
  isAdvancedMode: boolean;
};

function ItemBox({ item, i, isAdvancedMode }: Props) {
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
              <AddressValue a={item.targetContract} />
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
    <ItemActionBox i={i} item={item} />
  ) : (
    <Flex direction="column" gap={2}>
      <CallBox
        data={item.data}
        decoded={item.decoded}
        batchType={item.batchType}
        i={i}
        targetContract={item.targetContract}
      >
        <>
          ,{" "}
          <Box as="span" color="gray.500" fontStyle="italic">
            onBehalfOf=
          </Box>
          <AddressValue a={item.onBehalfOfAccount} />,{" "}
          <Box as="span" color="gray.500" fontStyle="italic">
            value=
          </Box>
          {item.value.toString()}
          {item.predecessor && (
            <>
              ,{" "}
              <Box as="span" color="gray.500" fontStyle="italic">
                predecessor=
              </Box>
              {item.predecessor}
            </>
          )}
          {item.salt && (
            <>
              ,{" "}
              <Box as="span" color="gray.500" fontStyle="italic">
                salt=
              </Box>
              {item.salt}
            </>
          )}
        </>
      </CallBox>
      
      {/* Display nested batch if it exists */}
      {item.nestedBatch && (
        <Box ml={4} borderLeft="2px solid" borderColor="blue.200" pl={4}>
          <Text fontWeight="bold" color="blue.600" mb={2}>
            Nested EVC Batch:
          </Text>
          {item.nestedBatch.timelockInfo && (
            <Box mb={2} p={2} bg="green.50" borderRadius="md">
              <Text fontWeight="bold" color="green.600">
                Timelock Delay: {item.nestedBatch.timelockInfo.delay.toString()}s
              </Text>
            </Box>
          )}
          <BatchBox items={item.nestedBatch.items} />
        </Box>
      )}
    </Flex>
  );
}

export default ItemBox;
