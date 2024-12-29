// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/PointsRecord.sol";

contract CommunityPointsRecordTest is Test {
    CommunityPointsRecord public workRecord;
    address public owner;
    address public admin2;
    address public member1;
    address public member2;

    function setUp() public {
        // 部署合约
        workRecord = new CommunityPointsRecord();

        // 获取部署者地址
        owner = address(this);

        // 创建测试地址
        admin2 = makeAddr("admin2");
        member1 = makeAddr("member1");
        member2 = makeAddr("member2");
    }

    // 测试添加管理员
    function testAddAdmin() public {
        workRecord.addAdmin(admin2);
        assertTrue(workRecord.admins(admin2), "Admin should be added");
    }

    // 测试添加社区成员
    function testAddCommunityMember() public {
        workRecord.addCommunityMember(member1);

        (bool isActive, bool isFrozen, uint256 totalHours) = workRecord
            .communityMembers(member1);

        assertTrue(isActive, "Member should be active");
        assertFalse(isFrozen, "Member should not be frozen");
        assertEq(totalHours, 0, "Initial hours should be zero");
    }

    // 测试重复添加社区成员应该失败
    function testCannotAddExistingMember() public {
        workRecord.addCommunityMember(member1);

        vm.expectRevert("Member already exists");
        workRecord.addCommunityMember(member1);
    }

    // 测试冻结社区成员
    function testFreezeMember() public {
        workRecord.addCommunityMember(member1);
        workRecord.freezeMember(member1);

        (, bool isFrozen, ) = workRecord.communityMembers(member1);

        assertTrue(isFrozen, "Member should be frozen");
    }

    // 测试提交工作记录
    function testSubmitWorkRecord() public {
        // 添加社区成员
        workRecord.addCommunityMember(member1);

        // 切换到member1
        vm.startPrank(member1);

        // 提交工作记录
        uint256 recordId = workRecord.submitWorkRecord(
            5, // 工时
            CommunityPointsRecord.WorkType.Code, // 工作类型
            "proof" // 证明
        );

        vm.stopPrank();

        // 检查记录详情
        (
            address contributor,
            uint8 hoursSpent,
            CommunityPointsRecord.WorkType workType,
            string memory proof,
            ,
            ,
            bool isFinalized,
            bool isChallenged
        ) = workRecord.workRecords(recordId);

        assertEq(contributor, member1, "Contributor should match");
        assertEq(hoursSpent, 5, "Hours should match");
        assertEq(
            uint8(workType),
            uint8(CommunityPointsRecord.WorkType.Code),
            "Work type should match"
        );
        assertEq(proof, "proof", "Proof should match");
        assertFalse(isFinalized, "Record should not be finalized");
        assertFalse(isChallenged, "Record should not be challenged");
    }

    // 测试无效工时提交应该失败
    function testCannotSubmitInvalidHours() public {
        workRecord.addCommunityMember(member1);

        vm.startPrank(member1);

        // 尝试提交0小时工作记录
        vm.expectRevert(
            abi.encodeWithSelector(
                CommunityPointsRecord.InvalidWorkRecord.selector
            )
        );
        workRecord.submitWorkRecord(0, CommunityPointsRecord.WorkType.Code, "");

        // 尝试提交超过10小时的工作记录
        vm.expectRevert(
            abi.encodeWithSelector(
                CommunityPointsRecord.InvalidWorkRecord.selector
            )
        );
        workRecord.submitWorkRecord(11, CommunityPointsRecord.WorkType.Code, "");

        vm.stopPrank();
    }

    // 测试挑战工作记录
    function testChallengeWorkRecord() public {
        // 准备测试数据
        workRecord.addCommunityMember(member1);
        workRecord.addCommunityMember(member2);

        // member1提交工作记录
        vm.startPrank(member1);
        uint256 recordId = workRecord.submitWorkRecord(
            5,
            CommunityPointsRecord.WorkType.Code,
            "proof"
        );
        vm.stopPrank();

        // member2挑战工作记录
        vm.startPrank(member2);
        workRecord.challengeWorkRecord(recordId);
        vm.stopPrank();

        // 检查记录是否已被挑战
        (, , , , , , , bool isChallenged) = workRecord.workRecords(recordId);
        assertTrue(isChallenged, "Record should be challenged");
    }

    // 测试解决挑战
    function testResolveChallenge() public {
        // 准备测试数据
        workRecord.addCommunityMember(member1);
        workRecord.addCommunityMember(member2);

        // member1提交工作记录
        vm.startPrank(member1);
        uint256 recordId = workRecord.submitWorkRecord(
            5,
            CommunityPointsRecord.WorkType.Code,
            "proof"
        );
        vm.stopPrank();

        // member2挑战工作记录
        vm.startPrank(member2);
        workRecord.challengeWorkRecord(recordId);
        vm.stopPrank();

        // 管理员解决挑战（接受挑战）
        workRecord.resolveChallenge(recordId, true);

        // 检查记录是否已被清除
        (, uint8 hoursSpent, , , , , , ) = workRecord.workRecords(recordId);
        assertEq(hoursSpent, 0, "Hours should be cleared");

        // 管理员解决挑战（拒绝挑战）
        vm.startPrank(member1);
        uint256 newRecordId = workRecord.submitWorkRecord(
            7,
            CommunityPointsRecord.WorkType.Community,
            "proof"
        );
        vm.stopPrank();

        // member2再次挑战
        vm.startPrank(member2);
        workRecord.challengeWorkRecord(newRecordId);
        vm.stopPrank();

        // 管理员解决挑战（拒绝挑战）
        workRecord.resolveChallenge(newRecordId, false);

        // 检查member1的总工时
        uint256 totalHours = workRecord.getMemberTotalHours(member1);
        assertEq(totalHours, 7, "Total hours should be added");
    }

    // 测试重复挑战应该失败
    function testCannotChallengeAlreadyChallengedRecord() public {
        workRecord.addCommunityMember(member1);
        workRecord.addCommunityMember(member2);

        vm.startPrank(member1);
        uint256 recordId = workRecord.submitWorkRecord(
            5,
            CommunityPointsRecord.WorkType.Code,
            "proof"
        );
        vm.stopPrank();

        vm.startPrank(member2);
        workRecord.challengeWorkRecord(recordId);

        vm.expectRevert(
            abi.encodeWithSelector(
                CommunityPointsRecord.AlreadyChallenged.selector
            )
        );
        workRecord.challengeWorkRecord(recordId);

        vm.stopPrank();
    }

    // 测试获取未完成的工作记录
    function testGetPendingRecords() public {
        // 添加管理员和成员
        workRecord.addCommunityMember(member1);

        // 切换到 member1 并提交工作记录
        vm.prank(member1);
        uint256 recordId1 = workRecord.submitWorkRecord(
            5,
            CommunityPointsRecord.WorkType.Document,
            "Proof 1"
        );

        vm.prank(member1);
        uint256 recordId2 = workRecord.submitWorkRecord(
            3,
            CommunityPointsRecord.WorkType.Community,
            "Proof 2"
        );

        vm.prank(member1);
        uint256 recordId3 = workRecord.submitWorkRecord(
            7,
            CommunityPointsRecord.WorkType.Code,
            "Proof 3"
        );

        // 挑战和解决记录
        vm.prank(member1);
        workRecord.challengeWorkRecord(recordId2);

        workRecord.resolveChallenge(recordId2, false);

        // 获取未完成的记录
        uint256[] memory pendingRecords = workRecord.getPendingRecords();

        // 验证结果
        assertEq(pendingRecords.length, 2, "Should have 2 pending records");
        assertEq(
            pendingRecords[0],
            recordId1,
            "First pending record should match"
        );
        assertEq(
            pendingRecords[1],
            recordId3,
            "Second pending record should match"
        );
    }

    // 测试没有未完成记录的情况
    function testGetPendingRecordsEmpty() public {
        // 添加管理员和成员
        workRecord.addCommunityMember(member1);

        // 提交工作记录
        vm.prank(member1);
        uint256 recordId = workRecord.submitWorkRecord(
            5,
            CommunityPointsRecord.WorkType.Document,
            "Proof 1"
        );

        // 挑战和解决记录
        vm.prank(member1);
        workRecord.challengeWorkRecord(recordId);

        workRecord.resolveChallenge(recordId, false);

        // 获取未完成的记录
        uint256[] memory pendingRecords = workRecord.getPendingRecords();

        // 验证结果
        assertEq(pendingRecords.length, 0, "Should have no pending records");
    }

    // 测试自动 finalize 记录
    function testFinalizeRecord() public {
        // 添加管理员和成员
        workRecord.addCommunityMember(member1);

        // 切换到 member1 并提交工作记录
        vm.prank(member1);
        uint256 recordId = workRecord.submitWorkRecord(
            5,
            CommunityPointsRecord.WorkType.Document,
            "Proof 1"
        );

        // 获取初始总工时
        uint256 initialTotalHours = workRecord.getMemberTotalHours(member1);

        // 模拟时间过去 15 天
        vm.warp(block.timestamp + 15 days);

        // finalize 记录
        workRecord.finalizeRecord(recordId);

        // 检查记录状态
        (
            ,
            uint8 hoursSpent,
            ,
            ,
            ,
            ,
            bool isFinalized,
            bool isChallenged
        ) = workRecord.workRecords(recordId);

        // 验证结果
        assertTrue(isFinalized, "Record should be finalized");
        assertFalse(isChallenged, "Record should not be challenged");

        // 验证工时累加
        uint256 finalTotalHours = workRecord.getMemberTotalHours(member1);
        assertEq(
            finalTotalHours,
            initialTotalHours + hoursSpent,
            "Total hours should be updated"
        );
    }

    // 测试在挑战期内无法 finalize
    function testCannotFinalizeRecordDuringChallengePeriod() public {
        // 添加管理员和成员
        workRecord.addCommunityMember(member1);

        // 切换到 member1 并提交工作记录
        vm.prank(member1);
        uint256 recordId = workRecord.submitWorkRecord(
            5,
            CommunityPointsRecord.WorkType.Document,
            "Proof 1"
        );

        // 尝试在挑战期内 finalize（应该失败）
        vm.expectRevert("Challenge period not over");
        workRecord.finalizeRecord(recordId);
    }

    // 测试已被挑战的记录无法 finalize
    function testCannotFinalizeChallendgedRecord() public {
        // 添加管理员和成员
        workRecord.addCommunityMember(member1);

        // 切换到 member1 并提交工作记录
        vm.prank(member1);
        uint256 recordId = workRecord.submitWorkRecord(
            5,
            CommunityPointsRecord.WorkType.Document,
            "Proof 1"
        );

        // 模拟挑战记录
        vm.prank(member1);
        workRecord.challengeWorkRecord(recordId);

        // 模拟时间过去 15 天
        vm.warp(block.timestamp + 15 days);

        // 尝试 finalize 被挑战的记录（应该失败）
        vm.expectRevert("Record is challenged");
        workRecord.finalizeRecord(recordId);
    }

    // 测试已 finalize 的记录无法再次 finalize
    function testCannotFinalizeTwice() public {
        // 添加管理员和成员
        workRecord.addCommunityMember(member1);

        // 切换到 member1 并提交工作记录
        vm.prank(member1);
        uint256 recordId = workRecord.submitWorkRecord(
            5,
            CommunityPointsRecord.WorkType.Document,
            "Proof 1"
        );

        // 模拟时间过去 15 天
        vm.warp(block.timestamp + 15 days);

        // 第一次 finalize
        workRecord.finalizeRecord(recordId);

        // 尝试第二次 finalize（应该失败）
        vm.expectRevert("Record already finalized");
        workRecord.finalizeRecord(recordId);
    }
}
