type Props = {
  ltv: number;
};

function LTVValue({ ltv }: Props) {
  return <span>{ltv.toString()}</span>;
}

export default LTVValue;
