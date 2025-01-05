'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { POINTS_RECORD_ABI } from '../abi/PointsRecord';
import { toast } from 'react-hot-toast';
import { useColorStore } from '../store/color-store';

export default function CommitPointsForm({ onBack }: { onBack: () => void }) {
  const { address } = useAccount();
  const [points, setPoints] = useState('');
  const [description, setDescription] = useState('');
  const { bgColorFrom, bgColorTo } = useColorStore();

  const {
    writeContract,
    isPending,
    error: submitError,
    data: hash
  } = useWriteContract();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      writeContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        abi: POINTS_RECORD_ABI,
        functionName: 'submitWorkRecord',
        args: [Number(points), 1, description]
      });
    } catch (error) {
      console.error('Transaction error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit transaction');
    }
  };

  // 监听交易状态
  useEffect(() => {
    if (hash) {
      toast.loading('Transaction pending...', { id: 'tx' });
    }
  }, [hash]);

  const { isSuccess, isError } = useWaitForTransactionReceipt({
    hash,
  });

  // 交易成功或失败的提示
  useEffect(() => {
    if (isSuccess) {
      toast.success('Points submitted successfully!', { id: 'tx' });
      onBack(); // 返回主页
    }
    if (isError || submitError) {
      toast.error('Failed to submit points', { id: 'tx' });
    }
  }, [isSuccess, isError, submitError, onBack]);

  // 获取上个月的月份和年份
  const getPreviousMonthInfo = () => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  return (
    <div 
      className="min-h-screen"
      style={{
        background: `linear-gradient(135deg, ${bgColorFrom}, ${bgColorTo})`
      }}
    >
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Submit Points</h2>
            <button 
              type="button"
              onClick={onBack}
              className="text-white hover:text-gray-200"
            >
              Back
            </button>
          </div>

          <div className="w-full text-sm text-white/70 bg-white/10 border border-white/20 rounded-md p-3 mb-4">
            <p>🕒 Note: You are submitting points for <strong>{getPreviousMonthInfo()}</strong></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="points"
                className="block text-sm font-medium text-white/70 mb-2"
              >
                Points Quantity (Hours)<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="points"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                className="w-full px-3 py-2 border border-white/20 rounded-md shadow-sm bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter points quantity"
                required
                min="1"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-white/70 mb-2"
              >
                Description<span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-white/20 rounded-md shadow-sm bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter points description (e.g., Participated in community activity, Github contribution, etc.)"
                rows={4}
                required
                maxLength={200}
              />
              <p className="text-xs text-white/50 mt-1 text-right">
                {description.length}/200
              </p>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className={`w-full bg-white/20 text-white py-2 rounded-md transition-colors ${
                isPending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/30'
              }`}
            >
              {isPending ? 'Submitting...' : 'Submit Points'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 