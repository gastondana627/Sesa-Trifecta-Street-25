"use client";

import { useState } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const AppData = {
    astro: {
        title: "🌌 Astro Archive",
        purpose: "A knowledge/archive app for space science, data, or artifacts. Think of it as a repository of cosmic knowledge — cataloging discoveries, references, or even media related to space missions and research.",
        themes: "Exploration + Preservation, Order + Wonder",
        colors: "Deep navy/black, Purple/blue/white gradients, Pale yellow/silver highlights",
        visuals: "Constellations as navigation, Subtle glowing grids, Starlight particles, Futuristic sans-serif fonts (Orbitron, Inter)."
    },
    relic: {
        title: "🗿 Relic",
        purpose: "A tool that focuses on preservation and discovery of artifacts or knowledge (digital or historical). Could connect to storytelling, heritage, or data preservation for future generations.",
        themes: "Ancient meets Futuristic, Mystery + Revelation",
        colors: "Earthy stone/bronze, Emerald green/gold/teal accents, Neon blue/gold highlights",
        visuals: "Glowing artifact/rune, Sci-fi UI on ancient textures, Geometric + serif font blend (Cinzel, Roboto)."
    },
    peata: {
        title: "🐾 Peata",
        purpose: "A community-centered AI companion app (pets, caretaking, or emotional AI). Aims to build connection, empathy, and support between humans and AI (and pets).",
        themes: "Companionship + Playfulness, Community + Care",
        colors: "Soft blues/pastel purples, Bright coral/green/yellow accents",
        visuals: "Rounded shapes (paws, bubbles), Friendly AI mascot, Soft, human-centered sans-serif fonts (Poppins, Nunito)."
    }
};

const marketChartData = {
  labels: ['Agentic AI', 'RAG', 'Real-time Monitoring', 'Digital Twins', 'Data Preservation', 'Human-in-the-Loop'],
  datasets: [
    {
      label: 'Current Systems (Avg)',
      data: [5, 6, 8, 7, 6, 8],
      backgroundColor: 'rgba(100, 116, 139, 0.2)',
      borderColor: 'rgb(100, 116, 139)',
      borderWidth: 1,
    },
    {
      label: 'Trifecta Hub',
      data: [8, 9, 7, 8, 9, 9],
      backgroundColor: 'rgba(79, 70, 229, 0.2)',
      borderColor: 'rgb(79, 70, 229)',
      borderWidth: 2,
    },
  ],
};

export default function TrifectaDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeApp, setActiveApp] = useState('astro');
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [error, setError] = useState("");

  const handleQuery = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setAiResponse(null);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001';
      const res = await fetch(`${apiUrl}/api/inventory/query`, {
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
      setAiResponse(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to communicate with the backend. Is the Python server running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md fixed h-full z-10">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-600 font-serif">Trifecta Hub</h1>
          <p className="text-sm text-slate-500 mt-1 uppercase tracking-widest">Project Command Center</p>
        </div>
        <nav className="mt-4">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'apps', label: 'The Apps', icon: '📱' },
            { id: 'roadmap', label: 'Technical Roadmap', icon: '🗺️' },
            { id: 'market', label: 'Market Context', icon: '🚀' },
            { id: 'gemini', label: 'Gemini Assistant', icon: '🤖' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center py-3 px-6 text-left transition-all duration-200 ${
                activeSection === item.id
                  ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="mr-3">{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8 md:p-12">
        {activeSection === 'dashboard' && (
          <section id="dashboard" className="animate-fade-in">
            <header className="mb-8">
              <h2 className="text-4xl font-bold text-slate-900">Project Dashboard</h2>
              <p className="text-lg text-slate-500 mt-2">A 3-in-1 system unifying three distinct applications under one vision.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-indigo-500 p-6 transform transition hover:-translate-y-2">
                <h3 className="text-2xl font-bold text-indigo-700">🌌 Astro Archive</h3>
                <p className="mt-2 text-slate-600">A cosmic knowledge repository for space science, data, and discoveries. Aims to inspire curiosity through exploration and preservation.</p>
              </div>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-emerald-500 p-6 transform transition hover:-translate-y-2">
                <h3 className="text-2xl font-bold text-emerald-700">🗿 Relic</h3>
                <p className="mt-2 text-slate-600">A tool for preserving and discovering artifacts, blending ancient wisdom with futuristic technology to uncover forgotten knowledge.</p>
              </div>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-rose-500 p-6 transform transition hover:-translate-y-2">
                <h3 className="text-2xl font-bold text-rose-700">🐾 Peata</h3>
                <p className="mt-2 text-slate-600">A community-centered AI companion app designed to build connection, empathy, and support between humans, pets, and AI.</p>
              </div>
            </div>

            <div className="mt-12 bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-6">Core Project Goals</h3>
              <div className="grid gap-4">
                {[
                  { title: "Scale Prototypes", desc: "Demonstrate the ability to grow multiple MVPs into a single, cohesive ecosystem." },
                  { title: "Master Collaboration", desc: "Serve as a sandbox for professional GitHub workflows (branches, PRs, CI/CD)." },
                  { title: "Think Beyond MVP", desc: "Focus on long-term infrastructure, security, and growth, preparing for founding engineer roles." },
                ].map((goal, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-indigo-500 font-bold mr-3 bg-indigo-50 rounded-full h-6 w-6 flex items-center justify-center text-xs">✓</span>
                    <p><strong>{goal.title}:</strong> {goal.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeSection === 'apps' && (
          <section id="apps" className="animate-fade-in">
            <header className="mb-8">
              <h2 className="text-4xl font-bold text-slate-900">The Apps: Identity & Design</h2>
              <p className="text-lg text-slate-500 mt-2">Explore the unique purpose, themes, and visual direction for each application.</p>
            </header>

            <div className="flex justify-center mb-8">
              <div className="flex space-x-2 bg-slate-200 p-1 rounded-lg">
                {Object.keys(AppData).map((appId) => (
                  <button
                    key={appId}
                    onClick={() => setActiveApp(appId)}
                    className={`rounded-md px-4 py-2 font-semibold transition-colors ${
                      activeApp === appId ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {AppData[appId].title.split(' ')[0]} {AppData[appId].title.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg min-h-[300px]">
              <h3 className="text-3xl font-bold mb-6 text-indigo-800">{AppData[activeApp].title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-700">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider text-slate-400">Purpose</h4>
                    <p className="text-lg">{AppData[activeApp].purpose}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider text-slate-400">Themes</h4>
                    <p className="text-lg">{AppData[activeApp].themes}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider text-slate-400">Color Scheme</h4>
                    <p className="text-lg">{AppData[activeApp].colors}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider text-slate-400">Visual Style</h4>
                    <p className="text-lg">{AppData[activeApp].visuals}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'roadmap' && (
            <section id="roadmap" className="animate-fade-in">
                <header className="mb-8">
                    <h2 className="text-4xl font-bold text-slate-900">Technical Roadmap</h2>
                    <p className="text-lg text-slate-500 mt-2">An overview of the project's infrastructure and development workflow.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold mb-4 text-indigo-800">Infrastructure & Integration</h3>
                        <ul className="space-y-3 list-disc list-inside text-slate-600">
                            <li><strong>Current Deployments:</strong> Astro Archive (Streamlit), Relic (Vercel), Peata (Streamlit).</li>
                            <li><strong>Long-Term Vision:</strong> Unify all apps behind a central Next.js landing hub deployed on Vercel for scalability and security.</li>
                            <li><strong>Future Goal:</strong> Consider containerization with Docker for improved portability and consistency.</li>
                        </ul>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold mb-4 text-indigo-800">CI/CD Pipeline</h3>
                         <ul className="space-y-3 list-disc list-inside text-slate-600">
                             <li><strong>Automation:</strong> Implement GitHub Actions for continuous integration.</li>
                             <li><strong>Triggers:</strong> Automatically redeploy applications when changes are detected.</li>
                             <li><strong>Efficiency:</strong> Streamline the deployment process for rapid and reliable updates.</li>
                         </ul>
                    </div>
                </div>

                <div className="mt-12 bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
                    <h3 className="text-2xl font-bold mb-8 text-center text-indigo-800">GitHub Branching Workflow</h3>
                    <div className="flex flex-col items-center space-y-4 w-full max-w-lg">
                        <div className="w-full p-4 border-2 border-green-500 text-green-700 bg-green-50 rounded-lg text-center font-bold">main (Production)</div>
                        <div className="h-8 w-1 bg-slate-300 relative">
                             <div className="absolute -bottom-1 -left-[3px] border-t-4 border-x-4 border-x-transparent border-t-slate-300"></div>
                        </div>
                        <div className="w-full p-4 border-2 border-blue-500 text-blue-700 bg-blue-50 rounded-lg text-center font-bold">develop (Staging)</div>
                        <div className="h-8 w-1 bg-slate-300 relative">
                             <div className="absolute -bottom-1 -left-[3px] border-t-4 border-x-4 border-x-transparent border-t-slate-300"></div>
                        </div>
                        <div className="flex gap-4 w-full">
                            <div className="flex-1 p-4 border-2 border-purple-500 text-purple-700 bg-purple-50 rounded-lg text-center font-bold text-sm">feature/*</div>
                            <div className="flex-1 p-4 border-2 border-red-500 text-red-700 bg-red-50 rounded-lg text-center font-bold text-sm">hotfix/*</div>
                        </div>
                    </div>
                    <p className="text-center mt-8 text-slate-500 max-w-md">Feature branches are merged into develop via Pull Request. After successful staging, develop is merged into main for production release.</p>
                </div>
            </section>
        )}

        {activeSection === 'market' && (
            <section id="market" className="animate-fade-in">
                <header className="mb-8">
                    <h2 className="text-4xl font-bold text-slate-900">Market Context</h2>
                    <p className="text-lg text-slate-500 mt-2">Analyzing the comparative AI capabilities and market opportunity.</p>
                </header>

                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold mb-8 text-center text-indigo-800">Comparative AI Capabilities</h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="h-[400px]">
                            <Radar
                              data={marketChartData}
                              options={{
                                maintainAspectRatio: false,
                                scales: {
                                  r: {
                                    beginAtZero: true,
                                    max: 10,
                                    ticks: { stepSize: 2 }
                                  }
                                }
                              }}
                            />
                        </div>
                        <div className="space-y-6 bg-slate-50 p-8 rounded-2xl">
                            <h4 className="font-bold text-slate-800 text-xl border-b pb-2 border-slate-200">Opportunity Analysis</h4>
                            <p className="text-slate-600 leading-relaxed italic">
                                "The intersection of high-fidelity data preservation (Relic) and autonomous mission assistance (Astro Archive) represents a critical growth area for next-generation space exploration software, particularly when augmented by community-driven emotional support (Peata)."
                            </p>
                            <div className="pt-4">
                                <h5 className="font-bold text-indigo-600 text-sm uppercase tracking-widest mb-2">Key Differentiator</h5>
                                <p className="text-slate-500 text-sm">Integration of Agentic RAG across three distinct mission domains: Knowledge, Heritage, and Emotion.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )}

        {activeSection === 'gemini' && (
          <section id="gemini" className="animate-fade-in">
            <header className="mb-8">
              <h2 className="text-4xl font-bold text-slate-900">Gemini Assistant</h2>
              <p className="text-lg text-slate-500 mt-2">AI-powered project strategy and mission inventory query.</p>
            </header>

            <div className="bg-white rounded-lg shadow-xl overflow-hidden flex flex-col h-[600px] border border-slate-200">
              <div className="flex-1 p-6 overflow-y-auto bg-slate-50 space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 self-start max-w-[80%]">
                    Hello! I'm your Gemini Assistant. I can help you with project strategy or answer questions about our mission inventory.
                </div>
                {aiResponse && (
                    <div className="flex flex-col space-y-2">
                        <div className="bg-indigo-600 text-white p-4 rounded-lg shadow-md self-end max-w-[80%]">
                            {aiResponse.user_query}
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 self-start max-w-[80%]">
                            <div className={`text-xs font-mono uppercase px-2 py-1 rounded-full mb-2 w-fit ${aiResponse.mode.includes('ONLINE') ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {aiResponse.mode}
                            </div>
                            <p className="whitespace-pre-wrap">{aiResponse.ai_response}</p>
                        </div>
                    </div>
                )}
                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-100 self-start max-w-[80%]">
                        {error}
                    </div>
                )}
              </div>

              <div className="p-4 bg-white border-t border-slate-200">
                <form onSubmit={handleQuery} className="flex gap-4">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask about mission inventory or project strategy..."
                    className="flex-grow border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !query.trim()}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors flex items-center gap-2"
                  >
                    {isLoading ? <Spinner /> : 'Send'}
                  </button>
                </form>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
