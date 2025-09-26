export default [
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "owner",
              "type": "address",
              "indexed": true
          },
          {
              "internalType": "address",
              "name": "spender",
              "type": "address",
              "indexed": true
          },
          {
              "internalType": "uint256",
              "name": "value",
              "type": "uint256",
              "indexed": false
          }
      ],
      "type": "event",
      "name": "Approval",
      "anonymous": false
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "sender",
              "type": "address",
              "indexed": true
          },
          {
              "internalType": "address",
              "name": "owner",
              "type": "address",
              "indexed": true
          },
          {
              "internalType": "uint256",
              "name": "assets",
              "type": "uint256",
              "indexed": false
          },
          {
              "internalType": "uint256",
              "name": "shares",
              "type": "uint256",
              "indexed": false
          }
      ],
      "type": "event",
      "name": "Deposit",
      "anonymous": false
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "from",
              "type": "address",
              "indexed": true
          },
          {
              "internalType": "address",
              "name": "to",
              "type": "address",
              "indexed": true
          },
          {
              "internalType": "uint256",
              "name": "value",
              "type": "uint256",
              "indexed": false
          }
      ],
      "type": "event",
      "name": "Transfer",
      "anonymous": false
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "sender",
              "type": "address",
              "indexed": true
          },
          {
              "internalType": "address",
              "name": "receiver",
              "type": "address",
              "indexed": true
          },
          {
              "internalType": "address",
              "name": "owner",
              "type": "address",
              "indexed": true
          },
          {
              "internalType": "uint256",
              "name": "assets",
              "type": "uint256",
              "indexed": false
          },
          {
              "internalType": "uint256",
              "name": "shares",
              "type": "uint256",
              "indexed": false
          }
      ],
      "type": "event",
      "name": "Withdraw",
      "anonymous": false
  },
  {
      "inputs": [],
      "stateMutability": "view",
      "type": "function",
      "name": "DOMAIN_SEPARATOR",
      "outputs": [
          {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
          }
      ]
  },
  {
      "inputs": [],
      "stateMutability": "view",
      "type": "function",
      "name": "EVC",
      "outputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ]
  },
  {
      "inputs": [
          {
              "internalType": "contract IERC4626",
              "name": "id",
              "type": "address"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "acceptCap"
  },
  {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "acceptGuardian"
  },
  {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "acceptOwnership"
  },
  {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "acceptTimelock"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "owner",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "spender",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function",
      "name": "allowance",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ]
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "spender",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "approve",
      "outputs": [
          {
              "internalType": "bool",
              "name": "",
              "type": "bool"
          }
      ]
  },
  {
      "inputs": [],
      "stateMutability": "view",
      "type": "function",
      "name": "asset",
      "outputs": [
          {
              "internalType": "address",
              "name": "assetTokenAddress",
              "type": "address"
          }
      ]
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "account",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function",
      "name": "balanceOf",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ]
  },
  {
      "inputs": [
          {
              "internalType": "contract IERC4626",
              "name": "",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function",
      "name": "config",
      "outputs": [
          {
              "internalType": "struct MarketConfig",
              "name": "",
              "type": "tuple",
              "components": [
                  {
                      "internalType": "uint112",
                      "name": "balance",
                      "type": "uint112"
                  },
                  {
                      "internalType": "uint136",
                      "name": "cap",
                      "type": "uint136"
                  },
                  {
                      "internalType": "bool",
                      "name": "enabled",
                      "type": "bool"
                  },
                  {
                      "internalType": "uint64",
                      "name": "removableAt",
                      "type": "uint64"
                  }
              ]
          }
      ]
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "shares",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function",
      "name": "convertToAssets",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "assets",
              "type": "uint256"
          }
      ]
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "assets",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function",
      "name": "convertToShares",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "shares",
              "type": "uint256"
          }
      ]
  },
  {
      "inputs": [],
      "stateMutability": "view",
      "type": "function",
      "name": "creator",
      "outputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ]
  },
  {
      "inputs": [],
      "stateMutability": "view",
      "type": "function",
      "name": "curator",
      "outputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ]
  },
  {
      "inputs": [],
      "stateMutability": "view",
      "type": "function",
      "name": "decimals",
      "outputs": [
          {
              "internalType": "uint8",
              "name": "",
              "type": "uint8"
          }
      ]
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "assets",
              "type": "uint256"
          },
          {
              "internalType": "address",
              "name": "receiver",
              "type": "address"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "deposit",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "shares",
              "type": "uint256"
          }
      ]
  },
  {
      "inputs": [
          {
              "internalType": "contract IERC4626",
              "name": "id",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function",
      "name": "expectedSupplyAssets",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ]
  },
  {
      "inputs": [],
      "stateMutability": "view",
      "type": "function",
      "name": "fee",
      "outputs": [
          {
              "internalType": "uint96",
              "name": "",
              "type": "uint96"
          }
      ]
  },
  {
      "inputs": [],
      "stateMutability": "view",
      "type": "function",
      "name": "feeRecipient",
      "outputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ]
  },
  {
      "inputs": [],
      "stateMutability": "view",
      "type": "function",
      "name": "guardian",
      "outputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ]
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "target",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function",
      "name": "isAllocator",
      "outputs": [
          {
              "internalType": "bool",
              "name": "",
              "type": "bool"
          }
      ]
  },
  {
      "inputs": [],
      "stateMutability": "view",
      "type": "function",
      "name": "lastTotalAssets",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ]
  },
  {
      "inputs": [],
      "stateMutability": "view",
      "type": "function",
      "name": "lostAssets",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ]
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "receiver",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function",
      "name": "maxDeposit",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "maxAssets",
              "type": "uint256"
          }
      ]
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "receiver",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function",
      "name": "maxMint",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "maxShares",
              "type": "uint256"
          }
      ]
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "owner",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function",
      "name": "maxRedeem",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "maxShares",
              "type": "uint256"
          }
      ]
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "owner",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function",
      "name": "maxWithdraw",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "maxAssets",
              "type": "uint256"
          }
      ]
  },
  {
      "inputs": [
          {
              "internalType": "contract IERC4626",
              "name": "id",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function",
      "name": "maxWithdrawFromStrategy",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ]
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "shares",
              "type": "uint256"
          },
          {
              "internalType": "address",
              "name": "receiver",
              "type": "address"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "mint",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "assets",
              "type": "uint256"
          }
      ]
  },
  {
      "inputs": [],
      "stateMutability": "view",
      "type": "function",
      "name": "name",
      "outputs": [
          {
              "internalType": "string",
              "name": "",
              "type": "string"
          }
      ]
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "owner",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function",
      "name": "nonces",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ]
  },
  {
      "inputs": [],
      "stateMutability": "view",
      "type": "function",
      "name": "owner",
      "outputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ]
  },
  {
      "inputs": [
          {
              "internalType": "contract IERC4626",
              "name": "",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function",
      "name": "pendingCap",
      "outputs": [
          {
              "internalType": "struct PendingUint136",
              "name": "",
              "type": "tuple",
              "components": [
                  {
                      "internalType": "uint136",
                      "name": "value",
                      "type": "uint136"
                  },
                  {
                      "internalType": "uint64",
                      "name": "validAt",
                      "type": "uint64"
                  }
              ]
          }
      ]
  },
  {
      "inputs": [],
      "stateMutability": "view",
      "type": "function",
      "name": "pendingGuardian",
      "outputs": [
          {
              "internalType": "struct PendingAddress",
              "name": "",
              "type": "tuple",
              "components": [
                  {
                      "internalType": "address",
                      "name": "value",
                      "type": "address"
                  },
                  {
                      "internalType": "uint64",
                      "name": "validAt",
                      "type": "uint64"
                  }
              ]
          }
      ]
  },
  {
      "inputs": [],
      "stateMutability": "view",
      "type": "function",
      "name": "pendingOwner",
      "outputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ]
  },
  {
      "inputs": [],
      "stateMutability": "view",
      "type": "function",
      "name": "pendingTimelock",
      "outputs": [
          {
              "internalType": "struct PendingUint136",
              "name": "",
              "type": "tuple",
              "components": [
                  {
                      "internalType": "uint136",
                      "name": "value",
                      "type": "uint136"
                  },
                  {
                      "internalType": "uint64",
                      "name": "validAt",
                      "type": "uint64"
                  }
              ]
          }
      ]
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "owner",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "spender",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
          },
          {
              "internalType": "uint8",
              "name": "v",
              "type": "uint8"
          },
          {
              "internalType": "bytes32",
              "name": "r",
              "type": "bytes32"
          },
          {
              "internalType": "bytes32",
              "name": "s",
              "type": "bytes32"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "permit"
  },
  {
      "inputs": [],
      "stateMutability": "view",
      "type": "function",
      "name": "permit2Address",
      "outputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ]
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "assets",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function",
      "name": "previewDeposit",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "shares",
              "type": "uint256"
          }
      ]
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "shares",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function",
      "name": "previewMint",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "assets",
              "type": "uint256"
          }
      ]
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "shares",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function",
      "name": "previewRedeem",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "assets",
              "type": "uint256"
          }
      ]
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "assets",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function",
      "name": "previewWithdraw",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "shares",
              "type": "uint256"
          }
      ]
  },
  {
      "inputs": [
          {
              "internalType": "struct MarketAllocation[]",
              "name": "allocations",
              "type": "tuple[]",
              "components": [
                  {
                      "internalType": "contract IERC4626",
                      "name": "id",
                      "type": "address"
                  },
                  {
                      "internalType": "uint256",
                      "name": "assets",
                      "type": "uint256"
                  }
              ]
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "reallocate"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "shares",
              "type": "uint256"
          },
          {
              "internalType": "address",
              "name": "receiver",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "owner",
              "type": "address"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "redeem",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "assets",
              "type": "uint256"
          }
      ]
  },
  {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "renounceOwnership"
  },
  {
      "inputs": [
          {
              "internalType": "contract IERC4626",
              "name": "id",
              "type": "address"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "revokePendingCap"
  },
  {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "revokePendingGuardian"
  },
  {
      "inputs": [
          {
              "internalType": "contract IERC4626",
              "name": "id",
              "type": "address"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "revokePendingMarketRemoval"
  },
  {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "revokePendingTimelock"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "newCurator",
              "type": "address"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "setCurator"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "newFee",
              "type": "uint256"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "setFee"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "newFeeRecipient",
              "type": "address"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "setFeeRecipient"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "newAllocator",
              "type": "address"
          },
          {
              "internalType": "bool",
              "name": "newIsAllocator",
              "type": "bool"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "setIsAllocator"
  },
  {
      "inputs": [
          {
              "internalType": "string",
              "name": "newName",
              "type": "string"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "setName"
  },
  {
      "inputs": [
          {
              "internalType": "contract IERC4626[]",
              "name": "newSupplyQueue",
              "type": "address[]"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "setSupplyQueue"
  },
  {
      "inputs": [
          {
              "internalType": "string",
              "name": "newSymbol",
              "type": "string"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "setSymbol"
  },
  {
      "inputs": [
          {
              "internalType": "contract IERC4626",
              "name": "id",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "newSupplyCap",
              "type": "uint256"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "submitCap"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "newGuardian",
              "type": "address"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "submitGuardian"
  },
  {
      "inputs": [
          {
              "internalType": "contract IERC4626",
              "name": "id",
              "type": "address"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "submitMarketRemoval"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "newTimelock",
              "type": "uint256"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "submitTimelock"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function",
      "name": "supplyQueue",
      "outputs": [
          {
              "internalType": "contract IERC4626",
              "name": "",
              "type": "address"
          }
      ]
  },
  {
      "inputs": [],
      "stateMutability": "view",
      "type": "function",
      "name": "supplyQueueLength",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ]
  },
  {
      "inputs": [],
      "stateMutability": "view",
      "type": "function",
      "name": "symbol",
      "outputs": [
          {
              "internalType": "string",
              "name": "",
              "type": "string"
          }
      ]
  },
  {
      "inputs": [],
      "stateMutability": "view",
      "type": "function",
      "name": "timelock",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ]
  },
  {
      "inputs": [],
      "stateMutability": "view",
      "type": "function",
      "name": "totalAssets",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "totalManagedAssets",
              "type": "uint256"
          }
      ]
  },
  {
      "inputs": [],
      "stateMutability": "view",
      "type": "function",
      "name": "totalSupply",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ]
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "to",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "transfer",
      "outputs": [
          {
              "internalType": "bool",
              "name": "",
              "type": "bool"
          }
      ]
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "from",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "to",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "transferFrom",
      "outputs": [
          {
              "internalType": "bool",
              "name": "",
              "type": "bool"
          }
      ]
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "transferOwnership"
  },
  {
      "inputs": [
          {
              "internalType": "uint256[]",
              "name": "indexes",
              "type": "uint256[]"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "updateWithdrawQueue"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "assets",
              "type": "uint256"
          },
          {
              "internalType": "address",
              "name": "receiver",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "owner",
              "type": "address"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "withdraw",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "shares",
              "type": "uint256"
          }
      ]
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function",
      "name": "withdrawQueue",
      "outputs": [
          {
              "internalType": "contract IERC4626",
              "name": "",
              "type": "address"
          }
      ]
  },
  {
      "inputs": [],
      "stateMutability": "view",
      "type": "function",
      "name": "withdrawQueueLength",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ]
  }
] as const;
