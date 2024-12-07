// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PointsRecord {
    struct ContributionRecord {
        uint256 timestamp;
        address contributorAddress;
        string nickname;
        string contributionType;
        string details;
        uint8 hoursSpent;
    }
    
    mapping(address => string) public nicknames;
    ContributionRecord[] public records;
    mapping(address => uint256[]) public userRecordIndices;
    
    event RecordAdded(address indexed contributor, uint256 timestamp);
    event NicknameSet(address indexed user, string nickname);
    
    error InvalidHours();
    error EmptyNickname();
    
    function setNickname(string memory _nickname) public {
        if (bytes(_nickname).length == 0) {
            revert EmptyNickname();
        }
        nicknames[msg.sender] = _nickname;
        emit NicknameSet(msg.sender, _nickname);
    }
    
    function addRecord(
        string memory _contributionType,
        string memory _details,
        uint8 _hours
    ) public {
        if (_hours == 0 || _hours > 10) {
            revert InvalidHours();
        }
        
        string memory nickname = bytes(nicknames[msg.sender]).length > 0 
            ? nicknames[msg.sender] 
            : addressToString(msg.sender);
            
        ContributionRecord memory newRecord = ContributionRecord({
            timestamp: block.timestamp,
            contributorAddress: msg.sender,
            nickname: nickname,
            contributionType: _contributionType,
            details: _details,
            hoursSpent: _hours
        });
        
        records.push(newRecord);
        userRecordIndices[msg.sender].push(records.length - 1);
        
        emit RecordAdded(msg.sender, block.timestamp);
    }
    
    function getUserRecordIndices(address _user) public view returns (uint256[] memory) {
        return userRecordIndices[_user];
    }
    
    function getRecordCount() public view returns (uint256) {
        return records.length;
    }
    
    function getUserRecordCount(address _user) public view returns (uint256) {
        return userRecordIndices[_user].length;
    }
    
    function addressToString(address _addr) internal pure returns (string memory) {
        bytes memory data = abi.encodePacked(_addr);
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42);
        str[0] = "0";
        str[1] = "x";
        for (uint256 i = 0; i < 20; i++) {
            str[2+i*2] = alphabet[uint8(data[i] >> 4)];
            str[3+i*2] = alphabet[uint8(data[i] & 0x0f)];
        }
        return string(str);
    }
} 