'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { trainModel, predict } from '../../utils/predictionModel';

interface AnalyticsItem {
  format: string;
  wordCount: number;
  engagementScore: number;
  readabilityScore: number;
  tone: string;
  sentiment: string;
  keyTopics: string[];
  suggestions: string[];
}

interface Prediction {
  format: string;
  currentEngagement: number;
  predictedEngagement: number;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsItem[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch('/api/analytics');
        if (!res.ok) throw new Error('Failed to fetch analytics');
        const data: AnalyticsItem[] = await res.json();
        setAnalytics(data);
      } catch (e) {
        console.error(e);
      }
    }

    fetchAnalytics();

    const intervalId = setInterval(fetchAnalytics, 10000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    async function generatePredictions() {
      if (analytics.length === 0) return;

      const mockData = generateMockData(100);
      const wordCounts = analytics.map((item) => item.wordCount);
      const engagementScores = analytics.map((item) => item.engagementScore);

      try {
        const model = await trainModel({ x: wordCounts, y: engagementScores });
        // TODO rm hardcoding
        const futureWordCounts = [200, 400, 600, 800, 1000]; // Example future data
        const predictedEngagements = await predict(model, futureWordCounts);

        console.log('Future Word Counts:', futureWordCounts);
        console.log('Predicted Engagements:', predictedEngagements);
        
        setPredictions(
          futureWordCounts.map((wordCount, idx) => ({
            format: `Future Format ${idx + 1}`,
            currentEngagement: Math.floor(Math.random() * 100), // Random mock current engagement
            predictedEngagement: !isNaN(predictedEngagements[idx]) ? predictedEngagements[idx] : 0,
          }))
        );
      } catch (e) {
        console.error('Error generating predictions:', e);
      }
    }

    generatePredictions();
  }, [analytics]);

  const pieData = analytics.map((item) => ({
    name: item.format,
    value: item.engagementScore,
  }));

  const lineData = analytics.map((item) => ({
    name: item.format,
    wordCount: item.wordCount,
  }));

  const handleExportCSV = () => {
    const escapeCSV = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Format,Word Count,Engagement Score,Readability Score,Tone,Sentimental Analysis,Keyword Analysis,Suggestions']
        .concat(
          analytics.map(
            (item) =>
              `${item.format},${item.wordCount},${item.engagementScore},${item.readabilityScore},${escapeCSV(item.tone)},${escapeCSV(item.sentiment)},${escapeCSV(item.keyTopics.join(', '))},${escapeCSV(item.suggestions.join('; '))}`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'content_analytics.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getReadabilityLabel = (score: number) => {
    if (score >= 80) return 'Easy';
    if (score >= 50) return 'Medium';
    return 'Difficult';
  };

  const generateMockData = (count: number) => {
    const mockData = [];
    for (let i = 0; i < count; i++) {
      const wordCount = Math.floor(Math.random() * 1000);
      const engagementScore = Math.floor(wordCount * 0.1 + Math.random() * 20);
      mockData.push({ wordCount, engagementScore });
    }
    return mockData;
  };
  

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Content Analytics</h1>

      {/* Export Button */}
      <button
        onClick={handleExportCSV}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Export as CSV
      </button>

      {/* Line Chart */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Word Count Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={lineData}
            margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="wordCount" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* Predictions Chart */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Engagement Predictions</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={predictions.map((item) => ({
              name: item.format,
              current: item.currentEngagement ||0,
              predicted: !isNaN(item.predictedEngagement) ? item.predictedEngagement : 0,
            }))}
            margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `${value}`} />
            <Line type="monotone" dataKey="current" stroke="#8884d8" name="Current" />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#82ca9d"
              name="Predicted"
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* Pie/Doughnut Chart */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Engagement Scores by Format</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={({ value, percent }) => `${value}: ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </section>

      {/* Bar Chart */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Engagement Scores by Format</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={analytics}
            margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="format" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="engagementScore" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Detailed Insights */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Detailed Insights</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Format</th>
              <th className="border border-gray-300 p-2">Word Count</th>
              <th className="border border-gray-300 p-2">Engagement Score</th>
              <th className="border border-gray-300 p-2">Readability Score</th>
              <th className="border border-gray-300 p-2">Tone</th>
              <th className="border border-gray-300 p-2">Sentiment</th>
              <th className="border border-gray-300 p-2">Key Topics</th>
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
                  {item.readabilityScore} ({getReadabilityLabel(item.readabilityScore)})
                </td>
                <td className="border border-gray-300 p-2">{item.tone}</td>
                <td className="border border-gray-300 p-2">{item.sentiment}</td>
                <td className="border border-gray-300 p-2">
                  <ul>
                    {item.keyTopics.length > 0
                      ? item.keyTopics.map((keyTopic, idx) => (
                          <li key={idx} className="mb-2">{keyTopic}</li>
                        ))
                      : <li>None</li>}
                  </ul>
                </td>            
                <td className="border border-gray-300 p-2">
                  <ul className="list-disc ml-4">
                    {item.suggestions.length > 0
                      ? item.suggestions.map((suggestion, idx) => (
                          <li key={idx}>{suggestion}</li>
                        ))
                      : <li>None</li>}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
