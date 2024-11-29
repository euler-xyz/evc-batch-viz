import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { Address, maxUint256 } from "viem";
import AddressValue from "./values/AddressValue";
import { DecodedEVCCall } from "../lib/types";
import { useAddressMetadata } from "../context/AddressContext";

type Props = {
  i: number;
  item: DecodedEVCCall;
};

function ItemActionBox({ i, item }: Props) {
  const { metadata } = useAddressMetadata();
  const { functionName, args } = item.decoded;

  function getContent() {
    const target = <AddressValue a={item.targetContract} />;
    if (functionName === "setLTV") {
      return (
        <Text>
          Set {target} LTVs to ({args[1] / 100}%, {args[2] / 100}%) for
          collateral <AddressValue a={args[0]} />
        </Text>
      );
    }
    if (functionName === "setInterestRateModel") {
      return (
        <Text>
          Set {target} IRM to <AddressValue a={args[0]} />
        </Text>
      );
    }
    if (functionName === "govSetConfig") {
      return (
        <Text>
          Configure {target} to use <AddressValue a={args[2]} /> for{" "}
          <AddressValue a={args[0]} />/
          <AddressValue a={args[1]} />
        </Text>
      );
    }
    if (functionName === "govSetResolvedVault") {
      return (
        <Text>
          Configure {target} to {!args[1] && "not"} resolve{" "}
          <AddressValue a={args[0]} /> as a vault
        </Text>
      );
    }
    if (functionName === "govSetFallbackOracle") {
      return (
        <Text>
          Set {target} fallback oracle to <AddressValue a={args[0]} />
        </Text>
      );
    }
    if (functionName === "transferGovernance") {
      return (
        <Text>
          Transfer {target} governance to <AddressValue a={args[0]} />
        </Text>
      );
    }
    if (functionName === "setMaxLiquidationDiscount") {
      return (
        <Text>
          Set {target} max liquidation discount to {args[0] / 100}%
        </Text>
      );
    }
    if (functionName === "setInterestFee") {
      return (
        <Text>
          Set {target} interest fee to {args[0] / 100}%
        </Text>
      );
    }
    if (functionName === "setFeeReceiver") {
      return (
        <Text>
          Set {target} fee receiver to <AddressValue a={args[0]} />
        </Text>
      );
    }
    if (functionName === "setGovernorAdmin") {
      return (
        <Text>
          Set {target} governor admin to <AddressValue a={args[0]} />
        </Text>
      );
    }
    if (functionName === "setLiquidationCoolOffTime") {
      return (
        <Text>
          Set {target} liquidation cool off time to {args[0]} blocks.
        </Text>
      );
    }
    if (functionName === "setCaps") {
      function displayCap(cap: number): string {
        if (cap === 0) return "unlimited";
        const exponent = BigInt(cap & 63);
        const scalar = BigInt(cap >> 6);
        return ((10n ** exponent * scalar) / 100n).toString();
      }
      return (
        <Text>
          Set {target} supply cap to {displayCap(args[0])} and borrow cap to{" "}
          {displayCap(args[1])}
        </Text>
      );
    }
    if (functionName === "setHookConfig") {
      return (
        <Text>
          Set {target} hook target to <AddressValue a={args[0]} />
        </Text>
      );
    }
    if (functionName === "setConfigFlags") {
      return <Text>Set {target} config flags</Text>;
    }
    if (functionName === "perspectiveVerify") {
      return (
        <Text>
          Verify {target} against perspective <AddressValue a={args[0]} />
        </Text>
      );
    }
    if (functionName === "convertFees") {
      return <Text>Collect fees on {target}</Text>;
    }
    if (
      functionName === "permit" &&
      item.targetContract === "0x000000000022D473030F116dDEE9F6B43aC78BA3"
    ) {
      const owner = args[0] as Address;
      const spender = args[1].spender as Address;
      const token = args[1].details.token as Address;
      const amount = args[1].details.amount as bigint;
      return (
        <Text>
          Approve <AddressValue a={spender} /> to spend {amount.toString()}{" "}
          <AddressValue a={token} /> on behalf of <AddressValue a={owner} />
        </Text>
      );
    }

    if (functionName === "updatePriceFeeds") {
      return <Text>Update Pyth price feeds</Text>;
    }

    if (functionName === "enableCollateral") {
      return (
        <Text>
          Enable <AddressValue a={args[1]} /> as collateral for{" "}
          <AddressValue a={args[0]} /> on {target}
        </Text>
      );
    }

    if (functionName === "disableCollateral") {
      return (
        <Text>
          Disable <AddressValue a={args[1]} /> as collateral for{" "}
          <AddressValue a={args[0]} /> on {target}
        </Text>
      );
    }

    if (functionName === "enableController") {
      return (
        <Text>
          Enable <AddressValue a={args[1]} /> as controller for{" "}
          <AddressValue a={args[0]} /> on {target}
        </Text>
      );
    }

    if (
      functionName === "disableController" &&
      item.targetContract !== "0x0C9a3dd6b8F28529d72d7f9cE918D493519EE383"
    ) {
      return <Text>Disable {target} as controller</Text>;
    }

    if (
      functionName === "deposit" &&
      item.targetContract !== "0xbF893F7062FCcEB83d295e7FB407a64F941d5204"
    ) {
      const amount = args[0] === maxUint256 ? "all" : args[0].toString();
      return (
        <Text>
          Deposit {amount}{" "}
          {metadata[item.targetContract]?.asset ? (
            <AddressValue a={metadata[item.targetContract].asset} />
          ) : (
            ""
          )}{" "}
          for <AddressValue a={args[1]} /> into {target}
        </Text>
      );
    }

    // if (functionName === "borrow") {
    //   const amount = args[0] === maxUint256 ? "all" : args[0].toString();
    //   return (
    //     <Text>
    //       Borrow {amount} {metadata[args[1]]?.asset ?? ""}{" "}
    //       <AddressValue a={args[1]}  /> from{" "}
    //       {target}
    //     </Text>
    //   );
    // }

    // if (functionName === "withdraw") {
    //   const amount = args[0] === maxUint256 ? "all" : args[0].toString();
    //   return (
    //     <Text>
    //       Withdraw {amount} {metadata[item.targetContract]?.asset ?? ""}{" "}
    //       <AddressValue a={args[1]}  /> from{" "}
    //       {target}
    //     </Text>
    //   );
    // }
  }

  const content = getContent();

  return (
    <Flex
      direction="row"
      align="center"
      gap={2}
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="md"
      px={1}
    >
      <Box as="span" color="gray.500">
        #{i}
      </Box>{" "}
      {content ?? "Unknown action"}
    </Flex>
  );
}

export default ItemActionBox;
