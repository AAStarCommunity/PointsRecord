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

    // 社区成员修饰符
    modifier onlyCommunityMembers() {
        CommunityMember storage member = communityMembers[msg.sender];
        if (!member.isActive || member.isFrozen) revert NotCommunityMember();
        _;
    }

    constructor() {
        owner = msg.sender;
        admins[msg.sender] = true;

        // 合约部署者默认成为社区成员
        _addCommunityMember(msg.sender);
    }

    // 添加管理员
    function addAdmin(address _newAdmin) external {
        require(msg.sender == owner, "Only owner can add admins");
        admins[_newAdmin] = true;
    }

    // 添加社区成员（仅管理员）
    function addCommunityMember(address _newMember) external onlyAdmins {
        _addCommunityMember(_newMember);
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
    ) external onlyAdmins onlyCommunityMembers returns (uint256) {
        // 验证记录有效性
        if (_hoursSpent == 0 || _hoursSpent > 10) revert InvalidRecord();

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

    // 其他方法保持不变（challengeRecord, resolveChallenge, finalizeRecord等）

    // 查询是否为活跃社区成员
    function isCommunityMember(address _member) external view returns (bool) {
        CommunityMember storage member = communityMembers[_member];
        return member.isActive && !member.isFrozen;
    }
}
