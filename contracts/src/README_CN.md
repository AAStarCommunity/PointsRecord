# CommunityWorkRecord 智能合约

## 概述

CommunityWorkRecord 是一个去中心化的社区工作记录管理智能合约，旨在透明且公平地记录和验证社区成员的工作贡献。

## 主要功能

- 社区成员管理
- 工作贡献记录
- 工作记录挑战机制
- 工作类型分类

## 核心特性

1. 只有管理员可以添加社区成员
2. 成员可以提交工作记录
3. 14 天的挑战期
4. 管理员仲裁挑战结果

## 工作类型

- 文档
- 社区
- 代码

## 工作记录流程

1. 成员提交工作记录
2. 在 14 天内可以被挑战
3. 管理员决定挑战结果
   - 挑战成功：清除工作记录
   - 挑战失败：确认工作记录并累计工时

## 权限控制

- 只有管理员可以：
  - 添加社区成员
  - 冻结社区成员
  - 添加其他管理员
  - 仲裁挑战

## 安全机制

- 防止重复添加成员
- 限制工作记录的工时范围
- 防止对同一记录的重复挑战

## 开发环境

- Solidity ^0.8.19
- Foundry 测试框架

## 方法

### `addAdmin(address _newAdmin)`

添加新的管理员。

- 参数:
  - `_newAdmin`: 新管理员的地址
- 修饰符:
  - `onlyAdmins`

### `addCommunityMember(address _member)`

添加新的社区成员。

- 参数:
  - `_member`: 新成员的地址
- 修饰符:
  - `onlyAdmins`

### `freezeMember(address _member)`

冻结社区成员。

- 参数:
  - `_member`: 要冻结的成员地址
- 修饰符:
  - `onlyAdmins`

### `submitWorkRecord(uint8 _hoursSpent, WorkType _workType, string memory _proof) returns (uint256)`

提交工作记录。

- 参数:
  - `_hoursSpent`: 工时
  - `_workType`: 工作类型
  - `_proof`: 证明材料
- 返回值:
  - `recordId`: 工作记录的ID
- 修饰符:
  - `onlyActiveMember`

### `challengeWorkRecord(uint256 _recordId)`

挑战工作记录。

- 参数:
  - `_recordId`: 工作记录的ID
- 修饰符:
  - `onlyActiveMember`

### `resolveChallenge(uint256 _recordId, bool _challengeAccepted)`

解决工作记录的挑战。

- 参数:
  - `_recordId`: 工作记录的ID
  - `_challengeAccepted`: 挑战是否被接受
- 修饰符:
  - `onlyAdmins`

### `getMemberTotalHours(address _member) external view returns (uint256)`

获取成员的总有效工时。

- 参数:
  - `_member`: 成员地址
- 返回值:
  - `totalHoursValidated`: 总有效工时

## 事件

### `MemberAdded(address indexed member)`

当新的社区成员被添加时触发。

- 参数:
  - `member`: 新成员的地址

### `MemberFrozen(address indexed member)`

当社区成员被冻结时触发。

- 参数:
  - `member`: 被冻结的成员地址

### `WorkRecordSubmitted(uint256 indexed recordId, address indexed contributor)`

当工作记录被提交时触发。

- 参数:
  - `recordId`: 工作记录的ID
  - `contributor`: 贡献者的地址

### `WorkRecordChallenged(uint256 indexed recordId, address indexed challenger)`

当工作记录被挑战时触发。

- 参数:
  - `recordId`: 工作记录的ID
  - `challenger`: 挑战者的地址

### `WorkRecordResolved(uint256 indexed recordId, bool successful)`

当工作记录的挑战被解决时触发。

- 参数:
  - `recordId`: 工作记录的ID
  - `successful`: 挑战是否成功
