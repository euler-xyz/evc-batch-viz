import { Box, Flex } from "@chakra-ui/react";
import { type AbiParameter, type Address, decodeFunctionData } from "viem";
import AddressValue from "./AddressValue";
import type { DecodedItem } from "../../lib/types";
import { abi } from "../../lib/constants";
import CallBox from "../CallBox";
import { Key } from "react";
import { useAddressMetadata } from "../../context/AddressContext";

type Props = {
  param: AbiParameter;
  arg: any;
};

// Helper function to safely stringify objects with BigInt values
const safeStringify = (obj: any): string => {
  try {
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === 'bigint') {
        return value.toString();
      }
      return value;
    });
  } catch (e) {
    return String(obj);
  }
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
        // Handle null/undefined values
        if (arg === null) {
          return <Box as="span" color="gray.500" fontStyle="italic">null</Box>;
        }
        if (arg === undefined) {
          return <Box as="span" color="gray.500" fontStyle="italic">undefined</Box>;
        }
        
        if (Array.isArray(arg)) {
          // Handle empty arrays
          if (arg.length === 0) {
            return <Box as="span">[]</Box>;
          }
          
          return (
            <>
              {"["}
              <Flex direction="column" ml={2}>
                {arg.map((el, i) => {
                  try {
                    // Check if the element is an object with a data property (like in schedule function)
                    const callData = typeof el === 'object' && el !== null && 'data' in el ? el.data : el;
                    
                    // Only try to decode if it looks like hex calldata
                    if (typeof callData === 'string' && callData.startsWith('0x')) {
                      const decodedItem: DecodedItem = decodeFunctionData({
                        abi: [...abi],
                        data: callData as `0x${string}`,
                      });

                      return (
                        <CallBox key={i} i={i} decoded={decodedItem} data={callData as `0x${string}`} />
                      );
                    } else {
                      // Handle non-calldata array elements (like struct objects)
                      if (typeof el === 'object' && el !== null) {
                        return (
                          <Box key={i} as="span">
                            {safeStringify(el)}
                          </Box>
                        );
                      } else {
                        return (
                          <Box key={i} as="span">
                            {el?.toString() || 'null'}
                          </Box>
                        );
                      }
                    }
                  } catch (e) {
                    console.error(e);
                    // Fallback: render as string/JSON
                    if (typeof el === 'object' && el !== null) {
                      return (
                        <Box key={i} as="span">
                          {safeStringify(el)}
                        </Box>
                      );
                    } else {
                      return (
                        <Box key={i} as="span">
                          {el?.toString() || 'null'}
                        </Box>
                      );
                    }
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

        // Handle simple tuples
        if (param.type === "tuple") {
          return (
            <>
              {param.internalType}(
              <Flex direction="column" ml={2}>
                {('components' in param ? param.components : [])?.map(
                  (paramComponent: AbiParameter, i: Key | null | undefined) => (
                    <CallParamValue
                      key={i}
                      param={paramComponent}
                      arg={arg?.[paramComponent.name!]}
                    />
                  )
                )}
              </Flex>
              )
            </>
          );
        }

        // Handle tuple arrays (like MarketAllocation[])
        if (param.type === "tuple[]" && Array.isArray(arg)) {
          return (
            <>
              {param.internalType}[
              <Flex direction="column" ml={2}>
                {arg.length === 0 ? (
                  <Box as="span" color="gray.500" fontStyle="italic">empty</Box>
                ) : (
                  arg.map((tupleEl, idx) => (
                    <Box key={idx}>
                      {param.internalType?.replace("[]", "")}(
                      <Flex direction="column" ml={2}>
                        {('components' in param ? param.components : [])?.map(
                          (paramComponent: AbiParameter, i: Key | null | undefined) => {
                            const componentName = paramComponent.name;
                            const componentValue = componentName ? tupleEl?.[componentName] : undefined;
                            
                            return (
                              <CallParamValue
                                key={i}
                                param={paramComponent}
                                arg={componentValue}
                              />
                            );
                          }
                        )}
                      </Flex>
                      )
                    </Box>
                  ))
                )}
              </Flex>
              ]
            </>
          );
        }

        if (param.type === "array") {
          return <Box as="span">ARRAY{arg.toString()}</Box>;
        }

        // Handle BigInt values
        if (typeof arg === 'bigint') {
          return <Box as="span">{arg.toString()}</Box>;
        }

        // Safety check to prevent rendering objects directly
        if (typeof arg === 'object' && arg !== null) {
          return <Box as="span">{safeStringify(arg)}</Box>;
        }

        // Handle primitive types safely
        try {
          return <Box as="span">{String(arg)}</Box>;
        } catch (e) {
          return <Box as="span" color="red.500">[Unrenderable value]</Box>;
        }
      })()}
    </Box>
  );
}

export default CallParamValue;
