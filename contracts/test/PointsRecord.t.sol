// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/PointsRecord.sol";
import "forge-std/console.sol";

contract PointsRecordTest is Test {
    // 事件声明需要与合约中的事件完全匹配
    event RecordSubmitted(
        uint256 indexed recordId,
        address indexed contributor,
        uint256 points
    );
    event RecordChallenged(
        uint256 indexed recordId,
        address indexed challenger
    );
    event ChallengeSucceeded(
        uint256 indexed recordId,
        address indexed challenger,
        uint256 rewardPoints
    );
    event ChallengeFailed(
        uint256 indexed recordId,
        address indexed challenger,
        uint256 penaltyPoints
    );

    OptimisticPointsRecord public pointsRecord;
    address public owner;
    address public admin1;
    address public member1;
    address public member2;
    address public challenger;

    function setUp() public {
        // 部署合约
        pointsRecord = new OptimisticPointsRecord();

        // 创建测试账户
        owner = address(this);
        admin1 = makeAddr("admin1");
        member1 = makeAddr("member1");
        member2 = makeAddr("member2");
        challenger = makeAddr("challenger");
    }

    // 合约部署测试
    function testDeployment() public {
        assertEq(pointsRecord.owner(), owner);
        assertTrue(pointsRecord.admins(owner));

        // 检查部署者的初始积分
        uint256 ownerPoints = pointsRecord.getMemberPoints(owner);
        assertEq(ownerPoints, 100);
    }

    // 社区成员管理测试
    function testAddCommunityMember() public {
        // 添加社区成员
        pointsRecord.addCommunityMember(member1);

        // 检查成员初始积分
        uint256 memberPoints = pointsRecord.getMemberPoints(member1);
        assertEq(memberPoints, 50);
    }

    function testCannotAddExistingMember() public {
        // 首次添加成员
        pointsRecord.addCommunityMember(member1);

        // 尝试重复添加应该失败
        vm.expectRevert("Member already exists");
        pointsRecord.addCommunityMember(member1);
    }

    function testSubmitRecord() public {
        // 提交记录并期望事件
        vm.expectEmit(true, true, true, true);
        emit RecordSubmitted(0, owner, 10);

        // 提交记录
        pointsRecord.submitRecord("Contribution", "Details", 5, 10);
    }

    function testCannotSubmitRecordByNonMember() public {
        // 使用一个新的非成员地址
        vm.startPrank(member1);
        vm.expectRevert(
            abi.encodeWithSelector(
                OptimisticPointsRecord.NotCommunityMember.selector
            )
        );
        pointsRecord.submitRecord("Contribution", "Details", 5, 10);
        vm.stopPrank();
    }

    function testChallengeRecord() public {
        // 添加 challenger 为成员
        pointsRecord.addCommunityMember(challenger);

        // 提交记录
        uint256 recordId = pointsRecord.submitRecord(
            "Contribution",
            "Details",
            5,
            10
        );

        // 期望挑战事件
        vm.expectEmit(true, true, true, true);
        emit RecordChallenged(recordId, challenger);

        // 模拟挑战
        vm.prank(challenger);
        pointsRecord.challengeRecord(recordId);
    }
    function testCannotChallengeWithInsufficientPoints() public {
        // 创建一个没有足够积分的成员
        address poorMember = makeAddr("poorMember");
        pointsRecord.addCommunityMember(poorMember);
    
        // 添加另一个成员来提交和挑战记录
        pointsRecord.addCommunityMember(challenger);
    
        // 提交一个记录
        uint256 recordId = pointsRecord.submitRecord(
            "Contribution",
            "Details",
            5,
            10
        );
    
        // 先进行一次挑战
        vm.prank(challenger);
        pointsRecord.challengeRecord(recordId);
    
        // 解决挑战，使 poorMember 的积分降低
        vm.prank(owner);
        pointsRecord.resolveChallenge(recordId, 0, false);
    
        // 再次提交一个新记录
        uint256 newRecordId = pointsRecord.submitRecord(
            "AnotherContribution",
            "AnotherDetails",
            5,
            10
        );
    
        // 打印常量和当前积分
        console.log("CHALLENGE_PENALTY_POINTS:", pointsRecord.CHALLENGE_PENALTY_POINTS());
        uint256 currentPoints = pointsRecord.getMemberPoints(poorMember);
        console.log("Current Points:", currentPoints);
    
        // 尝试使用低积分成员挑战
        vm.startPrank(poorMember);
        vm.expectRevert(
            abi.encodeWithSelector(
                OptimisticPointsRecord.InsufficientPoints.selector
            )
        );
        pointsRecord.challengeRecord(newRecordId);
        vm.stopPrank();
    }
    function testResolveChallengeSuccess() public {
        // 添加 challenger 为成员
        pointsRecord.addCommunityMember(challenger);

        // 提交记录
        uint256 recordId = pointsRecord.submitRecord(
            "Contribution",
            "Details",
            5,
            10
        );

        // 记录挑战者初始积分
        uint256 initialChallengerPoints = pointsRecord.getMemberPoints(
            challenger
        );

        // 模拟挑战
        vm.prank(challenger);
        pointsRecord.challengeRecord(recordId);

        // 期望挑战成功事件
        vm.expectEmit(true, true, true, true);
        emit ChallengeSucceeded(recordId, challenger, 10);

        // 解决挑战（成功）
        pointsRecord.resolveChallenge(recordId, 0, true);

        // 检查挑战者积分是否增加
        uint256 finalChallengerPoints = pointsRecord.getMemberPoints(
            challenger
        );
        assertEq(finalChallengerPoints, initialChallengerPoints + 10);
    }

    function testResolveChallengeFailure() public {
        // 添加 challenger 为成员
        pointsRecord.addCommunityMember(challenger);

        // 提交记录
        uint256 recordId = pointsRecord.submitRecord(
            "Contribution",
            "Details",
            5,
            10
        );

        // 记录挑战者初始积分
        uint256 initialChallengerPoints = pointsRecord.getMemberPoints(
            challenger
        );

        // 模拟挑战
        vm.prank(challenger);
        pointsRecord.challengeRecord(recordId);

        // 期望挑战失败事件
        vm.expectEmit(true, true, true, true);
        emit ChallengeFailed(recordId, challenger, 5);

        // 解决挑战（失败）
        pointsRecord.resolveChallenge(recordId, 0, false);

        // 检查挑战者积分是否减少
        uint256 finalChallengerPoints = pointsRecord.getMemberPoints(
            challenger
        );
        assertEq(finalChallengerPoints, initialChallengerPoints - 5);
    }

    function testFinalizeRecord() public {
        // 提交记录
        uint256 recordId = pointsRecord.submitRecord(
            "Contribution",
            "Details",
            5,
            10
        );

        // 快进时间超过挑战期
        vm.warp(block.timestamp + 8 days);

        // 最终确认记录
        pointsRecord.finalizeRecord(recordId);

        // 检查记录是否已最终确认
        (, , , , , bool isFinalized, , uint256 points) = pointsRecord.records(
            recordId
        );

        assertTrue(isFinalized);
        // 可以额外检查 points
        assertEq(points, 10);
    }

    function testCannotFinalizeRecordDuringChallengePeriod() public {
        // 提交记录
        uint256 recordId = pointsRecord.submitRecord(
            "Contribution",
            "Details",
            5,
            10
        );

        // 尝试在挑战期内最终确认
        vm.expectRevert("Challenge period not expired");
        pointsRecord.finalizeRecord(recordId);
    }

    function testCannotFinalizeRecordWithActiveChallenges() public {
        // 添加 challenger 为成员
        pointsRecord.addCommunityMember(challenger);

        // 提交记录
        uint256 recordId = pointsRecord.submitRecord(
            "Contribution",
            "Details",
            5,
            10
        );

        // 模拟挑战
        vm.prank(challenger);
        pointsRecord.challengeRecord(recordId);

        // 快进时间超过挑战期
        vm.warp(block.timestamp + 8 days);

        // 解决挑战（成功）
        pointsRecord.resolveChallenge(recordId, 0, true);

        // 尝试最终确认
        vm.expectRevert("Successful challenge exists");
        pointsRecord.finalizeRecord(recordId);
    }

    function testPointsAfterMultipleChallenges() public {
        // 添加 challenger 为成员
        pointsRecord.addCommunityMember(challenger);

        // 多次提交和挑战记录
        uint256 recordId1 = pointsRecord.submitRecord(
            "Contribution1",
            "Details1",
            5,
            10
        );
        uint256 recordId2 = pointsRecord.submitRecord(
            "Contribution2",
            "Details2",
            5,
            10
        );

        // 记录初始积分
        uint256 initialChallengerPoints = pointsRecord.getMemberPoints(
            challenger
        );

        // 第一次挑战成功
        vm.prank(challenger);
        pointsRecord.challengeRecord(recordId1);
        pointsRecord.resolveChallenge(recordId1, 0, true);

        // 第二次挑战失败
        vm.prank(challenger);
        pointsRecord.challengeRecord(recordId2);
        pointsRecord.resolveChallenge(recordId2, 0, false);

        // 检查积分变化
        uint256 finalChallengerPoints = pointsRecord.getMemberPoints(
            challenger
        );
        assertEq(finalChallengerPoints, initialChallengerPoints + 10 - 5);
    }
}
