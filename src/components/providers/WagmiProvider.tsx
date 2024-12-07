'use client'

import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { optimismSepolia } from '@wagmi/core/chains'
import { InjectedConnector } from '@wagmi/core/connectors/injected'
import { publicProvider } from '@wagmi/core/providers/public'
import { alchemyProvider } from '@wagmi/core/providers/alchemy'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [optimismSepolia],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '' }),
    publicProvider(),
  ],
)

const config = createConfig({
  autoConnect: true,
  connectors: [
    new InjectedConnector({ chains }),
  ],
  publicClient,
  webSocketPublicClient,
})

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>
} 