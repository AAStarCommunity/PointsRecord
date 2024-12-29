// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/PointsRecord.sol";

contract CommunityWorkRecordTest is Test {
    CommunityWorkRecord public workRecord;
    address public owner;
    address public admin2;
    address public member1;
    address public member2;

    function setUp() public {
        // 部署合约
        workRecord = new CommunityWorkRecord();
        
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
        
        (bool isActive, bool isFrozen, uint256 totalHours) = workRecord.communityMembers(member1);
        
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
        
        (bool isActive, bool isFrozen, ) = workRecord.communityMembers(member1);
        
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
            5,  // 工时
            CommunityWorkRecord.WorkType.Code,  // 工作类型
            "proof"  // 证明
        );
        
        vm.stopPrank();
        
        // 检查记录详情
        (
            address contributor, 
            uint8 hoursSpent, 
            CommunityWorkRecord.WorkType workType,
            string memory proof,
            uint256 submissionTime,
            uint256 challengePeriod,
            bool isFinalized,
            bool isChallenged
        ) = workRecord.workRecords(recordId);
        
        assertEq(contributor, member1, "Contributor should match");
        assertEq(hoursSpent, 5, "Hours should match");
        assertEq(uint8(workType), uint8(CommunityWorkRecord.WorkType.Code), "Work type should match");
        assertEq(proof, "proof", "Proof should match");
        assertFalse(isFinalized, "Record should not be finalized");
        assertFalse(isChallenged, "Record should not be challenged");
    }

    // 测试无效工时提交应该失败
    function testCannotSubmitInvalidHours() public {
        workRecord.addCommunityMember(member1);
        
        vm.startPrank(member1);
        
        // 尝试提交0小时工作记录
        vm.expectRevert(abi.encodeWithSelector(CommunityWorkRecord.InvalidWorkRecord.selector));
        workRecord.submitWorkRecord(0, CommunityWorkRecord.WorkType.Code, "");
        
        // 尝试提交超过10小时的工作记录
        vm.expectRevert(abi.encodeWithSelector(CommunityWorkRecord.InvalidWorkRecord.selector));
        workRecord.submitWorkRecord(11, CommunityWorkRecord.WorkType.Code, "");
        
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
            CommunityWorkRecord.WorkType.Code, 
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
            CommunityWorkRecord.WorkType.Code, 
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
            CommunityWorkRecord.WorkType.Community, 
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
            CommunityWorkRecord.WorkType.Code, 
            "proof"
        );
        vm.stopPrank();
        
        vm.startPrank(member2);
        workRecord.challengeWorkRecord(recordId);
        
        vm.expectRevert(abi.encodeWithSelector(CommunityWorkRecord.AlreadyChallenged.selector));
        workRecord.challengeWorkRecord(recordId);
        
        vm.stopPrank();
    }
}