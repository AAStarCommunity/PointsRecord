'use client';

import CommitPointsForm from '../../components/commit-points-form';
import { useRouter } from 'next/navigation';

export default function CommitPage() {
  const router = useRouter();
  
  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#1F0054] to-black">
      <CommitPointsForm onBack={handleBack} />
    </div>
  );
} 