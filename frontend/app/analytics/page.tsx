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
  const [sortColumn, setSortColumn] = useState<keyof AnalyticsItem | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
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

      const wordCounts = analytics.map((item) => item.wordCount);
      const engagementScores = analytics.map((item) => item.engagementScore);

      try {
        const model = await trainModel({ x: wordCounts, y: engagementScores });
        // TODO rm hardcoding
        const futureWordCounts = [200, 400, 600, 800, 1000]; // Example future data
        const predictedEngagements = await predict(model, futureWordCounts);

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

  const handleSort = (column: keyof AnalyticsItem) => {
    setSortOrder((prev) => (sortColumn === column && prev === 'asc' ? 'desc' : 'asc'));
    setSortColumn(column);
  };

  const sortedAnalytics = [...analytics].sort((a, b) => {
    if (!sortColumn) return 0;
    const order = sortOrder === 'asc' ? 1 : -1;
    return a[sortColumn] > b[sortColumn] ? order : -order;
  });

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
    <main className="p-6 bg-neutral-light dark:bg-neutral-dark transition-all">
      <h1 className="text-3xl font-bold mb-6 text-primary dark:text-secondary">
        Content Analytics
      </h1>

      {/* Export Button */}
      <button
        onClick={handleExportCSV}
        className="bg-secondary text-primary px-4 py-2 rounded mb-4"
      >
        Export as CSV
      </button>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Line Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 shadow-md rounded transition-all">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Word Count Trends
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={lineData}
              margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
              <XAxis
                dataKey="name"
                stroke="currentColor"
                className="text-gray-800 dark:text-gray-200"
              />
              <YAxis
                stroke="currentColor"
                className="text-gray-800 dark:text-gray-200"
              />
              <Tooltip contentStyle={{ background: '#2d2d2d', color: '#fff' }} />
              <Line type="monotone" dataKey="wordCount" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement Predictions */}
        <div className="bg-white dark:bg-gray-800 p-4 shadow-md rounded transition-all">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Engagement Predictions
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={predictions.map((item) => ({
                name: item.format,
                current: item.currentEngagement || 0,
                predicted: !isNaN(item.predictedEngagement) ? item.predictedEngagement : 0,
              }))}
              margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
              <XAxis
                dataKey="name"
                stroke="currentColor"
                className="text-gray-800 dark:text-gray-200"
              />
              <YAxis
                stroke="currentColor"
                className="text-gray-800 dark:text-gray-200"
              />
              <Tooltip contentStyle={{ background: '#2d2d2d', color: '#fff' }} />
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
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 shadow-md rounded transition-all">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Engagement Scores by Format
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table Section */}
      <section className="bg-white dark:bg-gray-800 p-6 shadow-md rounded transition-all">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Detailed Insights
        </h2>
        <table className="w-full border-collapse border border-gray-300 text-left">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th 
                className="cursor-pointer border border-gray-300 p-2"
                onClick={() => handleSort('format')}
              >
                Format
                {sortColumn === 'format' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
              </th>
              <th 
                className="cursor-pointer border border-gray-300 p-2"
                onClick={() => handleSort('wordCount')}
              >
                Word Count
                {sortColumn === 'wordCount' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
              </th>
              <th 
                className="cursor-pointer border border-gray-300 p-2"
                onClick={() => handleSort('engagementScore')}
              >
                Engagement Score
                {sortColumn === 'engagementScore' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
              </th>
              <th 
                className="cursor-pointer border border-gray-300 p-2"
                onClick={() => handleSort('readabilityScore')}
              >
                Readability Score
                {sortColumn === 'readabilityScore' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
              </th>
              <th 
                className="cursor-pointer border border-gray-300 p-2"
                onClick={() => handleSort('tone')}
              >
                Tone
                {sortColumn === 'tone' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
              </th>
              <th 
                className="cursor-pointer border border-gray-300 p-2"
                onClick={() => handleSort('sentiment')}
              >
                Sentiment
                {sortColumn === 'sentiment' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
              </th>
              <th 
                className="cursor-pointer border border-gray-300 p-2"
                onClick={() => handleSort('keyTopics')}
              >
                Key Topics
                {sortColumn === 'keyTopics' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
              </th>
              <th 
                className="cursor-pointer border border-gray-300 p-2"
                onClick={() => handleSort('suggestions')}
              >
                Suggestions
                {sortColumn === 'suggestions' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedAnalytics.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
              >
                <td className="border border-gray-300 p-2">{item.format}</td>
                <td className="border border-gray-300 p-2">{item.wordCount}</td>
                <td className="border border-gray-300 p-2">{item.engagementScore}</td>
                <td className="border border-gray-300 p-2">
                  {item.readabilityScore} ({getReadabilityLabel(item.readabilityScore)})
                </td>
                <td className="border border-gray-300 p-2">{item.tone}</td>
                <td className="border border-gray-300 p-2">{item.sentiment}</td>
                <td className="border border-gray-300 p-2">{item.keyTopics.join(', ')}</td>
                <td className="border border-gray-300 p-2">{item.suggestions.join('; ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
