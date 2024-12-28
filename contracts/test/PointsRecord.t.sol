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

        // 为合约提供初始余额
        vm.deal(address(pointsRecord), 10 ether);

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
        vm.expectRevert(abi.encodeWithSignature("MemberAlreadyExists()"));
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
        vm.expectRevert(abi.encodeWithSignature("NotAdmin()"));
        pointsRecord.addCommunityMember(member2);
    }

    // 测试冻结成员后提交记录应该失败
    function testCannotSubmitRecordWhenFrozen() public {
        vm.prank(admin1);
        pointsRecord.addCommunityMember(admin1);

        vm.prank(admin1);
        pointsRecord.freezeMember(admin1);

        vm.prank(admin1);
        vm.expectRevert(abi.encodeWithSignature("NotCommunityMember()"));
        pointsRecord.submitRecord("test", "details", 5);
    }

    // 测试提交记录
    function testSubmitRecord() public {
        vm.prank(admin1);
        pointsRecord.addCommunityMember(admin1);

        vm.prank(admin1);
        uint256 recordId = pointsRecord.submitRecord("test", "details", 5);

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

        assertEq(contributor, admin1);
        assertEq(hoursSpent, 5);
        assertEq(contributionType, "test");
        assertEq(details, "details");
    }

    // 测试提交无效记录（小时数）
    function testCannotSubmitInvalidRecord() public {
        vm.prank(admin1);
        pointsRecord.addCommunityMember(admin1);

        vm.prank(admin1);
        vm.expectRevert(abi.encodeWithSignature("InvalidRecord()"));
        pointsRecord.submitRecord("test", "details", 0);
    }

    // 测试挑战记录
    function testChallengeRecord() public {
        vm.prank(admin1);
        pointsRecord.addCommunityMember(admin1);

        vm.prank(admin1);
        uint256 recordId = pointsRecord.submitRecord("test", "details", 5);

        address challenger = makeAddr("challenger");

        // 模拟挑战
        vm.deal(challenger, 1 ether);
        vm.prank(challenger);
        pointsRecord.challengeRecord{value: 0.1 ether}(recordId);

        // 检查挑战是否成功记录
        (
            address challengerAddr,
            uint256 challengeTime,
            bool resolved,
            bool successful
        ) = pointsRecord.getChallengeDetails(recordId, 0);

        assertEq(challengerAddr, challenger);
        assertFalse(resolved);
        assertFalse(successful);
    }

    // 测试保证金不足
    function testInsufficientChallengeBond() public {
        vm.prank(admin1);
        pointsRecord.addCommunityMember(admin1);

        vm.prank(admin1);
        uint256 recordId = pointsRecord.submitRecord("test", "details", 5);

        address challenger = makeAddr("challenger");

        // 模拟保证金不足的挑战
        vm.deal(challenger, 1 ether);
        vm.prank(challenger);
        vm.expectRevert(abi.encodeWithSignature("InsufficientBond()"));
        pointsRecord.challengeRecord{value: 0.05 ether}(recordId);
    }

    // 测试记录最终确认
    function testFinalizeRecord() public {
        vm.prank(admin1);
        pointsRecord.addCommunityMember(admin1);

        vm.prank(admin1);
        uint256 recordId = pointsRecord.submitRecord("test", "details", 5);

        // 快进时间超过挑战期
        vm.warp(block.timestamp + 8 days);

        vm.prank(admin1);
        pointsRecord.finalizeRecord(recordId);

        // 检查记录是否已最终确认
        (, , , , , bool isFinalized, ) = pointsRecord.records(recordId);
        assertTrue(isFinalized);
    }

    // 测试在挑战期内不能最终确认
    function testCannotFinalizeRecordDuringChallengePeriod() public {
        vm.prank(admin1);
        pointsRecord.addCommunityMember(admin1);

        vm.prank(admin1);
        uint256 recordId = pointsRecord.submitRecord("test", "details", 5);

        // 尝试在挑战期内最终确认
        vm.prank(admin1);
        vm.expectRevert(abi.encodeWithSignature("ChallengePeriodNotExpired()"));
        pointsRecord.finalizeRecord(recordId);
    }
    // 测试解决挑战
    function testResolveChallenge() public {
        vm.prank(admin1);
        pointsRecord.addCommunityMember(admin1);

        vm.prank(admin1);
        uint256 recordId = pointsRecord.submitRecord("test", "details", 5);

        address challenger = makeAddr("challenger");

        // 模拟挑战
        vm.deal(challenger, 1 ether);
        vm.prank(challenger);
        pointsRecord.challengeRecord{value: 0.1 ether}(recordId);

        // 快进时间超过挑战期
        vm.warp(block.timestamp + 8 days);

        // 解决挑战（成功）
        vm.prank(admin1);
        pointsRecord.resolveChallenge(recordId, 0, true);

        // 检查记录是否未被最终确认
        (, , , , , bool isFinalized, ) = pointsRecord.records(recordId);
        assertFalse(isFinalized);

        // 检查挑战是否已解决
        (
            address challengerAddr,
            uint256 challengeTime,
            bool resolved,
            bool successful
        ) = pointsRecord.getChallengeDetails(recordId, 0);

        assertTrue(resolved);
        assertEq(challengerAddr, challenger);
        assertTrue(successful);
    }

    // 测试存在成功的挑战时不能最终确认
    function testCannotFinalizeRecordWithActiveChallenges() public {
        vm.prank(admin1);
        pointsRecord.addCommunityMember(admin1);

        vm.prank(admin1);
        uint256 recordId = pointsRecord.submitRecord("test", "details", 5);

        address challenger = makeAddr("challenger");

        // 模拟挑战
        vm.deal(challenger, 1 ether);
        vm.prank(challenger);
        pointsRecord.challengeRecord{value: 0.1 ether}(recordId);

        // 快进时间超过挑战期
        vm.warp(block.timestamp + 8 days);

        // 解决挑战（成功）
        vm.prank(admin1);
        pointsRecord.resolveChallenge(recordId, 0, true);

        // 尝试最终确认
        vm.prank(admin1);
        vm.expectRevert("Successful challenge exists");
        pointsRecord.finalizeRecord(recordId);
    }
}
