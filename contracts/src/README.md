# CommunityWorkRecord Smart Contract

## Overview

CommunityWorkRecord is a decentralized community work record management smart contract designed to transparently and fairly record and verify the contributions of community members.

## Main Features

- Community member management
- Work contribution recording
- Work record challenge mechanism
- Work type classification

## Core Features

1. Only administrators can add community members
2. Members can submit work records
3. 14-day challenge period
4. Administrators arbitrate challenge results

## Work Types

- Document
- Community
- Code

## Work Record Process

1. Members submit work records
2. Can be challenged within 14 days
3. Administrators decide the challenge result
   - Challenge successful: work record is cleared
   - Challenge failed: work record is confirmed and hours are accumulated

## Permission Control

- Only administrators can:
  - Add community members
  - Freeze community members
  - Add other administrators
  - Arbitrate challenges

## Security Mechanisms

- Prevent duplicate member additions
- Limit the range of work record hours
- Prevent duplicate challenges on the same record

## Development Environment

- Solidity ^0.8.19
- Foundry testing framework

## Methods

### `addAdmin(address _newAdmin)`

Add a new administrator.

- Parameters:
  - `_newAdmin`: Address of the new administrator
- Modifiers:
  - `onlyAdmins`

### `addCommunityMember(address _member)`

Add a new community member.

- Parameters:
  - `_member`: Address of the new member
- Modifiers:
  - `onlyAdmins`

### `freezeMember(address _member)`

Freeze a community member.

- Parameters:
  - `_member`: Address of the member to be frozen
- Modifiers:
  - `onlyAdmins`

### `submitWorkRecord(uint8 _hoursSpent, WorkType _workType, string memory _proof) returns (uint256)`
Submit a work record.

- Parameters:
  - `_hoursSpent`: Hours spent
  - `_workType`: Type of work
  - `_proof`: Proof material
- Returns:
  - `recordId`: ID of the work record
- Modifiers:
  - `onlyActiveMember`

### `challengeWorkRecord(uint256 _recordId)`
Challenge a work record.

- Parameters:
  - `_recordId`: ID of the work record
- Modifiers:
  - `onlyActiveMember`

### `resolveChallenge(uint256 _recordId, bool _challengeAccepted)`
Resolve a work record challenge.

- Parameters:
  - `_recordId`: ID of the work record
  - `_challengeAccepted`: Whether the challenge is accepted
- Modifiers:
  - `onlyAdmins`

### `getMemberTotalHours(address _member) external view returns (uint256)`
Get the total validated hours of a member.

- Parameters:
  - `_member`: Address of the member
- Returns:
  - `totalHoursValidated`: Total validated hours

## Events

### `MemberAdded(address indexed member)`

Triggered when a new community member is added.

- Parameters:
  - `member`: Address of the new member

### `MemberFrozen(address indexed member)`

Triggered when a community member is frozen.

- Parameters:
  - `member`: Address of the frozen member

### `WorkRecordSubmitted(uint256 indexed recordId, address indexed contributor)`

Triggered when a work record is submitted.

- Parameters:
  - `recordId`: ID of the work record
  - `contributor`: Address of the contributor

### `WorkRecordChallenged(uint256 indexed recordId, address indexed challenger)`

Triggered when a work record is challenged.

- Parameters:
  - `recordId`: ID of the work record
  - `challenger`: Address of the challenger

### `WorkRecordResolved(uint256 indexed recordId, bool successful)`

Triggered when a work record challenge is resolved.

- Parameters:
  - `recordId`: ID of the work record
  - `successful`: Whether the challenge was successful

### `WorkRecordAutoFinalized(uint256 indexed recordId)`

Triggered when a work record is automatically finalized.

- Parameters:
  - `recordId`: ID of the work record
