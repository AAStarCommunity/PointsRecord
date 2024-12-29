export const POINTS_RECORD_ABI = [
  {
      "type": "function",
      "name": "IS_TEST",
      "inputs": [],
      "outputs": [
          {
              "name": "",
              "type": "bool",
              "internalType": "bool"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "admin2",
      "inputs": [],
      "outputs": [
          {
              "name": "",
              "type": "address",
              "internalType": "address"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "excludeArtifacts",
      "inputs": [],
      "outputs": [
          {
              "name": "excludedArtifacts_",
              "type": "string[]",
              "internalType": "string[]"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "excludeContracts",
      "inputs": [],
      "outputs": [
          {
              "name": "excludedContracts_",
              "type": "address[]",
              "internalType": "address[]"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "excludeSelectors",
      "inputs": [],
      "outputs": [
          {
              "name": "excludedSelectors_",
              "type": "tuple[]",
              "internalType": "struct StdInvariant.FuzzSelector[]",
              "components": [
                  {
                      "name": "addr",
                      "type": "address",
                      "internalType": "address"
                  },
                  {
                      "name": "selectors",
                      "type": "bytes4[]",
                      "internalType": "bytes4[]"
                  }
              ]
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "excludeSenders",
      "inputs": [],
      "outputs": [
          {
              "name": "excludedSenders_",
              "type": "address[]",
              "internalType": "address[]"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "failed",
      "inputs": [],
      "outputs": [
          {
              "name": "",
              "type": "bool",
              "internalType": "bool"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "member1",
      "inputs": [],
      "outputs": [
          {
              "name": "",
              "type": "address",
              "internalType": "address"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "member2",
      "inputs": [],
      "outputs": [
          {
              "name": "",
              "type": "address",
              "internalType": "address"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "owner",
      "inputs": [],
      "outputs": [
          {
              "name": "",
              "type": "address",
              "internalType": "address"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "setUp",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "targetArtifactSelectors",
      "inputs": [],
      "outputs": [
          {
              "name": "targetedArtifactSelectors_",
              "type": "tuple[]",
              "internalType": "struct StdInvariant.FuzzArtifactSelector[]",
              "components": [
                  {
                      "name": "artifact",
                      "type": "string",
                      "internalType": "string"
                  },
                  {
                      "name": "selectors",
                      "type": "bytes4[]",
                      "internalType": "bytes4[]"
                  }
              ]
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "targetArtifacts",
      "inputs": [],
      "outputs": [
          {
              "name": "targetedArtifacts_",
              "type": "string[]",
              "internalType": "string[]"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "targetContracts",
      "inputs": [],
      "outputs": [
          {
              "name": "targetedContracts_",
              "type": "address[]",
              "internalType": "address[]"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "targetInterfaces",
      "inputs": [],
      "outputs": [
          {
              "name": "targetedInterfaces_",
              "type": "tuple[]",
              "internalType": "struct StdInvariant.FuzzInterface[]",
              "components": [
                  {
                      "name": "addr",
                      "type": "address",
                      "internalType": "address"
                  },
                  {
                      "name": "artifacts",
                      "type": "string[]",
                      "internalType": "string[]"
                  }
              ]
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "targetSelectors",
      "inputs": [],
      "outputs": [
          {
              "name": "targetedSelectors_",
              "type": "tuple[]",
              "internalType": "struct StdInvariant.FuzzSelector[]",
              "components": [
                  {
                      "name": "addr",
                      "type": "address",
                      "internalType": "address"
                  },
                  {
                      "name": "selectors",
                      "type": "bytes4[]",
                      "internalType": "bytes4[]"
                  }
              ]
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "targetSenders",
      "inputs": [],
      "outputs": [
          {
              "name": "targetedSenders_",
              "type": "address[]",
              "internalType": "address[]"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "testAddAdmin",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "testAddAdminAutoAddAsMember",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "testAddCommunityMember",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "testCannotAddExistingMember",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "testCannotAddZeroAddressAdmin",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "testCannotChallengeAlreadyChallengedRecord",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "testCannotChallengeSelfRecord",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "testCannotFinalizeChallendgedRecord",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "testCannotFinalizeRecordDuringChallengePeriod",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "testCannotFinalizeTwice",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "testCannotSubmitInvalidHours",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "testChallengeWorkRecord",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "testFinalizeRecord",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "testFreezeMember",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "testGetPendingRecords",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "testGetPendingRecordsEmpty",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "testResolveChallenge",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "testSubmitWorkRecord",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "workRecord",
      "inputs": [],
      "outputs": [
          {
              "name": "",
              "type": "address",
              "internalType": "contract CommunityPointsRecord"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "event",
      "name": "log",
      "inputs": [
          {
              "name": "",
              "type": "string",
              "indexed": false,
              "internalType": "string"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "log_address",
      "inputs": [
          {
              "name": "",
              "type": "address",
              "indexed": false,
              "internalType": "address"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "log_array",
      "inputs": [
          {
              "name": "val",
              "type": "uint256[]",
              "indexed": false,
              "internalType": "uint256[]"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "log_array",
      "inputs": [
          {
              "name": "val",
              "type": "int256[]",
              "indexed": false,
              "internalType": "int256[]"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "log_array",
      "inputs": [
          {
              "name": "val",
              "type": "address[]",
              "indexed": false,
              "internalType": "address[]"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "log_bytes",
      "inputs": [
          {
              "name": "",
              "type": "bytes",
              "indexed": false,
              "internalType": "bytes"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "log_bytes32",
      "inputs": [
          {
              "name": "",
              "type": "bytes32",
              "indexed": false,
              "internalType": "bytes32"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "log_int",
      "inputs": [
          {
              "name": "",
              "type": "int256",
              "indexed": false,
              "internalType": "int256"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "log_named_address",
      "inputs": [
          {
              "name": "key",
              "type": "string",
              "indexed": false,
              "internalType": "string"
          },
          {
              "name": "val",
              "type": "address",
              "indexed": false,
              "internalType": "address"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "log_named_array",
      "inputs": [
          {
              "name": "key",
              "type": "string",
              "indexed": false,
              "internalType": "string"
          },
          {
              "name": "val",
              "type": "uint256[]",
              "indexed": false,
              "internalType": "uint256[]"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "log_named_array",
      "inputs": [
          {
              "name": "key",
              "type": "string",
              "indexed": false,
              "internalType": "string"
          },
          {
              "name": "val",
              "type": "int256[]",
              "indexed": false,
              "internalType": "int256[]"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "log_named_array",
      "inputs": [
          {
              "name": "key",
              "type": "string",
              "indexed": false,
              "internalType": "string"
          },
          {
              "name": "val",
              "type": "address[]",
              "indexed": false,
              "internalType": "address[]"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "log_named_bytes",
      "inputs": [
          {
              "name": "key",
              "type": "string",
              "indexed": false,
              "internalType": "string"
          },
          {
              "name": "val",
              "type": "bytes",
              "indexed": false,
              "internalType": "bytes"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "log_named_bytes32",
      "inputs": [
          {
              "name": "key",
              "type": "string",
              "indexed": false,
              "internalType": "string"
          },
          {
              "name": "val",
              "type": "bytes32",
              "indexed": false,
              "internalType": "bytes32"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "log_named_decimal_int",
      "inputs": [
          {
              "name": "key",
              "type": "string",
              "indexed": false,
              "internalType": "string"
          },
          {
              "name": "val",
              "type": "int256",
              "indexed": false,
              "internalType": "int256"
          },
          {
              "name": "decimals",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "log_named_decimal_uint",
      "inputs": [
          {
              "name": "key",
              "type": "string",
              "indexed": false,
              "internalType": "string"
          },
          {
              "name": "val",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          },
          {
              "name": "decimals",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "log_named_int",
      "inputs": [
          {
              "name": "key",
              "type": "string",
              "indexed": false,
              "internalType": "string"
          },
          {
              "name": "val",
              "type": "int256",
              "indexed": false,
              "internalType": "int256"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "log_named_string",
      "inputs": [
          {
              "name": "key",
              "type": "string",
              "indexed": false,
              "internalType": "string"
          },
          {
              "name": "val",
              "type": "string",
              "indexed": false,
              "internalType": "string"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "log_named_uint",
      "inputs": [
          {
              "name": "key",
              "type": "string",
              "indexed": false,
              "internalType": "string"
          },
          {
              "name": "val",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "log_string",
      "inputs": [
          {
              "name": "",
              "type": "string",
              "indexed": false,
              "internalType": "string"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "log_uint",
      "inputs": [
          {
              "name": "",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "logs",
      "inputs": [
          {
              "name": "",
              "type": "bytes",
              "indexed": false,
              "internalType": "bytes"
          }
      ],
      "anonymous": false
  }
] as const; 