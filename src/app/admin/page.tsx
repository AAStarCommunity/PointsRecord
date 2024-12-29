'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useReadContract, useWriteContract } from 'wagmi';
import { CONFIG } from '@/config';
import { POINTS_RECORD_ABI } from '@/contracts/PointsRecord';
import { toast } from 'react-hot-toast';

export default function AdminPage() {
  const { address, isConnected } = useAccount();
  const [newMemberAddress, setNewMemberAddress] = useState('');
  const [challengeId, setChallengeId] = useState('');

  // 检查是否为管理员
  const { data: isAdmin } = useReadContract({
    address: CONFIG.CONTRACT_ADDRESS as `0x${string}`,
    abi: POINTS_RECORD_ABI,
    functionName: 'isAdmin',
    args: [address || '0x0']
  });

  const { writeContract } = useWriteContract();

  const handleAddMember = () => {
    if (!isAdmin) {
      toast.error('只有管理员可以添加成员');
      return;
    }

    writeContract({
      address: CONFIG.CONTRACT_ADDRESS as `0x${string}`,
      abi: POINTS_RECORD_ABI,
      functionName: 'addCommunityMember',
      args: [newMemberAddress]
    });
  };

  const handleResolveChallenges = () => {
    if (!isAdmin) {
      toast.error('只有管理员可以仲裁挑战');
      return;
    }

    writeContract({
      address: CONFIG.CONTRACT_ADDRESS as `0x${string}`,
      abi: POINTS_RECORD_ABI,
      functionName: 'resolveChallenges',
      args: [BigInt(challengeId)]
    });
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        请先连接钱包
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-12 text-red-600">
        您没有管理员权限
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">管理员面板</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">添加社区成员</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="输入成员钱包地址"
              value={newMemberAddress}
              onChange={(e) => setNewMemberAddress(e.target.value)}
              className="flex-grow border rounded-md px-3 py-2"
            />
            <button
              onClick={handleAddMember}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              添加
            </button>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">仲裁挑战</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="输入挑战ID"
              value={challengeId}
              onChange={(e) => setChallengeId(e.target.value)}
              className="flex-grow border rounded-md px-3 py-2"
            />
            <button
              onClick={handleResolveChallenges}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              仲裁
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}