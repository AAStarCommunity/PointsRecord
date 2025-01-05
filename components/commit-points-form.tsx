'use client';

import { useColorStore } from '@/app/page';

export default function CommitPointsForm({ onBack }: { onBack: () => void }) {
  const { bgColorFrom, bgColorTo } = useColorStore();

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
              onClick={onBack}
              className="text-white hover:text-gray-200"
            >
              Back
            </button>
          </div>
          
          {/* Your form content here */}
          <form className="space-y-4">
            {/* Add your form fields here */}
          </form>
        </div>
      </div>
    </div>
  );
} 