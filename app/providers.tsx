'use client';

import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiConfig } from 'wagmi';
import { config } from '@/app/config/wagmi';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider>
        {children}
        <Toaster position="top-center" />
      </RainbowKitProvider>
    </WagmiConfig>
  );
} 