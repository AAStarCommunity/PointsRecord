import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Points Record',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '', // 从 WalletConnect Cloud 获取
  chains: [mainnet, sepolia],
  ssr: true,
});