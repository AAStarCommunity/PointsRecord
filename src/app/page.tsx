import { ConnectButton } from '@/components/ConnectButton'
import { RecordForm } from '@/components/records/RecordForm'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Points Record</h1>
        <ConnectButton />
      </div>
      <RecordForm />
    </main>
  )
} 