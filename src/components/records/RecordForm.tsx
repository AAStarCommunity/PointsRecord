'use client'

import { useState } from 'react';
import { ContributionType } from '@/types';
import { useAccount, usePrepareContractWrite, useContractWrite } from 'wagmi';
import { CONFIG } from '@/config';
import { POINTS_RECORD_ABI } from '@/contracts/PointsRecord';

export function RecordForm() {
  const { address } = useAccount();
  const [records, setRecords] = useState([{
    timestamp: Date.now(),
    contributionType: ContributionType.CODE,
    details: '',
    hours: 1
  }]);

  const { config } = usePrepareContractWrite({
    address: CONFIG.CONTRACT_ADDRESS as `0x${string}`,
    abi: POINTS_RECORD_ABI,
    functionName: 'addRecord',
    args: [records[0].contributionType, records[0].details, records[0].hours],
    enabled: !!address && records[0].details.length > 0,
  })

  const { write: addRecord, isLoading, isSuccess, error } = useContractWrite(config)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      alert('Please connect your wallet first');
      return;
    }

    if (!addRecord) {
      alert('Write function not ready');
      return;
    }

    try {
      // Submit each record to the contract
      for (const record of records) {
        await addRecord();
      }
    } catch (err) {
      console.error('Error submitting records:', err);
      alert('Failed to submit records. Please try again.');
    }
  };

  const addNewRecord = () => {
    setRecords([...records, {
      timestamp: Date.now(),
      contributionType: ContributionType.CODE,
      details: '',
      hours: 1
    }]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {records.map((record, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contribution Type
            </label>
            <select
              value={record.contributionType}
              onChange={(e) => {
                const newRecords = [...records];
                newRecords[index].contributionType = e.target.value as ContributionType;
                setRecords(newRecords);
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              {Object.values(ContributionType).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Details
            </label>
            <textarea
              value={record.details}
              onChange={(e) => {
                const newRecords = [...records];
                newRecords[index].details = e.target.value;
                setRecords(newRecords);
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hours
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={record.hours}
              onChange={(e) => {
                const newRecords = [...records];
                newRecords[index].hours = parseInt(e.target.value);
                setRecords(newRecords);
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
        </div>
      ))}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={addNewRecord}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Add Another Record
        </button>
        <button
          type="submit"
          disabled={isLoading || !address}
          className={`px-4 py-2 bg-blue-500 text-white rounded-md ${
            isLoading || !address ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
        >
          {isLoading ? 'Submitting...' : 'Submit Records'}
        </button>
      </div>

      {error && (
        <div className="text-red-500 mt-2">
          Error: {error.message}
        </div>
      )}
      
      {isSuccess && (
        <div className="text-green-500 mt-2">
          Records submitted successfully!
        </div>
      )}
    </form>
  );
} 