// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/PointsRecord.sol";

contract PointsRecordTest is Test {
    OptimisticPointsRecord public pointsRecord;
    address public owner;
    address public admin1;
    address public member1;
    address public member2;

    function setUp() public {
        // 部署合约
        pointsRecord = new OptimisticPointsRecord();
        
        // 创建测试账户
        owner = address(this);
        admin1 = makeAddr("admin1");
        member1 = makeAddr("member1");
        member2 = makeAddr("member2");

        // 添加管理员
        pointsRecord.addAdmin(admin1);
    }

    // 测试合约部署
    function testDeployment() public {
        assertTrue(pointsRecord.owner() == owner);
        assertTrue(pointsRecord.admins(owner));
    }

    // 测试添加社区成员
    function testAddCommunityMember() public {
        vm.prank(admin1);
        pointsRecord.addCommunityMember(member1);

        assertTrue(pointsRecord.isCommunityMember(member1));
    }

    // 测试重复添加社区成员应该失败
    function testCannotAddExistingMember() public {
        vm.prank(admin1);
        pointsRecord.addCommunityMember(member1);

        vm.prank(admin1);
        vm.expectRevert("Member already exists");
        pointsRecord.addCommunityMember(member1);
    }

    // 测试冻结社区成员
    function testFreezeMember() public {
        vm.prank(admin1);
        pointsRecord.addCommunityMember(member1);

        vm.prank(admin1);
        pointsRecord.freezeMember(member1);

        assertFalse(pointsRecord.isCommunityMember(member1));
    }

    // 测试解冻社区成员
    function testUnfreezeMember() public {
        vm.prank(admin1);
        pointsRecord.addCommunityMember(member1);

        vm.prank(admin1);
        pointsRecord.freezeMember(member1);

        vm.prank(admin1);
        pointsRecord.unfreezeMember(member1);

        assertTrue(pointsRecord.isCommunityMember(member1));
    }

    // 测试非管理员不能添加成员
    function testCannotAddMemberByNonAdmin() public {
        vm.prank(member1);
        vm.expectRevert("Only owner can add admins");
        pointsRecord.addCommunityMember(member2);
    }

    // 测试冻结成员后提交记录应该失败
    function testCannotSubmitRecordWhenFrozen() public {
        vm.prank(admin1);
        pointsRecord.addCommunityMember(member1);

        vm.prank(admin1);
        pointsRecord.freezeMember(member1);

        vm.prank(member1);
        vm.expectRevert("Not a community member");
        pointsRecord.submitRecord("测试", "详情", 5);
    }

    // 测试提交记录
    function testSubmitRecord() public {
        vm.prank(admin1);
        pointsRecord.addCommunityMember(member1);

        vm.prank(member1);
        uint256 recordId = pointsRecord.submitRecord("测试", "详情", 5);

        assertEq(pointsRecord.getRecordCount(), 1);
        
        (
            address contributor,
            uint256 timestamp,
            uint8 hoursSpent,
            string memory contributionType,
            string memory details,
            bool isFinalized,
            uint256 challengePeriod
        ) = pointsRecord.records(recordId);

        assertEq(contributor, member1);
        assertEq(hoursSpent, 5);
        assertEq(contributionType, "测试");
        assertEq(details, "详情");
    }

    // 测试提交无效记录（小时数）
    function testCannotSubmitInvalidRecord() public {
        vm.prank(admin1);
        pointsRecord.addCommunityMember(member1);

        vm.prank(member1);
        vm.expectRevert("Invalid record");
        pointsRecord.submitRecord("测试", "详情", 0);
    }
}