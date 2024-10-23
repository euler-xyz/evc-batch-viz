import { Box, Flex, Text } from "@chakra-ui/react";
import { AddressMetadata, AddressMetadataMap, DecodedItem } from "../lib/types";
import AddressValue from "./values/AddressValue";
import { abi } from "../lib/constants";
import { AbiParameter, Address, Hex, slice, toFunctionSelector } from "viem";
import CallParamValue from "./values/CallParamValue";
import { ReactNode } from "react";

type Props = {
  targetContract?: Address;
  data: Hex;
  decoded: DecodedItem;
  i: number;
  metadata: AddressMetadataMap<AddressMetadata>;
  children?: ReactNode;
};

function CallBox({
  decoded,
  i,
  metadata,
  targetContract,
  data,
  children,
}: Props) {
  const { args } = decoded;

  const signature = slice(data, 0, 4);
  const abiFunction = abi.find(
    (x) => x.type === "function" && signature === toFunctionSelector(x)
  );

  const inputParams = abiFunction?.inputs! as AbiParameter[];
  return (
    <Flex
      direction="column"
      borderColor="gray.200"
      borderWidth="1px"
      borderRadius="md"
      px={1}
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
        {targetContract && (
          <>
            <AddressValue
              a={targetContract}
              metadata={metadata[targetContract]}
            />
            .
          </>
        )}
        {decoded.functionName}(
        {args && (
          <Flex direction="column" gap={0} ml={2}>
            {args.map((arg, i) => {
              const param = inputParams[i];
              return (
                <Text key={i}>
                  <CallParamValue param={param} arg={arg} metadata={metadata} />
                </Text>
              );
            })}
          </Flex>
        )}
        ){children}
      </Text>
    </Flex>
  );
}

export default CallBox;
