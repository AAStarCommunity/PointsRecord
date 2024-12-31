'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import CommitPointsForm from '@/components/commit-points-form';
import toast from 'react-hot-toast';

export default function Home() {
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [showCommitForm, setShowCommitForm] = useState(false);
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

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

  useEffect(() => {
    if (isConnected && pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [isConnected, pendingAction]);

  // 如果显示提交表单，渲染表单
  if (showCommitForm) {
    return <CommitPointsForm onBack={() => setShowCommitForm(false)} />;
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="text-4xl font-bold text-center text-white mb-6 tracking-tight">
          Points Record of AAStar Community
        </div>
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
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

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleCommitNow}
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Commit now
          </a><a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            View or Challenge
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
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
          />
          Github
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
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
          />
          Go to AAStar.io →
        </a>
      </footer>
    </div>
  );
}
