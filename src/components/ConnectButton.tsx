'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from '@wagmi/core/connectors/injected'

export function ConnectButton() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()

  if (isConnected)
    return (
      <div>
        <div className="text-sm text-gray-700">Connected to {address?.slice(0, 6)}...{address?.slice(-4)}</div>
        <button 
          type="button"
          onClick={() => disconnect()}
          className="text-sm text-red-500 hover:text-red-700"
        >
          Disconnect
        </button>
      </div>
    )

  return (
    <button
      type="button"
      onClick={() => connect()}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    >
      Connect Wallet
    </button>
  )
} 