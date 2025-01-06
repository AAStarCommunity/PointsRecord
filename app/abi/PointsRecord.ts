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
  }
] as const; 