'use client'

import { useState } from 'react';
import { ContributionType } from '@/types';

export function RecordForm() {
  const [records, setRecords] = useState([{
    timestamp: Date.now(),
    contributionType: ContributionType.CODE,
    details: '',
    hours: 1
  }]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle form submission
    console.log('Form submitted:', records);
  };

  const addRecord = () => {
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
            />
          </div>
        </div>
      ))}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={addRecord}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Add Another Record
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Submit Records
        </button>
      </div>
    </form>
  );
} 