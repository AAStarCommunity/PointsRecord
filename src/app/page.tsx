import { RecordForm } from '@/components/records/RecordForm'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Points Record</h1>
      <RecordForm />
    </main>
  )
} 