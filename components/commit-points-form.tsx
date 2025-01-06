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

  const {
    writeContract,
    isPending,
    error: submitError,
    data: hash
  } = useWriteContract();

  // 监听交易状态
  useEffect(() => {
    if (!hash) return;

    toast.loading('Transaction pending...', { id: 'tx' });

    const waitForTransaction = async () => {
      try {
        const { isSuccess } = await useWaitForTransactionReceipt({
          hash,
        });

        if (isSuccess) {
          toast.success('Points submitted successfully!', { id: 'tx' });
          onBack();
        }
      } catch (error) {
        toast.error('Failed to submit points', { id: 'tx' });
      }
    };

    waitForTransaction();
  }, [hash, onBack]);

  // 处理提交错误
  useEffect(() => {
    if (submitError) {
      toast.error('Failed to submit points', { id: 'tx' });
    }
  }, [submitError]);

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
    }
  };

  // 获取上个月的月份和年份
  const getPreviousMonthInfo = () => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex items-center justify-center min-h-screen p-4">
        <main className="w-full max-w-md border border-gray-600 rounded-lg p-6 bg-gray-800">
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

          <div className="w-full text-sm text-white bg-gray-700 border border-gray-600 rounded-md p-3 mb-4">
            <p>🕒 Note: You are submitting points for <strong>{getPreviousMonthInfo()}</strong></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="points"
                className="block text-sm font-medium text-white mb-2"
              >
                Points Quantity (Hours)<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="points"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter points quantity"
                required
                min="1"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-white mb-2"
              >
                Description<span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter points description (e.g., Participated in community activity, Github contribution, etc.)"
                rows={4}
                required
                maxLength={200}
              />
              <p className="text-xs text-gray-300 mt-1 text-right">
                {description.length}/200
              </p>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className={`w-full bg-gray-700 text-white py-2 rounded-md transition-colors ${
                isPending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'
              }`}
            >
              {isPending ? 'Submitting...' : 'Submit Points'}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
} 