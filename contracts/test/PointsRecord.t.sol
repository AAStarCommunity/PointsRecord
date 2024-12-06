// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import {PointsRecord} from "../src/PointsRecord.sol";

contract PointsRecordTest is Test {
    PointsRecord public pointsRecord;
    address public user1 = address(0x1);
    address public user2 = address(0x2);

    function setUp() public {
        pointsRecord = new PointsRecord();
    }

    function testSetNickname() public {
        vm.prank(user1);
        pointsRecord.setNickname("Alice");
        assertEq(pointsRecord.nicknames(user1), "Alice");
    }

    function testAddRecord() public {
        vm.startPrank(user1);
        
        // Set nickname first
        pointsRecord.setNickname("Alice");
        
        // Add a record
        pointsRecord.addRecord(
            "code",
            "https://github.com/test/pr/123",
            8
        );

        // Get the record and verify
        (
            uint256 timestamp,
            address contributorAddress,
            string memory nickname,
            string memory contributionType,
            string memory details,
            uint8 hours
        ) = pointsRecord.records(0);

        assertEq(contributorAddress, user1);
        assertEq(nickname, "Alice");
        assertEq(contributionType, "code");
        assertEq(details, "https://github.com/test/pr/123");
        assertEq(hours, 8);
        
        vm.stopPrank();
    }

    function testFailAddRecordWithInvalidHours() public {
        vm.prank(user1);
        pointsRecord.addRecord(
            "code",
            "test",
            11 // More than 10 hours should fail
        );
    }

    function testGetUserRecords() public {
        vm.startPrank(user1);
        
        // Add multiple records
        pointsRecord.addRecord("code", "test1", 1);
        pointsRecord.addRecord("design", "test2", 2);
        
        // Get user's record indices
        uint256[] memory indices = pointsRecord.getUserRecordIndices(user1);
        
        assertEq(indices.length, 2);
        
        vm.stopPrank();
    }
} 