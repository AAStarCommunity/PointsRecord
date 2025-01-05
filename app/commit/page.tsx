'use client';

import { useEffect } from 'react';
import CommitPointsForm from '../../components/commit-points-form';
import { useRouter } from 'next/navigation';

export default function CommitPage() {
  const router = useRouter();
  
  useEffect(() => {
    // 添加检查日志
    console.log('Commit page loaded, checking Alchemy URL:', {
      alchemyUrl: process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL,
      contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    });
  }, []);

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#1F0054] to-black">
      <CommitPointsForm onBack={handleBack} />
    </div>
  );
} 