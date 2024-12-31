import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from '@wagmi/core';
import { mainnet, sepolia, optimismSepolia } from 'wagmi/chains';

const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

export const config = getDefaultConfig({
  appName: 'Points Record',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '', // 从 WalletConnect Cloud 获取
  chains: [mainnet, sepolia, optimismSepolia],
  transports: {
    [optimismSepolia.id]: http(`https://opt-sepolia.g.alchemy.com/v2/${alchemyApiKey}`),
  },
  ssr: true,
});