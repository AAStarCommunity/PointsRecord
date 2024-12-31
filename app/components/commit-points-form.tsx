'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';

interface CommitPointsFormProps {
    onBack: () => void;
}

export default function CommitPointsForm({ onBack }: CommitPointsFormProps) {
    const { address } = useAccount();
    const [points, setPoints] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting points:', {
            points,
            description,
            walletAddress: address
        });
    };

    // 获取上个月的月份和年份
    const getPreviousMonthInfo = () => {
        const date = new Date();
        date.setDate(1);
        date.setMonth(date.getMonth() - 1);
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    };
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-md border border-white/20 rounded-lg p-6 bg-white/10">
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
                            Back
                        </svg>
                    </button>
                    <div className="text-sm text-white/70">
                        Current Wallet: {address?.slice(0, 6)}...{address?.slice(-4)}
                    </div>
                </div>

                <div className="text-2xl font-bold text-center text-white mb-6 tracking-tight w-full">
                    Submit Points Record
                </div>

                <div className="w-full text-sm text-white/70 bg-white/10 border border-white/20 rounded-md p-3 mb-4">
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
    );
}