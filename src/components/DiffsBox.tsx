import { Diffs } from "../lib/types";

type Props = { diffs: Diffs };

function DiffsBox({ diffs }: Props) {
  return (
    <>
      <div className="summary">
        {Object.keys(diffs.vaults).length} modified vaults
      </div>
      <div className="summary">
        {Object.keys(diffs.routers).length} modified routers
      </div>
    </>
  );
}

export default DiffsBox;
