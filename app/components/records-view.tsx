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
    status: 'Pending';
}

interface RecordsViewProps {
    onBack: () => void;
}

export default function RecordsView({ onBack }: RecordsViewProps) {
    const { address } = useAccount();
    const [records, setRecords] = useState<bigint[]>([]);
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
        if (contractRecords) {
            setRecords(contractRecords as bigint[]);
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
                            toast('Coming Soon...')
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
            position: 'top-center',
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
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Pending Work Records</h1>
                <button
                    onClick={onBack}
                    className="bg-white/20 text-white px-4 py-2 rounded hover:bg-white/30 transition-colors"
                >
                    Back
                </button>
            </div>

            {records.length === 0 ? (
                <p className="text-gray-500 text-center">No pending records found</p>
            ) : (
                <div className="grid gap-4">
                    {records.map((record) => (
                        <div
                            key={record.toString()}
                            className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center"
                        >
                            <div>
                                <p className="font-semibold">N/A</p>
                                <div className="text-sm text-gray-500">
                                    <span>Points: N/A</span>
                                    <span className="ml-4">User: N/A</span>
                                    <span className="ml-4">
                                        Period: N/A
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">
                                    N/A
                                </span>
                                <button
                                    onClick={() => handleChallenge(record)}
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
    );
}