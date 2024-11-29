import { Box, Flex } from "@chakra-ui/react";
import { type AbiParameter, type Address, decodeFunctionData } from "viem";
import AddressValue from "./AddressValue";
import type { DecodedItem } from "../../lib/types";
import Swapper from "../../abi/Swapper";
import CallBox from "../CallBox";
import FeeFlowController from "../../abi/FeeFlowController";
import { Key } from "react";
import { useAddressMetadata } from "../../context/AddressContext";

type Props = {
  param: AbiParameter;
  arg: any;
};

function CallParamValue({ param, arg }: Props) {
  const name = param?.name?.toString() ?? "<anonymous>";
  const { metadata } = useAddressMetadata();

  return (
    <Box>
      <Box as="span" color="gray.500" fontStyle="italic">
        {name}=
      </Box>
      {(() => {
        if (Array.isArray(arg)) {
          return (
            <>
              {"["}
              <Flex direction="column" ml={2}>
                {arg.map((el, i) => {
                  try {
                    const decodedItem: DecodedItem = decodeFunctionData({
                      abi: [...Swapper, ...FeeFlowController],
                      data: el,
                    });

                    return (
                      <CallBox key={i} i={i} decoded={decodedItem} data={el} />
                    );
                  } catch (e) {
                    console.error(e);
                    return el;
                  }
                })}
              </Flex>
              {"]"}
            </>
          );
        }

        if (param.type === "address") {
          return <AddressValue a={arg as Address} />;
        }

        if (param.type === "tuple") {
          return (
            <>
              {param.internalType}(
              <Flex direction="column" ml={2}>
                {param.components.map(
                  (paramComponent: AbiParameter, i: Key | null | undefined) => (
                    <CallParamValue
                      key={i}
                      param={paramComponent}
                      arg={arg[paramComponent.name]}
                    />
                  )
                )}
              </Flex>
              )
            </>
          );
        }

        if (param.type === "array") {
          return <Box as="span">ARRAY{arg.toString()}</Box>;
        }

        return <Box as="span">{arg.toString()}</Box>;
      })()}
    </Box>
  );
}

export default CallParamValue;
