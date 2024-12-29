'use client'

import { useState } from 'react';
import { ContributionType } from '@/types';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONFIG } from '@/config';
import { POINTS_RECORD_ABI } from '@/contracts/PointsRecord';

// 映射 ContributionType 到 WorkType
const mapContributionToWorkType = (type: ContributionType) => {
  switch (type) {
    case ContributionType.CODE: return 2; // WorkType.Code
    case ContributionType.DOC: return 0; // WorkType.Document
    case ContributionType.DESIGN: return 1; // WorkType.Community
    case ContributionType.OPERATION: return 1; // WorkType.Community
    case ContributionType.OTHER: return 1; // WorkType.Community
    default: return 1;
  }
};

export function RecordForm() {
  const { address } = useAccount();
  const [records, setRecords] = useState([{
    timestamp: Date.now(),
    contributionType: ContributionType.CODE,
    details: '',
    hours: 1
  }]);

  const { 
    writeContract, 
    isPending, 
    error: writeError 
  } = useWriteContract();

  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed, 
    error: confirmError 
  } = useWaitForTransactionReceipt();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      alert('请先连接钱包');
      return;
    }

    try {
      // 提交每条记录到合约
      for (const record of records) {
        writeContract({
          address: CONFIG.CONTRACT_ADDRESS as `0x${string}`,
          abi: POINTS_RECORD_ABI,
          functionName: 'submitWorkRecord',
          args: [
            record.hours as number, 
            mapContributionToWorkType(record.contributionType), 
            record.details
          ]
        });
      }
    } catch (err) {
      console.error('提交记录时出错:', err);
      alert('提交记录失败，请重试');
    }
  };

  const addNewRecord = () => {
    setRecords([...records, {
      timestamp: Date.now(),
      contributionType: ContributionType.CODE,
      details: '',
      hours: 1
    }]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {records.map((record, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              贡献类型
            </label>
            <select
              value={record.contributionType}
              onChange={(e) => {
                const newRecords = [...records];
                newRecords[index].contributionType = e.target.value as ContributionType;
                setRecords(newRecords);
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              {Object.values(ContributionType).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              详细描述
            </label>
            <textarea
              value={record.details}
              onChange={(e) => {
                const newRecords = [...records];
                newRecords[index].details = e.target.value;
                setRecords(newRecords);
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              工作小时数
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={record.hours}
              onChange={(e) => {
                const newRecords = [...records];
                newRecords[index].hours = parseInt(e.target.value);
                setRecords(newRecords);
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
        </div>
      ))}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={addNewRecord}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          添加另一条记录
        </button>
        <button
          type="submit"
          disabled={isPending || !address}
          className={`px-4 py-2 bg-blue-500 text-white rounded-md ${
            isPending || !address ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
        >
          {isPending ? '提交中...' : '提交记录'}
        </button>
      </div>

      {(writeError || confirmError) && (
        <div className="text-red-500 mt-2">
          错误: {(writeError || confirmError)?.message}
        </div>
      )}
      
      {isConfirmed && (
        <div className="text-green-500 mt-2">
          记录提交成功！
        </div>
      )}
    </form>
  );
}