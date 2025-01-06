'use client';

import CommitPointsForm from '@/components/commit-points-form';
import { useRouter } from 'next/navigation';

export default function CommitPage() {
  const router = useRouter();
  
  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <CommitPointsForm onBack={handleBack} />
    </div>
  );
} 