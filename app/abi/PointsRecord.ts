export const POINTS_RECORD_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "AdminAlreadyExists",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "AlreadyChallenged",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "CannotChallengeSelfRecord",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ChallengePeriodNotExpired",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidAddress",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidWorkRecord",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NotActiveMember",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NotAdmin",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NotOwner",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "admin",
                "type": "address"
            }
        ],
        "name": "AdminAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "member",
                "type": "address"
            }
        ],
        "name": "MemberAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "member",
                "type": "address"
            }
        ],
        "name": "MemberFrozen",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "recordId",
                "type": "uint256"
            }
        ],
        "name": "WorkRecordAutoFinalized",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "recordId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "challenger",
                "type": "address"
            }
        ],
        "name": "WorkRecordChallenged",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "recordId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "successful",
                "type": "bool"
            }
        ],
        "name": "WorkRecordResolved",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "recordId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "contributor",
                "type": "address"
            }
        ],
        "name": "WorkRecordSubmitted",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "CHALLENGE_PERIOD",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_admin",
                "type": "address"
            }
        ],
        "name": "addAdmin",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_member",
                "type": "address"
            }
        ],
        "name": "addCommunityMember",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "admins",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_recordId",
                "type": "uint256"
            }
        ],
        "name": "challengeWorkRecord",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "communityMembers",
        "outputs": [
            {
                "internalType": "bool",
                "name": "exists",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "isFrozen",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "totalHoursValidated",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "communityMembersCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_recordId",
                "type": "uint256"
            }
        ],
        "name": "finalizeRecord",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_member",
                "type": "address"
            }
        ],
        "name": "freezeMember",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_member",
                "type": "address"
            }
        ],
        "name": "getMemberTotalHours",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getPendingRecords",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_recordId",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "_challengeAccepted",
                "type": "bool"
            }
        ],
        "name": "resolveChallenge",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint8",
                "name": "_hoursSpent",
                "type": "uint8"
            },
            {
                "internalType": "enum CommunityPointsRecord.WorkType",
                "name": "_workType",
                "type": "uint8"
            },
            {
                "internalType": "string",
                "name": "_proof",
                "type": "string"
            }
        ],
        "name": "submitWorkRecord",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "workRecords",
        "outputs": [
            {
                "internalType": "address",
                "name": "contributor",
                "type": "address"
            },
            {
                "internalType": "uint8",
                "name": "hoursSpent",
                "type": "uint8"
            },
            {
                "internalType": "enum CommunityPointsRecord.WorkType",
                "name": "workType",
                "type": "uint8"
            },
            {
                "internalType": "string",
                "name": "proof",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "submissionTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "challengePeriod",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isFinalized",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "isChallenged",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
] as const; 