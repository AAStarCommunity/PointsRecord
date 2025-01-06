export const POINTS_RECORD_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "points",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "recordType",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      }
    ],
    "name": "submitWorkRecord",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPendingRecords",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "contributor",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "hoursSpent",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "submissionTime",
            "type": "uint256"
          }
        ],
        "internalType": "struct PointsRecord.WorkRecord[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const; 