'use client';

import { useColorStore } from '@/app/page';
import { useChainId } from 'wagmi';

export default function SubmitPointsRecord({ onBack }: { onBack: () => void }) {
  const { bgColorFrom, bgColorTo } = useColorStore();
  const chainId = useChainId();

  // 获取链名称的辅助函数
  const getChainName = (chainId: number) => {
    switch (chainId) {
      case 1:
        return 'Ethereum Mainnet';
      case 11155111:
        return 'Sepolia';
      default:
        return `Chain ${chainId}`;
    }
  };

  return (
    <div 
      className="min-h-screen"
      style={{
        background: `linear-gradient(135deg, ${bgColorFrom}, ${bgColorTo})`
      }}
    >
      {/* Network display */}
      <div className="fixed top-4 right-4 z-10">
        {chainId && (
          <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white">
            {getChainName(chainId)}
          </div>
        )}
      </div>

      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Submit Points Record</h2>
            <button 
              onClick={onBack}
              className="text-white hover:text-gray-200"
            >
              Back
            </button>
          </div>
          
          <form className="space-y-4">
            {/* Your existing form fields */}
            <div className="space-y-2">
              <label className="block text-white">Points Amount</label>
              <input 
                type="number" 
                className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-white/60"
                placeholder="Enter points amount"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-white">Description</label>
              <textarea 
                className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-white/60"
                placeholder="Enter description"
                rows={4}
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 