import { Address } from "viem";
import { AddressMetadataMap, Diffs, VaultMetadata } from "../lib/types";
import { Flex, Heading } from "@chakra-ui/react";
import VaultDiffBox from "./VaultDiffBox";
import RouterDiffBox from "./RouterDiffBox";
import { useAddressMetadata } from "../context/AddressContext";

type Props = { diffs: Diffs };

function DiffsBox({ diffs }: Props) {
  const { metadata } = useAddressMetadata<VaultMetadata>();

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
            />
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
}

export default DiffsBox;
