import { DecodedEVCCall } from "../lib/types";
import ItemBox from "./ItemBox";

type Props = { items: DecodedEVCCall[] };

function BatchBox({ items }: Props) {
  return (
    <>
      <div className="summary">{items.length} batch items</div>

      {items.map((item, i) => (
        <ItemBox key={i} item={item} i={i} />
      ))}
    </>
  );
}

export default BatchBox;
