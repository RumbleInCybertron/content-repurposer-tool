'use client';

import { useEffect, useState } from 'react';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState([]);

  useEffect(() => {
    async function fetchAnalytics() {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      setAnalytics(data);
    }
    fetchAnalytics();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Content Analytics</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Format</th>
            <th className="border border-gray-300 p-2">Word Count</th>
            <th className="border border-gray-300 p-2">Engagement Score</th>
            <th className="border border-gray-300 p-2">Suggestions</th>
          </tr>
        </thead>
        <tbody>
          {analytics.map((item, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">{item.format}</td>
              <td className="border border-gray-300 p-2">{item.wordCount}</td>
              <td className="border border-gray-300 p-2">{item.engagementScore}</td>
              <td className="border border-gray-300 p-2">
                <ul className="list-disc ml-4">
                  {item.suggestions.map((suggestion, idx) => (
                    <li key={idx}>{suggestion}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
