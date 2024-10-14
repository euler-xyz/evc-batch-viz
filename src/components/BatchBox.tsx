import { Flex, Heading } from "@chakra-ui/react";
import { DecodedEVCCall } from "../lib/types";
import ItemBox from "./ItemBox";

type Props = { items: DecodedEVCCall[] };

function BatchBox({ items }: Props) {
  return (
    <Flex direction="column" gap={4}>
      <Heading size="lg">Items</Heading>
      <Heading size="md">{items.length} batch items</Heading>
      {items.map((item, i) => (
        <ItemBox key={i} item={item} i={i} />
      ))}
    </Flex>
  );
}

export default BatchBox;
