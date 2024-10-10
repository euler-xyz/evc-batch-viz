type Props = {
  cap: number;
};

function CapValue({ cap }: Props) {
  return <span>{cap.toString()}</span>;
}

export default CapValue;
