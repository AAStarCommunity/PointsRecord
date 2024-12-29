'use client';

import { RecordForm } from '@/components/records/RecordForm';

export default function RecordsPage() {
  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              提交工作记录
            </h1>
          </div>
          
          <div className="space-y-6">
            <p className="text-gray-600">
              作为社区成员，您可以在此提交您的贡献记录。
              请提供工作详情，包括贡献类型、具体描述和所花费的时间。
            </p>
            
            <RecordForm />
          </div>
        </div>
      </div>
    </main>
  );
}