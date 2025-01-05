import { http } from 'wagmi';
import { optimismSepolia } from 'wagmi/chains';
import { createConfig } from 'wagmi';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not defined');
}

if (!process.env.NEXT_PUBLIC_OPTIMISM_SEPOLIA_RPC) {
  throw new Error('NEXT_PUBLIC_OPTIMISM_SEPOLIA_RPC is not defined');
}

const optimismSepoliaChain = {
  ...optimismSepolia,
  rpcUrls: {
    ...optimismSepolia.rpcUrls,
    default: {
      http: [process.env.NEXT_PUBLIC_OPTIMISM_SEPOLIA_RPC],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_OPTIMISM_SEPOLIA_RPC],
    },
  },
};

export const config = createConfig(
  getDefaultConfig({
    appName: 'Points Record',
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
    chains: [optimismSepoliaChain],
    transports: {
      [optimismSepolia.id]: http(process.env.NEXT_PUBLIC_OPTIMISM_SEPOLIA_RPC),
    },
  }),
); 