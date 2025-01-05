'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import toast from 'react-hot-toast';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect, useChainId } from 'wagmi';
import CommitPointsForm from '@/components/commit-points-form';
import RecordsView from '@/components/records-view';
import { useColorStore } from '../store/color-store';
import { create } from 'zustand';
import { useRouter } from 'next/navigation';

// 辅助函数：将 RGB 转换为十六进制
const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (n: number) => {
    const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// 修改颜色生成函数，返回十六进制格式
const getRandomColor = (isRed: boolean) => {
  const baseColor = isRed ? [255, 0, 0] : [0, 255, 0];
  const variance = 50;
  
  const color = baseColor.map((c, i) => {
    if (c === 0) {
      return Math.max(0, Math.min(255, Math.floor(Math.random() * variance)));
    }
    return Math.max(0, Math.min(255, c - Math.floor(Math.random() * variance)));
  });
  
  return rgbToHex(color[0], color[1], color[2]);
};

// 初始颜色使用十六进制格式
const initialColors = {
  from: '#ff0000',  // 红色
  to: '#00ff00'     // 绿色
};

interface ColorStore {
  bgColorFrom: string;
  bgColorTo: string;
  setBgColors: (from: string, to: string) => void;
}

export const useColorStore = create<ColorStore>((set) => ({
  bgColorFrom: initialColors.from,
  bgColorTo: initialColors.to,
  setBgColors: (from, to) => set({ bgColorFrom: from, bgColorTo: to }),
}));

export default function Home() {
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [showCommitForm, setShowCommitForm] = useState(false);
  const [showViewForm, setShowViewForm] = useState(false);
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { bgColorFrom, bgColorTo, setBgColors } = useColorStore();
  const router = useRouter();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleWalletAction = () => {
    if (!isConnected) {
      openConnectModal?.();
    } else {
      toast.custom((t) => (
        <div className={`
          ${t.visible ? 'animate-enter' : 'animate-leave'}
          max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 transition-all duration-300 ease-in-out
        `}>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-center">
              <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm text-gray-500">
                  Are you sure you want to disconnect?
                </p>
              </div>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                onClick={() => {
                  disconnect();
                  toast.dismiss(t.id);
                }}
                className="bg-red-500 text-white px-3 py-2 rounded mr-2 text-sm"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  toast.remove(t.id);
                }}
                className="bg-gray-200 text-black px-3 py-2 rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ), {
        duration: Infinity,
        position: 'top-center',
      });
    }
  };

  const handleCommitNow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isConnected) {
      setPendingAction(() => () => {
        setShowCommitForm(true);
      });

      openConnectModal?.();
    } else {
      setShowCommitForm(true);
    }
  };

  const handleView = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isConnected) {
      setPendingAction(() => () => {
        setShowViewForm(true);
      });

      openConnectModal?.();
    } else {
      setShowViewForm(true);
    }
  };

  useEffect(() => {
    if (isConnected && pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [isConnected, pendingAction]);

  useEffect(() => {
    // Set initial random colors
    setBgColors(getRandomColor(true), getRandomColor(false));
  }, []);

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

  // 如果显示提交表单，渲染表单
  if (showCommitForm) {
    return <CommitPointsForm onBack={() => setShowCommitForm(false)} />;
  }

  if (showViewForm) {
    return <RecordsView onBack={() => setShowViewForm(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#1F0054] to-black">
      {/* Color pickers, network and wallet address */}
      <div className="fixed top-4 right-4 flex gap-4 z-10">
        {chainId && (
          <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white">
            {getChainName(chainId)}
          </div>
        )}
        {isConnected && address && (
          <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white">
            {formatAddress(address)}
          </div>
        )}
        <input 
          type="color" 
          value={bgColorFrom}
          onChange={(e) => setBgColors(e.target.value, bgColorTo)}
          className="w-8 h-8 rounded cursor-pointer"
          title="From Color"
        />
        <input 
          type="color" 
          value={bgColorTo}
          onChange={(e) => setBgColors(bgColorFrom, e.target.value)}
          className="w-8 h-8 rounded cursor-pointer"
          title="To Color"
        />
      </div>

      {/* Main content */}
      <div 
        className="min-h-screen"
        style={{
          background: `linear-gradient(135deg, ${bgColorFrom}, ${bgColorTo})`,
        }}
      >
        <div className="grid grid-rows-[1fr_auto] min-h-screen">
          <main className="flex flex-col items-center justify-center p-8 sm:p-20">
            <div className="max-w-2xl w-full mx-auto text-center">
              <div className="text-4xl font-bold text-white mb-6 tracking-tight">
                Points Record of AAStar Community
              </div>
              
              {/* Add authorization notice */}
              <div className="text-white bg-black/20 backdrop-blur-sm rounded-lg p-4 mb-8">
                ⚠️ You must submit your wallet address to DavidXu and authorize first.
              </div>

              <ol className="list-inside list-decimal text-sm font-[family-name:var(--font-geist-mono)] mb-8">
                <li className="mb-2">
                  <span
                    onClick={handleWalletAction}
                    className={`${isConnected ? 'cursor-pointer hover:underline' : 'cursor-pointer hover:underline'}`}
                  >
                    {isConnected && address ? formatAddress(address) : 'Connect Wallet'}
                  </span>
                </li>
                <li className="mb-2">Points Commit</li>
                <li>View or challenge</li>
              </ol>

              <div className="flex gap-4 items-center justify-center">
                <button
                  onClick={() => router.push('/commit')}
                  className="px-6 py-3 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-all"
                >
                  Commit Now
                </button>
                <a
                  className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
                  href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleView}
                >
                  View or Challenge
                </a>
              </div>
            </div>
          </main>

          <footer className="w-full bg-transparent py-6 px-8">
            <div className="container mx-auto flex justify-center gap-6 flex-wrap items-center">
              <a
                className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-white"
                href="https://github.com/orgs/AAStarCommunity/repositories"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  aria-hidden
                  src="/file.svg"
                  alt="File icon"
                  width={16}
                  height={16}
                  className="invert"
                />
                Github
              </a>
              <a
                className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-white"
                href="https://aastar.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  aria-hidden
                  src="/globe.svg"
                  alt="Globe icon"
                  width={16}
                  height={16}
                  className="invert"
                />
                Go to AAStar.io →
              </a>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
