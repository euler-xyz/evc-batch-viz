import { Address } from "viem";
import { Diffs } from "../lib/types";
import { Alert, Flex, Heading } from "@chakra-ui/react";
import VaultDiffBox from "./VaultDiffBox";

type Props = { diffs: Diffs };

function DiffsBox({ diffs }: Props) {
  return (
    <Flex direction="column" gap={4}>
      <Heading size="lg">Changes</Heading>
      <Flex direction="column" gap={2}>
        <Heading size="md">{Object.keys(diffs.vaults).length} modified vaults</Heading>
        <Flex direction="column" gap={2}>
          {Object.entries(diffs.vaults).map(([address, vaultDiff]) => (
            <VaultDiffBox key={address} address={address as Address} vaultDiff={vaultDiff} />
          ))}
        </Flex>
      </Flex>
      <Flex direction="column" gap={2}>
        <Heading size="md">{Object.keys(diffs.routers).length} modified routers</Heading>
        <Alert>Not implemented yet</Alert>
      </Flex>
    </Flex>
  );
}

export default DiffsBox;
