#!/bin/bash
source .env

forge script script/PointsRecord.s.sol:DeployPointsRecord \
    --rpc-url $OPTIMISM_SEPOLIA_RPC \
    --private-key $PRIVATE_KEY \
    --broadcast \
    --verify \
    -vvvv 