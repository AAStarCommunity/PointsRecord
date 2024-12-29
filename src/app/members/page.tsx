'use client';

import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { CONFIG } from '@/config';
import { POINTS_RECORD_ABI } from '@/contracts/PointsRecord';

interface CommunityMember {
  address: string;
  exists: boolean;
  isActive: boolean;
  isFrozen: boolean;
  totalHoursValidated: number;
}

export default function MembersPage() {
  const [members, setMembers] = useState<CommunityMember[]>([]);

  // 获取所有者地址
  const { data: ownerAddress } = useReadContract({
    address: CONFIG.CONTRACT_ADDRESS as `0x${string}`,
    abi: POINTS_RECORD_ABI,
    functionName: 'owner'
  });

  // 获取所有者的成员详情
  const { data: memberDetails } = useReadContract({
    address: CONFIG.CONTRACT_ADDRESS as `0x${string}`,
    abi: POINTS_RECORD_ABI,
    functionName: 'communityMembers',
    args: ownerAddress ? [ownerAddress] : undefined,
    query: {
      enabled: !!ownerAddress
    }
  });

  // 当 ownerAddress 和 memberDetails 都可用时，更新成员列表
  useEffect(() => {
    if (ownerAddress && memberDetails) {
      const [exists, isActive, isFrozen, totalHoursValidated] = memberDetails;
      setMembers([{
        address: ownerAddress,
        exists,
        isActive,
        isFrozen,
        totalHoursValidated: Number(totalHoursValidated)
      }]);
    }
  }, [ownerAddress, memberDetails]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">社区成员</h1>
      
      {members.length === 0 ? (
        <div className="text-center text-gray-500">加载中...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div 
              key={member.address} 
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  {member.address.slice(0, 2)}
                </div>
                <div>
                  <h2 className="text-lg font-semibold truncate max-w-[200px]">
                    {member.address}
                  </h2>
                  <div className="flex items-center">
                    <span 
                      className={`
                        px-2 py-1 rounded-full text-xs font-medium mr-2
                        ${member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                      `}
                    >
                      {member.isActive ? '活跃' : '非活跃'}
                    </span>
                    {member.isFrozen && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        已冻结
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">总贡献工时</span>
                  <span className="font-bold text-blue-600">
                    {member.totalHoursValidated} 小时
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}