import { http, createConfig } from 'wagmi'
import { optimismSepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const wagmiConfig = createConfig({
  chains: [optimismSepolia],
  connectors: [
    injected(),
  ],
  transports: {
    [optimismSepolia.id]: http(process.env.NEXT_PUBLIC_OPTIMISM_SEPOLIA_RPC),
  },
}) 