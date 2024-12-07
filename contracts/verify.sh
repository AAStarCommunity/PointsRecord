#!/bin/bash

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '#' | sed 's/\r$//' | awk '/=/ {print $1}')
fi

# Replace CONTRACT_ADDRESS with your deployed contract address
CONTRACT_ADDRESS="0xf7833c6e5160ab6468E6CDa4672f638B4a59Cc53"

forge verify-contract \
    --chain-id 11155420 \
    --num-of-optimizations 200 \
    --compiler-version v0.8.19 \
    --constructor-args $(cast abi-encode "constructor()") \
    $CONTRACT_ADDRESS \
    src/PointsRecord.sol:PointsRecord \
    --etherscan-api-key "$ETHERSCAN_API_KEY" \
    --verifier-url "https://api-sepolia-optimistic.etherscan.io/api" 