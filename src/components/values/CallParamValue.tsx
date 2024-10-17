import { Box, Flex } from "@chakra-ui/react";
import { AbiParameter, Address } from "viem";
import AddressValue from "./AddressValue";
import { AddressMetadataMap, AddressMetadata } from "../../lib/types";

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
