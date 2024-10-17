import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import {
  AddressMetadata,
  AddressMetadataMap,
  DecodedEVCCall,
} from "../lib/types";
import AddressValue from "./values/AddressValue";
import { abi } from "../lib/constants";
import { AbiParameter, Address, slice, toFunctionSelector } from "viem";
import { FaBolt } from "react-icons/fa6";
import CallParamValue from "./values/CallParamValue";
import ItemActionBox from "./ItemActionBox";

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
              {">"}::
            </Box>
            <Box as="span" fontStyle="italic">
              {item.data.substring(0, 10)}()
            </Box>
          </Text>
        </Flex>
      </Flex>
    );
  }

  const { args } = item.decoded;

  const signature = slice(item.data, 0, 4);
  const abiFunction = abi.find(
    (x) => x.type === "function" && signature === toFunctionSelector(x)
  );

  const inputParams = abiFunction?.inputs! as AbiParameter[];
  return (
    <Flex
      direction="column"
      borderColor="gray.100"
      borderWidth="1px"
      borderRadius="md"
    >
      {!isAdvancedMode && <ItemActionBox item={item} metadata={metadata} />}
      {isAdvancedMode && (
        <Flex
          direction="row"
          align="start"
          gap={2}
          justify="space-between"
          mx={1}
        >
          <Text
            wordBreak="break-all"
            fontFamily="monospace"
            fontSize="md"
            lineHeight="1.2"
          >
            <Box as="span" color="gray.500">
              #{i}
            </Box>{" "}
            <AddressValue
              a={item.targetContract}
              metadata={metadata[item.targetContract]}
            />
            .{item.decoded.functionName}(
            <Flex direction="column" gap={0} ml={2}>
              {args.map((arg, i) => {
                const param = inputParams[i];
                return (
                  <Text key={i}>
                    <CallParamValue
                      param={param}
                      arg={arg}
                      metadata={metadata}
                    />
                  </Text>
                );
              })}
            </Flex>
            ), onBehalfOf=
            <AddressValue a={item.onBehalfOfAccount} />, value=
            {item.value.toString()}
          </Text>
        </Flex>
      )}
    </Flex>
  );
}

export default ItemBox;
