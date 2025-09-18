"use client";

import { useState } from 'react';

const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function AstroArchive() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");

  const handleQuery = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResponse(null);
    setError("");

    try {
      const res = await fetch('http://127.0.0.1:5001/api/inventory/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to communicate with the backend. Is the Python server running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-900 text-white font-sans">
      <div className="w-full max-w-3xl">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Astro Archive
          </h1>
          <p className="text-lg text-gray-400">Autonomous AI Quartermaster</p>
        </header>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-2xl">
          <form onSubmit={handleQuery}>
            <label htmlFor="query" className="block text-sm font-medium text-gray-300 mb-2">
              Enter your query about mission inventory:
            </label>
            <div className="flex gap-2">
              <input
                id="query"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., How many medkits do we have?"
                className="flex-grow bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-900/50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md flex items-center justify-center transition-colors duration-200"
              >
                {isLoading ? <Spinner /> : 'Query'}
              </button>
            </div>
          </form>

          {response && (
             <div className="mt-6 p-4 bg-gray-700/50 border border-gray-600 rounded-lg text-left animate-fade-in">
                <div className={`text-xs font-mono uppercase px-2 py-1 rounded-full mb-3 w-fit ${response.mode.includes('ONLINE') ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                    {response.mode}
                </div>
                <p className="text-gray-300 whitespace-pre-wrap">{response.ai_response}</p>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-left animate-fade-in">
              <h3 className="font-semibold text-red-300 mb-2">Error:</h3>
              <p className="text-gray-300">{error}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}