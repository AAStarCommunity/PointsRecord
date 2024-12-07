#!/bin/bash

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '#' | sed 's/\r$//' | awk '/=/ {print $1}')
fi

# Echo the values (commented out for security, uncomment for debugging)
# echo "RPC URL: $OPTIMISM_SEPOLIA_RPC"
# echo "ETHERSCAN KEY: $ETHERSCAN_API_KEY"

# Deploy the contract
forge script script/PointsRecord.s.sol:DeployPointsRecord \
    --rpc-url "$OPTIMISM_SEPOLIA_RPC" \
    --private-key "$PRIVATE_KEY" \
    --broadcast \
    --verify \
    --etherscan-api-key "$ETHERSCAN_API_KEY" \
    --verifier-url "https://api-sepolia-optimistic.etherscan.io/api" \
    -vvvv 