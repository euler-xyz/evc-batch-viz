import { Box, Flex } from "@chakra-ui/react";
import { DecodedItem } from "../lib/types";
import AddressValue from "./values/AddressValue";
import { abi } from "../lib/constants";
import {
  AbiParameter,
  Address,
  checksumAddress,
  Hex,
  slice,
  toFunctionSelector,
} from "viem";
import CallParamValue from "./values/CallParamValue";
import { ReactNode } from "react";
import { useAddressMetadata } from "../context/AddressContext";

type Props = {
  targetContract?: Address;
  data: Hex;
  decoded: DecodedItem;
  i: number;
  children?: ReactNode;
  batchType?: 'batch' | 'scheduleBatch' | 'schedule';
};

function CallBox({ decoded, i, targetContract, data, children, batchType }: Props) {
  const { metadata } = useAddressMetadata();
  const { args } = decoded;

  const signature = slice(data, 0, 4);
  const abiFunction = abi.find(
    (x) => x.type === "function" && signature === toFunctionSelector(x)
  );

  const inputParams = abiFunction?.inputs! as AbiParameter[];
  const originalProxy = targetContract;

  const targetIsGAC =
    targetContract &&
    metadata[targetContract]?.kind === "global" &&
    metadata[targetContract].label === 'governor/accessControlEmergencyGovernor';

  const targetIsCapRiskSteward =
    targetContract &&
    metadata[targetContract]?.kind === "global" &&
    metadata[targetContract].label === 'governor/capRiskSteward';

  const isProxyCall = targetIsGAC || targetIsCapRiskSteward;

  if (isProxyCall) {
    targetContract = checksumAddress(`0x${data.slice(-40)}`);
  }

  return (
    <Flex
      direction="column"
      borderColor="gray.200"
      borderWidth="1px"
      borderRadius="md"
      px={1}
    >
      <Box
        wordBreak="break-all"
        fontFamily="monospace"
        fontSize="md"
        lineHeight="1.2"
      >
        <Box as="span" color="gray.500">
          #{i}
        </Box>{" "}
        {targetContract && (
            <><AddressValue a={targetContract} />.</>
        )}
        {decoded.functionName}(
        {args && (
          <Flex direction="column" gap={0} ml={2}>
            {args.map((arg, i) => {
              const param = inputParams[i];
              return (
                <div key={i}>
                  <CallParamValue param={param} arg={arg} />
                </div>
              );
            })}
          </Flex>
        )}
        ){children}
        {isProxyCall && (
          <>
            ,{" "}
            <Box as="span" color="gray.500" fontStyle="italic">
              proxy=
            </Box>
            <AddressValue a={originalProxy} />
          </>
        )}
      </Box>
    </Flex>
  );
}

export default CallBox;
