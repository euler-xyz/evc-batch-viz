import { Box, Flex } from "@chakra-ui/react";
import { AbiParameter, Address, decodeFunctionData } from "viem";
import AddressValue from "./AddressValue";
import {
  AddressMetadataMap,
  AddressMetadata,
  DecodedItem,
} from "../../lib/types";
import Swapper from "../../abi/Swapper";
import CallBox from "../CallBox";

type Props = {
  param: AbiParameter;
  arg: any;
  metadata: AddressMetadataMap<AddressMetadata>;
};

function CallParamValue({ param, arg, metadata }: Props) {
  const name = param?.name?.toString() ?? "<anonymous>";

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
                  const decodedItem: DecodedItem = decodeFunctionData({
                    abi: Swapper,
                    data: el,
                  });

                  return (
                    <CallBox
                      key={i}
                      i={i}
                      decoded={decodedItem}
                      metadata={metadata}
                      data={el}
                    />
                  );
                })}
              </Flex>
              {"]"}
            </>
          );
        }

        if (param.type === "address") {
          return (
            <AddressValue
              a={arg as Address}
              metadata={metadata[arg as Address]}
            />
          );
        }

        if (param.type === "tuple") {
          return (
            <>
              {param.internalType}(
              <Flex direction="column" ml={2}>
                {param.components.map((paramComponent, i) => (
                  <CallParamValue
                    key={i}
                    param={paramComponent}
                    arg={arg[paramComponent.name]}
                    metadata={metadata}
                  />
                ))}
              </Flex>
              )
            </>
          );
        }

        return <Box as="span">{arg.toString()}</Box>;
      })()}
    </Box>
  );
}

export default CallParamValue;
