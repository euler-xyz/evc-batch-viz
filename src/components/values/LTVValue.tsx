type Props = {
  ltv: number;
};

function LTVValue({ ltv }: Props) {
  return (
    <>
      <span>{ltv.toString()}</span>{" "}
      <span style={{ color: "gray" }}>[{(ltv / 100).toFixed(2)}%]</span>
    </>
  );
}

export default LTVValue;
