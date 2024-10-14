import { Address } from "viem";
import { LTVDiff, VaultDiff } from "../lib/types";
import AddressValue from "./values/AddressValue";
import CapValue from "./values/CapValue";
import LTVValue from "./values/LTVValue";
import { Collapse, Flex, Icon, IconButton, Text, useDisclosure } from "@chakra-ui/react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6"

type Props = { address: Address, vaultDiff: VaultDiff };

function VaultDiffBox({ address, vaultDiff }: Props) {
	const { isOpen, onToggle } = useDisclosure()

	return (
		<Flex direction="column" gap={2} borderRadius="md" borderColor="gray.200" borderWidth="1px" p={2}>
			<Flex direction="row" gap={2} align="center">
				<Text fontSize="lg">
					Vault <AddressValue a={address as Address} label={vaultDiff.label} />
				</Text>
				<IconButton
					onClick={onToggle}
					size="xs"
					aria-label={"expand"}
					icon={<Icon as={isOpen ? FaChevronUp : FaChevronDown} />}
				/>
			</Flex>
			<Collapse in={isOpen} animateOpacity>

				{Object.entries(vaultDiff.newValues).map(([key, value]) => (<Flex direction="column" key={key}>
					{(() => {
						if (key === "supplyCap" || key === "borrowCap") {
							return (
								<Text>
									{key} &rarr; <CapValue cap={value as number} />
								</Text>
							);
						} else if (
							key === "interestRateModel" ||
							key === "governorAdmin" ||
							key === "feeReceiver"
						) {
							return (
								<Text>
									{key} &rarr; <AddressValue a={value as Address} />
								</Text>
							);
						} else if (key === "ltvs") {
							return (
								<Flex direction="column" gap={2}>
									{(value as LTVDiff[]).map((ltvDiff, i) => {
										return (
											<Text key={i}>
												setLTV{" "}
												<AddressValue
													a={ltvDiff.collateral}
													label={ltvDiff.collateralName}
												/>
												: borrowLTV=
												<LTVValue ltv={ltvDiff.borrowLTV} />, liquidationLTV=
												<LTVValue ltv={ltvDiff.liquidationLTV} />,
												rampDuration={ltvDiff.rampDuration}
											</Text>
										);
									})}
								</Flex>
							);
						}
						return (
							<div>
								{key} &rarr; {value as any}
							</div>
						);
					})()}
				</Flex>
				))}
			</Collapse>
		</Flex>
	);
}

export default VaultDiffBox;
