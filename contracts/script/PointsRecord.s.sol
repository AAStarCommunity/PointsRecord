// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {PointsRecord} from "../src/PointsRecord.sol";

contract DeployPointsRecord is Script {
    function run() external returns (PointsRecord) {
        vm.startBroadcast();
        PointsRecord pointsRecord = new PointsRecord();
        vm.stopBroadcast();
        return pointsRecord;
    }
} 