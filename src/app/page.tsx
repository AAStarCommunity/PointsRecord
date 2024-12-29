'use client';

import Link from 'next/link';
import { 
  DocumentPlusIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  InformationCircleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/solid';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            社区贡献追踪平台
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            记录、验证和激励社区成员的贡献，通过区块链技术实现透明和公正
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link 
            href="/records" 
            className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-all group"
          >
            <DocumentPlusIcon 
              className="inline-block" 
              style={{ width: '3rem', height: '3rem' }} 
              color="text-blue-500 mb-4 group-hover:scale-110 transition-transform" 
            />
            <h2 className="text-xl font-semibold mb-2">提交记录</h2>
            <p className="text-gray-600">记录您的社区贡献和工作时间</p>
          </Link>

          <Link 
            href="/members" 
            className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-all group"
          >
            <UserGroupIcon 
              className="inline-block" 
              style={{ width: '3rem', height: '3rem' }} 
              color="text-green-500 mb-4 group-hover:scale-110 transition-transform" 
            />
            <h2 className="text-xl font-semibold mb-2">社区成员</h2>
            <p className="text-gray-600">查看所有社区成员的贡献情况</p>
          </Link>

          <Link 
            href="/admin" 
            className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-all group"
          >
            <ShieldCheckIcon 
              className="inline-block" 
              style={{ width: '3rem', height: '3rem' }} 
              color="text-red-500 mb-4 group-hover:scale-110 transition-transform" 
            />
            <h2 className="text-xl font-semibold mb-2">管理员</h2>
            <p className="text-gray-600">仲裁挑战、管理成员和权限</p>
          </Link>

          <div 
            className="bg-white shadow-lg rounded-lg p-6 opacity-50 cursor-not-allowed"
          >
            <ChartBarIcon 
              className="inline-block" 
              style={{ width: '3rem', height: '3rem' }} 
              color="text-purple-500 mb-4" 
            />
            <h2 className="text-xl font-semibold mb-2">统计报告</h2>
            <p className="text-gray-600">即将推出：社区贡献统计</p>
          </div>

          <div 
            className="bg-white shadow-lg rounded-lg p-6 opacity-50 cursor-not-allowed"
          >
            <InformationCircleIcon 
              className="inline-block" 
              style={{ width: '3rem', height: '3rem' }} 
              color="text-orange-500 mb-4" 
            />
            <h2 className="text-xl font-semibold mb-2">关于项目</h2>
            <p className="text-gray-600">了解我们的社区贡献追踪项目</p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500">
            通过区块链技术，我们致力于创建一个公平、透明的社区贡献评价系统
          </p>
        </div>
      </div>
    </div>
  );
}