type Props = {
  cap: number;
};

function CapValue({ cap }: Props) {
  const exponent = BigInt(cap & 63);
  const scalar = BigInt(cap >> 6);

  const label =
    cap === 0 ? "unlimited" : ((10n ** exponent * scalar) / 100n).toString();
  return (
    <>
      <span>{cap.toString()}</span>{" "}
      <span style={{ color: "gray" }}>[{label}]</span>{" "}
    </>
  );
}

export default CapValue;
