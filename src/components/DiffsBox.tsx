import { Address } from "viem";
import { AddressMetadataMap, Diffs, VaultMetadata } from "../lib/types";
import { Flex, Heading } from "@chakra-ui/react";
import VaultDiffBox from "./VaultDiffBox";
import RouterDiffBox from "./RouterDiffBox";

type Props = { diffs: Diffs; metadata: AddressMetadataMap<VaultMetadata> };

function DiffsBox({ diffs, metadata }: Props) {
  return (
    <Flex direction="column" gap={4}>
      <Heading size="lg">Changes</Heading>
      <Flex direction="column" gap={2}>
        <Heading size="md">
          {Object.keys(diffs.vaults).length} modified vaults
        </Heading>
        <Flex direction="column" gap={2}>
          {Object.entries(diffs.vaults).map(([address, vaultDiff]) => (
            <VaultDiffBox
              key={address}
              address={address as Address}
              vaultDiff={vaultDiff}
              metadata={metadata}
            />
          ))}
        </Flex>
      </Flex>
      <Flex direction="column" gap={2}>
        <Heading size="md">
          {Object.keys(diffs.routers).length} modified routers
        </Heading>
        <Flex direction="column" gap={2}>
          {Object.entries(diffs.routers).map(([address, routerDiff]) => (
            <RouterDiffBox
              key={address}
              address={address as Address}
              routerDiff={routerDiff}
              metadata={metadata}
            />
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
}

export default DiffsBox;
