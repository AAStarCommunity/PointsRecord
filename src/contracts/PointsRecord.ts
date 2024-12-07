export const POINTS_RECORD_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_contributionType",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_details",
        "type": "string"
      },
      {
        "internalType": "uint8",
        "name": "_hours",
        "type": "uint8"
      }
    ],
    "name": "addRecord",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_nickname",
        "type": "string"
      }
    ],
    "name": "setNickname",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const; 