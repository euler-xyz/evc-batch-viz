import { Box, Link } from "@chakra-ui/react";
import { Address, keccak256 } from "viem";
import { useAddressMetadata } from "../../context/AddressContext";
import { useChainConfig } from "../../context/ChainContext";

type Props = {
  a: Address;
};

function AddressValue({ a }: Props) {
  const { metadata: allMetadata } = useAddressMetadata();
  const { chain } = useChainConfig();
  const metadata = allMetadata[a];

  const bits = keccak256(a).slice(2);
  const h = Number(`0x${bits.slice(0, 8)}`) % 360;
  const s = (Number(`0x${bits.slice(8, 16)}`) % 50) + 50;
  const l = (Number(`0x${bits.slice(16, 24)}`) % 30) + 65;
  const color = `hsl(${h} ${s}% ${l}%)`;

  const shortAddress = `${a.substring(0, 6)}...${a.substring(36)}`;

  const content = metadata
    ? (() => {
        if (metadata.kind === "vault") {
          return `${metadata.name}`;
        } else if (metadata.kind === "oracle") {
          return <span>{metadata.name}</span>;
        } else if (metadata.kind === "token") {
          return <span>{metadata.symbol}</span>;
        } else {
          return <span>{metadata.label}</span>;
        }
      })()
    : shortAddress;

  return (
    <Link
      href={`${chain.explorerUrl}/address/${a}`}
      color={color}
      whiteSpace="nowrap"
      isExternal
    >
      <Box
        as="span"
        bgColor={color}
        color="black"
        px={1}
        rounded="full"
        fontWeight="semibold"
      >
        {content}
      </Box>
    </Link>
  );
}

export default AddressValue;
