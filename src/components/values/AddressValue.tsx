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
  const s = (Number(`0x${bits.slice(8, 16)}`) % 60) + 40;
  const l = (Number(`0x${bits.slice(16, 24)}`) % 30) + 20;
  const color = `hsl(${h} ${s}% ${l}%)`;

  const shortAddress = `${a.substring(0, 6)}...${a.substring(36)}`;

  return (
    <Link
      href={`${chain.explorerUrl}/address/${a}`}
      color={color}
      whiteSpace="nowrap"
      isExternal
    >
      {metadata ? (
        <Box as="span" color={color} fontWeight="bold">
          {(() => {
            if (metadata.kind === "vault") {
              return <span>{metadata.name}</span>;
            } else if (metadata.kind === "oracle") {
              return <span>{metadata.name}</span>;
            } else if (metadata.kind === "token") {
              return <span>{metadata.symbol}</span>;
            } else {
              return <span>{metadata.label}</span>;
            }
          })()}
        </Box>
      ) : (
        shortAddress
      )}
    </Link>
  );
}

export default AddressValue;
