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
    }

    // 常量配置
    uint256 public constant CHALLENGE_PERIOD = 7 days;
    uint256 public constant CHALLENGE_BOND = 0.1 ether;

    // 状态变量
    Record[] public records;
    mapping(uint256 => Challenge[]) public recordChallenges;
    mapping(address => bool) public admins;
    mapping(address => CommunityMember) public communityMembers;
    address public owner;

    // 事件
    event RecordSubmitted(
        uint256 indexed recordId,
        address indexed contributor
    );
    event RecordChallenged(
        uint256 indexed recordId,
        address indexed challenger
    );
    event RecordFinalized(uint256 indexed recordId);
    event ChallengeFailed(uint256 indexed recordId, address indexed challenger);
    event ChallengeSucceeded(
        uint256 indexed recordId,
        address indexed challenger
    );

    // 社区成员事件
    event MemberAdded(address indexed member, uint256 joinedAt);
    event MemberFrozen(address indexed member);
    event MemberUnfrozen(address indexed member);

    // 错误
    error NotAdmin();
    error InvalidRecord();
    error ChallengePeriodNotExpired();
    error InsufficientBond();
    error ChallengeAlreadyResolved();
    error NotCommunityMember();
    error MemberAlreadyExists();

    // 管理员修饰符
    modifier onlyAdmins() {
        if (!admins[msg.sender]) revert NotAdmin();
        _;
    }

    constructor() {
        owner = msg.sender;
        admins[msg.sender] = true;

        // 使用内部方法添加部署者为社区成员
        _addCommunityMember(msg.sender);
    }

    // 添加管理员
    function addAdmin(address _newAdmin) external {
        require(msg.sender == owner, "Only owner can add admins");
        admins[_newAdmin] = true;
    }

    // 添加社区成员（仅管理员）
    function addCommunityMember(address _newMember) external {
        // 检查调用者是否为管理员
        if (!admins[msg.sender]) {
            revert NotAdmin();
        }

        // 检查成员是否已存在
        if (communityMembers[_newMember].isActive) {
            revert MemberAlreadyExists();
        }

        communityMembers[_newMember] = CommunityMember({
            isActive: true,
            isFrozen: false,
            joinedAt: block.timestamp
        });

        emit MemberAdded(_newMember, block.timestamp);
    }

    // 内部添加社区成员方法
    function _addCommunityMember(address _newMember) internal {
        // 检查成员是否已存在
        if (communityMembers[_newMember].isActive) {
            revert MemberAlreadyExists();
        }

        communityMembers[_newMember] = CommunityMember({
            isActive: true,
            isFrozen: false,
            joinedAt: block.timestamp
        });

        emit MemberAdded(_newMember, block.timestamp);
    }

    // 冻结社区成员
    function freezeMember(address _member) external onlyAdmins {
        CommunityMember storage member = communityMembers[_member];
        if (!member.isActive) {
            revert("Member does not exist");
        }
        if (member.isFrozen) {
            revert("Member already frozen");
        }

        member.isFrozen = true;
        emit MemberFrozen(_member);
    }

    // 解冻社区成员
    function unfreezeMember(address _member) external onlyAdmins {
        CommunityMember storage member = communityMembers[_member];
        require(member.isActive, "Member does not exist");

        member.isFrozen = false;
        emit MemberUnfrozen(_member);
    }

    // 提交记录（仅社区成员）
    function submitRecord(
        string memory _contributionType,
        string memory _details,
        uint8 _hoursSpent
    ) external returns (uint256) {
        // 检查调用者是否为管理员
        if (!admins[msg.sender]) {
            revert NotAdmin();
        }

        // 检查调用者是否为社区成员
        CommunityMember storage member = communityMembers[msg.sender];
        if (!member.isActive || member.isFrozen) {
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
            challengePeriod: block.timestamp + CHALLENGE_PERIOD
        });

        records.push(newRecord);
        uint256 recordId = records.length - 1;

        emit RecordSubmitted(recordId, msg.sender);
        return recordId;
    }

    // 挑战记录
    function challengeRecord(uint256 _recordId) external payable {
        // 检查保证金
        if (msg.value < CHALLENGE_BOND) {
            revert InsufficientBond();
        }

        Record storage record = records[_recordId];

        // 检查是否在挑战期内
        if (block.timestamp > record.challengePeriod) {
            revert ChallengePeriodNotExpired();
        }

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
        bool _challengeAccepted // 新增参数：管理员是否接受挑战
    ) external onlyAdmins {
        Challenge storage challenge = recordChallenges[_recordId][
            _challengeIndex
        ];

        // 检查挑战是否已解决
        if (challenge.resolved) {
            revert ChallengeAlreadyResolved();
        }

        // 标记挑战已解决
        challenge.resolved = true;

        if (_challengeAccepted) {
            // 挑战成功：返还保证金 + 额外奖励
            challenge.successful = true;
            payable(challenge.challenger).transfer(CHALLENGE_BOND * 2);

            // 可以在这里添加其他处理逻辑，如标记记录为无效
            records[_recordId].isFinalized = false;

            emit ChallengeSucceeded(_recordId, challenge.challenger);
        } else {
            // 挑战失败：没收保证金，返还给合约拥有者或管理员
            challenge.successful = false;
            payable(owner).transfer(CHALLENGE_BOND);

            emit ChallengeFailed(_recordId, challenge.challenger);
        }
    }

    // 最终确认记录
    function finalizeRecord(uint256 _recordId) external {
        Record storage record = records[_recordId];

        // 检查是否超过挑战期
        if (block.timestamp <= record.challengePeriod) {
            revert ChallengePeriodNotExpired();
        }

        // 检查是否有成功的挑战
        Challenge[] storage challenges = recordChallenges[_recordId];
        for (uint256 i = 0; i < challenges.length; i++) {
            if (challenges[i].successful) {
                revert("Successful challenge exists");
            }
        }

        // 标记为最终确认
        record.isFinalized = true;

        emit RecordFinalized(_recordId);
    }

    // 在 PointsRecord.sol 中添加
    function getRecordChallenges(
        uint256 _recordId
    ) external view returns (Challenge[] memory) {
        return recordChallenges[_recordId];
    }

    // 查询是否为活跃社区成员
    function isCommunityMember(address _member) external view returns (bool) {
        CommunityMember storage member = communityMembers[_member];
        return member.isActive && !member.isFrozen;
    }

    // 获取记录数量
    function getRecordCount() external view returns (uint256) {
        return records.length;
    }

    // 获取挑战详情
    function getChallengeDetails(
        uint256 _recordId,
        uint256 _index
    )
        external
        view
        returns (
            address challenger,
            uint256 challengeTime,
            bool resolved,
            bool successful
        )
    {
        Challenge storage challenge = recordChallenges[_recordId][_index];
        return (
            challenge.challenger,
            challenge.challengeTime,
            challenge.resolved,
            challenge.successful
        );
    }
}
