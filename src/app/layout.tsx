import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { WagmiProvider } from '@/components/providers/WagmiProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '社区贡献记录',
  description: '在链上记录社区成员的月度贡献',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <WagmiProvider>
          {children}
        </WagmiProvider>
      </body>
    </html>
  )
}