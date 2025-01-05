import { http } from 'wagmi';
import { optimismSepolia } from 'wagmi/chains';
import { createConfig } from 'wagmi';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not defined');
}

if (!process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL) {
  throw new Error('NEXT_PUBLIC_ALCHEMY_RPC_URL is not defined');
}

console.log('Initializing wagmi config with Alchemy URL:', process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL);

const optimismSepoliaChain = {
  ...optimismSepolia,
  rpcUrls: {
    ...optimismSepolia.rpcUrls,
    default: {
      http: [process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL],
    },
  },
};

console.log('Optimism Sepolia Chain Config:', {
  chainId: optimismSepoliaChain.id,
  rpcUrls: optimismSepoliaChain.rpcUrls,
});

export const config = createConfig(
  getDefaultConfig({
    appName: 'Points Record',
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
    chains: [optimismSepoliaChain],
    transports: {
      [optimismSepolia.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL),
    },
  }),
); 