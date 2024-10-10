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
  return (
    <>
      <a href={`https://etherscan.io/address/${a}`} style={{ color }}>
        {a}
      </a>
      {label && <span style={{ color: "gray" }}> [{label}]</span>}
    </>
  );
}

export default AddressValue;
