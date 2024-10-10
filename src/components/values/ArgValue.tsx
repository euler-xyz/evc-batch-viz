type Props = {
  name: string;
};

function ArgValue({ name }: Props) {
  return (
    <>
      <span>{name} </span>{" "}
    </>
  );
}

export default ArgValue;
