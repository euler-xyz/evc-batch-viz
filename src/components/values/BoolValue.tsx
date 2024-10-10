type Props = {
  v: boolean;
};

function BoolValue({ v }: Props) {
  return <span>{v ? "true" : "false"}</span>;
}

export default BoolValue;
