// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PointsRecord {
    struct ContributionRecord {
        uint256 timestamp;
        address contributorAddress;
        string nickname;
        string contributionType;
        string details;
        uint8 hours;
    }
    
    mapping(address => string) public nicknames;
    ContributionRecord[] public records;
    mapping(address => uint256[]) public userRecordIndices;
    
    event RecordAdded(address indexed contributor, uint256 timestamp);
    event NicknameSet(address indexed user, string nickname);
    
    function setNickname(string memory _nickname) public {
        nicknames[msg.sender] = _nickname;
        emit NicknameSet(msg.sender, _nickname);
    }
    
    function addRecord(
        string memory _contributionType,
        string memory _details,
        uint8 _hours
    ) public {
        require(_hours > 0 && _hours <= 10, "Hours must be between 1 and 10");
        
        string memory nickname = bytes(nicknames[msg.sender]).length > 0 
            ? nicknames[msg.sender] 
            : addressToString(msg.sender);
            
        ContributionRecord memory newRecord = ContributionRecord({
            timestamp: block.timestamp,
            contributorAddress: msg.sender,
            nickname: nickname,
            contributionType: _contributionType,
            details: _details,
            hours: _hours
        });
        
        records.push(newRecord);
        userRecordIndices[msg.sender].push(records.length - 1);
        
        emit RecordAdded(msg.sender, block.timestamp);
    }
    
    function getRecordCount() public view returns (uint256) {
        return records.length;
    }
    
    function getRecords(uint256 offset, uint256 limit) public view 
        returns (ContributionRecord[] memory) {
        uint256 end = min(offset + limit, records.length);
        uint256 size = end - offset;
        
        ContributionRecord[] memory result = new ContributionRecord[](size);
        for (uint256 i = 0; i < size; i++) {
            result[i] = records[offset + i];
        }
        return result;
    }
    
    function getUserRecords(address user, uint256 offset, uint256 limit) 
        public view returns (ContributionRecord[] memory) {
        uint256[] storage userIndices = userRecordIndices[user];
        uint256 end = min(offset + limit, userIndices.length);
        uint256 size = end - offset;
        
        ContributionRecord[] memory result = new ContributionRecord[](size);
        for (uint256 i = 0; i < size; i++) {
            result[i] = records[userIndices[offset + i]];
        }
        return result;
    }
    
    function min(uint256 a, uint256 b) private pure returns (uint256) {
        return a < b ? a : b;
    }
    
    function addressToString(address _addr) private pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42);
        str[0] = "0";
        str[1] = "x";
        for (uint256 i = 0; i < 20; i++) {
            str[2+i*2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3+i*2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }
} 