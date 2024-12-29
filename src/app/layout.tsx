// layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import { WagmiProvider } from '@/components/providers/WagmiProvider'
import { ConnectButton } from '@/components/ConnectButton'
import {
  HomeIcon,
  UserGroupIcon,
  DocumentPlusIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/solid'

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
      <body className={`${inter.className} bg-gray-100`}>
        <WagmiProvider>
          <div className="min-h-screen flex flex-col">
            <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center">
                    <Link
                      href="/"
                      className="text-white text-xl font-bold flex items-center space-x-2"
                    >
                      <DocumentPlusIcon
                        className="inline-block"
                        style={{ width: '1.5rem', height: '1.5rem' }}
                      />
                      <span>社区贡献</span>
                    </Link>
                    <div className="ml-6 flex items-baseline space-x-4">
                      <Link
                        href="/records" // 新的记录页面路径
                        className="text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                      >
                        <HomeIcon
                          className="inline-block mr-1"
                          style={{ width: '1rem', height: '1rem' }}
                        />
                        提交记录
                      </Link>
                      <Link
                        href="/members"
                        className="text-white hover:bg-purple-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                      >
                        <UserGroupIcon
                          className="inline-block mr-1"
                          style={{ width: '1rem', height: '1rem' }}
                        />
                        社区成员
                      </Link>
                      <Link
                        href="/admin"
                        className="text-white hover:bg-red-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                      >
                        <ShieldCheckIcon
                          className="inline-block mr-1"
                          style={{ width: '1rem', height: '1rem' }}
                        />
                        管理员
                      </Link>
                    </div>
                  </div>
                  <div>
                    <ConnectButton />
                  </div>
                </div>
              </div>
            </nav>

            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>

            <footer className="bg-gray-800 text-white py-4 text-center">
              <p>© 2024 社区贡献记录 | 基于区块链技术</p>
            </footer>
          </div>
        </WagmiProvider>
      </body>
    </html>
  )
}