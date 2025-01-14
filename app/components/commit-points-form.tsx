'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { POINTS_RECORD_ABI } from '@/abi/PointsRecord';
import { toast } from 'react-hot-toast';

interface CommitPointsFormProps {
    onBack: () => void;
}

export default function CommitPointsForm({ onBack }: CommitPointsFormProps) {
    const { address } = useAccount();
    const [points, setPoints] = useState('');
    const [description, setDescription] = useState('');

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
                args: [BigInt(points), BigInt(1), description]
            });
        } catch (error) {
            console.error('Transaction error:', error);
            toast.error('Failed to submit transaction');
        }
    };

    // 使用 useEffect 监听交易状态
    useEffect(() => {
        if (hash) {
            toast.loading('Transaction pending...', { id: 'tx' });
        }
    }, [hash]);

    const { isSuccess, isError } = useWaitForTransactionReceipt({
        hash,  // 直接使用解构的 hash
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

    if (isError || submitError) {
        toast.error('Failed to submit points');
    }

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
                    <div className="flex justify-between items-center w-full mb-6">
                        <button
                            onClick={onBack}
                            className="text-white hover:text-gray-300 flex items-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
                            </svg>
                            Back
                        </button>
                        <div className="text-sm text-white/70">
                            Current Wallet: {address?.slice(0, 6)}...{address?.slice(-4)}
                        </div>
                    </div>

                    <div className="text-2xl font-bold text-center text-white mb-6 tracking-tight w-full">
                        Submit Points Record
                    </div>

                    <div className="w-full text-sm text-white/70 bg-gray-700 border border-gray-600 rounded-md p-3 mb-4">
                        <p>🕒 Note: You are submitting points for <strong>{getPreviousMonthInfo()}</strong></p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 w-full">
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
                            className="w-full bg-white/20 text-white py-2 rounded-md hover:bg-white/30 transition-colors"
                        >
                            Submit Points
                        </button>
                    </form>
                </main>
            </div>
        </div>
    );
}