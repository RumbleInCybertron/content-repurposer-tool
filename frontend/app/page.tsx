'use client';

import { useState } from 'react';

export default function HomePage() {
  const [content, setContent] = useState('');
  const [formats, setFormats] = useState<string[]>([]);
  const [response, setResponse] = useState<Record<string, string>>({});
  const [publishStatus, setPublishStatus] = useState<string>('');

  const handleFormatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormats((prev) =>
      prev.includes(value)
        ? prev.filter((format) => format !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/repurpose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, formats }),
    });
    const data = await res.json();
    setResponse(data.outputs);
  };

  const handlePublish = async (format: string) => {
    const res = await fetch('/api/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ format, content: response[format] }),
    });
    const data = await res.json();
    setPublishStatus(data.status);
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Content Repurposer</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-3 border rounded mb-4"
          placeholder="Paste your content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <fieldset className="mb-4">
          <legend className="font-semibold mb-2">Select Output Formats:</legend>
          <label className="block">
            <input
              type="checkbox"
              value="linkedin"
              onChange={handleFormatChange}
            />
            LinkedIn Post
          </label>
          <label className="block">
            <input
              type="checkbox"
              value="email"
              onChange={handleFormatChange}
            />
            Email Draft
          </label>
          <label className="block">
            <input
              type="checkbox"
              value="article"
              onChange={handleFormatChange}
            />
            Short-Form Article
          </label>
        </fieldset>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Repurpose Content
        </button>
      </form>
      {Object.keys(response).length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Repurposed Content:</h2>
          <ul className="list-disc ml-6">
            {Object.entries(response).map(([format, output]) => (
              <li key={format}>
                <strong>{format}:</strong> {output}
                <button
                  onClick={() => handlePublish(format)}
                  className="ml-4 bg-green-500 text-white px-3 py-1 rounded"
                >
                  Publish to LinkedIn
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {publishStatus && (
        <div className="mt-6 text-green-600 font-semibold">
          {publishStatus}
        </div>
      )}
    </main>
  );
}
