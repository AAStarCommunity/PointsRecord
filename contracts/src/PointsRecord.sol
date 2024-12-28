// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract OptimisticPointsRecord {
    // 记录结构
    struct Record {
        address contributor;
        uint256 timestamp;
        uint8 hoursSpent;
        string contributionType;
        string details;
        bool isFinalized;
        uint256 challengePeriod;
        uint256 points; // 新增：记录的积分
    }

    // 挑战记录
    struct Challenge {
        address challenger;
        uint256 challengeTime;
        bool resolved;
        bool successful;
    }

    // 社区成员结构
    struct CommunityMember {
        bool isActive;
        bool isFrozen;
        uint256 joinedAt;
        uint256 points; // 新增：成员积分
    }

    // 常量配置
    uint256 public constant CHALLENGE_PERIOD = 7 days;
    uint256 public constant CHALLENGE_REWARD_POINTS = 10; // 挑战成功奖励积分
    uint256 public constant CHALLENGE_PENALTY_POINTS = 5; // 挑战失败扣除积分

    // 状态变量
    Record[] public records;
    mapping(uint256 => Challenge[]) public recordChallenges;
    mapping(address => bool) public admins;
    mapping(address => CommunityMember) public communityMembers;
    address public owner;

    // 事件
    event RecordSubmitted(
        uint256 indexed recordId,
        address indexed contributor,
        uint256 points
    );
    event RecordChallenged(
        uint256 indexed recordId,
        address indexed challenger
    );
    event RecordFinalized(uint256 indexed recordId);
    event ChallengeFailed(
        uint256 indexed recordId, 
        address indexed challenger, 
        uint256 penaltyPoints
    );
    event ChallengeSucceeded(
        uint256 indexed recordId,
        address indexed challenger,
        uint256 rewardPoints
    );

    // 错误
    error NotAdmin();
    error NotCommunityMember();
    error InsufficientPoints();
    error InvalidRecord();

    // 管理员修饰符
    modifier onlyAdmins() {
        if (!admins[msg.sender]) revert NotAdmin();
        _;
    }

    constructor() {
        owner = msg.sender;
        admins[msg.sender] = true;
        
        // 为部署者添加初始积分
        communityMembers[msg.sender] = CommunityMember({
            isActive: true,
            isFrozen: false,
            joinedAt: block.timestamp,
            points: 100 // 初始积分
        });
    }

    // 添加社区成员（仅管理员）
    function addCommunityMember(address _newMember) external onlyAdmins {
        require(!communityMembers[_newMember].isActive, "Member already exists");
        
        communityMembers[_newMember] = CommunityMember({
            isActive: true,
            isFrozen: false,
            joinedAt: block.timestamp,
            points: 50 // 初始积分
        });
    }

    // 提交记录（仅社区成员）
    function submitRecord(
        string memory _contributionType,
        string memory _details,
        uint8 _hoursSpent,
        uint256 _points
    ) external returns (uint256) {
        // 检查调用者是否为管理员或活跃社区成员
        CommunityMember storage member = communityMembers[msg.sender];
        if (!admins[msg.sender] && (!member.isActive || member.isFrozen)) {
            revert NotCommunityMember();
        }

        // 验证记录有效性
        if (_hoursSpent == 0 || _hoursSpent > 10) {
            revert InvalidRecord();
        }

        Record memory newRecord = Record({
            contributor: msg.sender,
            timestamp: block.timestamp,
            hoursSpent: _hoursSpent,
            contributionType: _contributionType,
            details: _details,
            isFinalized: false,
            challengePeriod: block.timestamp + CHALLENGE_PERIOD,
            points: _points
        });

        records.push(newRecord);
        uint256 recordId = records.length - 1;

        emit RecordSubmitted(recordId, msg.sender, _points);
        return recordId;
    }

    // 挑战记录
    function challengeRecord(uint256 _recordId) external {
        CommunityMember storage challenger = communityMembers[msg.sender];
        
        // 管理员可以无条件挑战
        if (!admins[msg.sender]) {
            // 非管理员需要有足够积分
            if (!challenger.isActive || challenger.isFrozen) {
                revert NotCommunityMember();
            }
            if (challenger.points < CHALLENGE_PENALTY_POINTS) {
                revert InsufficientPoints();
            }
        }

        Record storage record = records[_recordId];

        // 检查是否在挑战期内
        require(block.timestamp <= record.challengePeriod, "Challenge period expired");

        // 记录挑战
        Challenge memory newChallenge = Challenge({
            challenger: msg.sender,
            challengeTime: block.timestamp,
            resolved: false,
            successful: false
        });

        recordChallenges[_recordId].push(newChallenge);

        emit RecordChallenged(_recordId, msg.sender);
    }

    // 解决挑战
    function resolveChallenge(
        uint256 _recordId,
        uint256 _challengeIndex,
        bool _challengeAccepted
    ) external onlyAdmins {
        Challenge storage challenge = recordChallenges[_recordId][_challengeIndex];
        Record storage record = records[_recordId];
        CommunityMember storage challenger = communityMembers[challenge.challenger];

        // 检查挑战是否已解决
        require(!challenge.resolved, "Challenge already resolved");

        // 标记挑战已解决
        challenge.resolved = true;

        if (_challengeAccepted) {
            // 挑战成功
            challenge.successful = true;
            
            // 给挑战者奖励积分（如果是社区成员）
            if (challenger.isActive && !challenger.isFrozen) {
                challenger.points += CHALLENGE_REWARD_POINTS;
            }

            // 标记记录为未最终确认
            record.isFinalized = false;

            emit ChallengeSucceeded(
                _recordId, 
                challenge.challenger, 
                CHALLENGE_REWARD_POINTS
            );
        } else {
            // 挑战失败
            challenge.successful = false;
            
            // 扣除挑战者积分（如果是社区成员）
            if (challenger.isActive && !challenger.isFrozen) {
                challenger.points = challenger.points > CHALLENGE_PENALTY_POINTS 
                    ? challenger.points - CHALLENGE_PENALTY_POINTS 
                    : 0;
            }

            emit ChallengeFailed(
                _recordId, 
                challenge.challenger, 
                CHALLENGE_PENALTY_POINTS
            );
        }
    }

    // 最终确认记录
    function finalizeRecord(uint256 _recordId) external {
        Record storage record = records[_recordId];

        // 检查是否超过挑战期
        require(block.timestamp > record.challengePeriod, "Challenge period not expired");

        // 检查是否有成功的挑战
        Challenge[] storage challenges = recordChallenges[_recordId];
        for (uint256 i = 0; i < challenges.length; i++) {
            if (challenges[i].resolved && challenges[i].successful) {
                revert("Successful challenge exists");
            }
        }

        // 标记为最终确认
        record.isFinalized = true;

        emit RecordFinalized(_recordId);
    }

    // 获取成员积分
    function getMemberPoints(address _member) external view returns (uint256) {
        return communityMembers[_member].points;
    }
}