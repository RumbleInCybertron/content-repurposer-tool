'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function HomePage() {
  const searchParams = useSearchParams();
  const [content, setContent] = useState('');
  const [formats, setFormats] = useState<string[]>([]);
  const [response, setResponse] = useState<Record<string, string>>({});
  const [publishStatus, setPublishStatus] = useState<string>('');
  const [authenticatedPlatforms, setAuthenticatedPlatforms] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const status = searchParams.get('status');
    const platform = searchParams.get('platform');
    if (status === 'connected' && platform) {
      setAuthenticatedPlatforms((prev) => [...new Set([...prev, platform])]);
    }

    const savedContent = localStorage.getItem('content');
    const savedFormats = localStorage.getItem('formats');
    if (savedContent) setContent(savedContent);
    if (savedFormats) setFormats(JSON.parse(savedFormats));
  }, [searchParams]);

  useEffect(() => {
    if (!content.trim()) {
      localStorage.removeItem('content');
    } else {
      localStorage.setItem('content', content);
    }
  }, [content]);

  useEffect(() => {
    localStorage.setItem('formats', JSON.stringify(formats));
  }, [formats]);  

  const handleFormatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormats((prev) => {
      const updatedFormats = prev.includes(value)
        ? prev.filter((format) => format !== value)
        : [...prev, value];
      console.log('Updated formats:', updatedFormats); // Debugging log
      return updatedFormats;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isClient) return;

    if (!content.trim()) {
      setErrorMessage('Please enter some content before repurposing.');
      return;
    }

    if (formats.length === 0) {
      setErrorMessage('Please select at least one format.');
      return;
    }

    setErrorMessage(null);

    console.log('Submitting:', { content, formats }); // Debugging log

    try {
      const res = await fetch('/api/repurpose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, formats }),
      });

      if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);

      const data = await res.json();
      console.log('Response from backend:', data); // Debugging log
      setResponse(data.outputs || {});
    } catch (error) {
      console.error('Error:', error);
      setResponse({}); 
    }
  };

  const handlePublish = async (platform: string) => {
    try {
      const res = await fetch(`/api/publish/${platform}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, content: response[platform] }),
      });
      const data = await res.json();
      setPublishStatus(`${platform.charAt(0).toUpperCase() + platform.slice(1)}: ${data.status}`);
    } catch (error) {
      console.error('Error publishing:', error);
      setPublishStatus(`Failed to publish to ${platform}`);
    }
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Content Repurposer</h1>

      {isClient && errorMessage && (
        <div className="mb-4 text-red-600 font-semibold">
          {errorMessage}
        </div>
      )}

      <nav className="bg-gray-800 p-4 text-white">
        <ul className="flex gap-4">
          <li>
            <a href="/" className="hover:underline">Home</a>
          </li>
          <li>
            <a href="/analytics" className="hover:underline">Analytics</a>
          </li>
        </ul>
      </nav>

      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-3 border rounded mb-4 text-slate-900"
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
              checked={formats.includes('linkedin')}
              />
            LinkedIn Post
          </label>
          <label className="block">
            <input
              type="checkbox"
              value="twitter"
              onChange={handleFormatChange}
              checked={formats.includes('twitter')}
              />
            Twitter Post
          </label>
          <label className="block">
            <input
              type="checkbox"
              value="email"
              onChange={handleFormatChange}
              checked={formats.includes('email')}
              />
            Email Draft
          </label>
          <label className="block">
            <input
              type="checkbox"
              value="article"
              onChange={handleFormatChange}
              checked={formats.includes('article')}
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
      
      {response && Object.keys(response).length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Repurposed Content:</h2>
          <ul className="list-disc ml-6">
            {Object.entries(response).map(([format, output]) => (
              <li key={format}>
                <strong>{format}:</strong> {output}

                {!authenticatedPlatforms.includes(format) && (
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => window.location.href = `/api/auth/${format}`}
                  >
                    Connect {format.charAt(0).toUpperCase() + format.slice(1)}
                  </button>
                )}
 
                <button
                  onClick={() => handlePublish(format)}
                  disabled={!response[format] || !authenticatedPlatforms.includes(format)}
                  className={`ml-4 px-3 py-1 rounded ${
                    response[format] && authenticatedPlatforms.includes(format)
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-400 text-gray-700'
                  }`}
                >
                  Publish to {format.charAt(0).toUpperCase() + format.slice(1)}
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
