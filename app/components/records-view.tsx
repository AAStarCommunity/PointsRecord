'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { POINTS_RECORD_ABI } from '@/abi/PointsRecord';
import toast from 'react-hot-toast';

interface WorkRecord {
    id: bigint;
    user: string;
    points: number;
    description: string;
    month: number;
    year: number;
}

interface RecordsViewProps {
    onBack: () => void;
}

export default function RecordsView({ onBack }: RecordsViewProps) {
    const { address } = useAccount();
    const [records, setRecords] = useState<WorkRecord[]>([]);
    const { writeContract } = useWriteContract();

    const {
        data: contractRecords,
        isLoading,
        error
    } = useReadContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        abi: POINTS_RECORD_ABI,
        functionName: 'getPendingRecords',
        args: [],
    });

    useEffect(() => {
        if (contractRecords && Array.isArray(contractRecords)) {
            console.log(contractRecords);
            const getRecordMonth = (timestamp: bigint) => {
                // 将 BigInt 转换为毫秒（JavaScript 使用毫秒级时间戳）
                const date = new Date(Number(timestamp) * 1000);
                // getMonth() 返回 0-11，所以需要 +1
                return date.getMonth() + 1;
            };

            const getRecordYear = (timestamp: bigint) => {
                const date = new Date(Number(timestamp) * 1000);
                return date.getFullYear();
            };
            // 根据实际返回类型转换
            const formattedRecords = contractRecords.map((record: any) => ({
                id: record.contributor,
                user: record.contributor,
                points: Number(record.hoursSpent),
                description: record.description,
                month: getRecordMonth(record.submissionTime),
                year: getRecordYear(record.submissionTime)
            }));
            setRecords(formattedRecords);
        }
    }, [contractRecords]);

    const handleChallenge = (recordId: bigint) => {
        toast.custom((t) => (
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
                <h2 className="text-lg font-semibold mb-4">Challenge Record</h2>
                <p className="text-gray-600 mb-4">
                    Are you sure you want to challenge this work record?
                </p>
                <div className="flex justify-between">
                    <button
                        onClick={() => {
                            //   writeContract({
                            //     address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
                            //     abi: POINTS_RECORD_ABI,
                            //     functionName: 'challengeRecord',
                            //     args: [recordId]
                            //   });
                            //   toast.dismiss(t.id);
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Confirm Challenge
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), {
            duration: Infinity,
            position: 'top-center'
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-500">
                Error loading records: {error.message}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <div className="container mx-auto max-w-4xl px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">View Records</h2>
                    <button 
                        type="button"
                        onClick={onBack}
                        className="text-white hover:text-gray-200"
                    >
                        Back
                    </button>
                </div>

                {records.length === 0 ? (
                    <p className="text-white text-center">No pending records found</p>
                ) : (
                    <div className="grid gap-4">
                        {records.map((record) => (
                            <div
                                key={record.id.toString()}
                                className="bg-gray-800 shadow-md rounded-lg p-4 flex justify-between items-center"
                            >
                                <div>
                                    <p className="font-semibold text-white">{record.description}</p>
                                    <div className="text-sm text-gray-300">
                                        <span>Points: {record.points}</span>
                                        <span className="ml-4">User: {record.user}</span>
                                        <span className="ml-4">
                                            Period: {record.month}/{record.year}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="px-2 py-1 rounded text-xs bg-yellow-600 text-white">
                                        Pending
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleChallenge(record.id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                                    >
                                        Challenge
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}