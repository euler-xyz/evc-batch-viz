import { Link, Text } from "@chakra-ui/react";
import { Address, keccak256 } from "viem";

type Props = {
  a: Address;
  label?: string;
};

function AddressValue({ a, label }: Props) {
  const bits = keccak256(a).slice(2);
  const h = Number(`0x${bits.slice(0, 8)}`) % 360;
  const s = (Number(`0x${bits.slice(8, 16)}`) % 60) + 40;
  const l = (Number(`0x${bits.slice(16, 24)}`) % 30) + 20;
  const color = `hsl(${h} ${s}% ${l}%)`;

  const shortAddress = `${a.substring(0, 6)}...${a.substring(36)}`;
  return (
    <Link href={`https://etherscan.io/address/${a}`} color={color} whiteSpace="nowrap" isExternal>
      {shortAddress}
      {label && <span style={{ color: "gray" }}> [{label}]</span>}
    </Link>
  );
}

export default AddressValue;
