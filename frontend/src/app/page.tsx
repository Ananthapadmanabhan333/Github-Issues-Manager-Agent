"use client";

import React, { useState, useEffect } from "react";
import { 
  Activity, 
  GitPullRequest, 
  AlertCircle, 
  CheckCircle2, 
  Terminal,
  Cpu
} from "lucide-react";

// Mock data representing the Semantic Bug Universe
const mockIssues = [
  { id: "COG-102", title: "ZeroDivisionError in calculate_velocity", severity: "High", aiStatus: "Fix Generating", cluster: "Metrics UI" },
  { id: "COG-105", title: "OAuth token refresh failing sporadically", severity: "Critical", aiStatus: "RCA Complete", cluster: "Auth" },
  { id: "COG-110", title: "Memory leak in LangGraph worker", severity: "High", aiStatus: "Triaged", cluster: "AI Pipeline" },
];

export default function CognitionDashboard() {
  const [issues, setIssues] = useState(mockIssues);
  const [velocity, setVelocity] = useState(85);

  // Simulate real-time WebSocket updates
  useEffect(() => {
    const timer = setInterval(() => {
      setVelocity((prev) => Math.min(100, prev + Math.floor(Math.random() * 3) - 1));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-sans selection:bg-indigo-500/30">
      
      {/* Header */}
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center space-x-3">
          <Cpu className="text-indigo-400 w-8 h-8" />
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Cognition OS
          </h1>
        </div>
        <div className="flex items-center space-x-4 bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-sm font-medium tracking-wide">AI Agents Online</span>
        </div>
      </header>

      {/* Main Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Semantic Bug Universe */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-rose-400" />
              Semantic Bug Clusters
            </h2>
            <button className="text-sm bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-md hover:bg-indigo-500/20 transition">
              View Graph
            </button>
          </div>

          <div className="bg-slate-900/50 rounded-xl border border-slate-800/60 overflow-hidden backdrop-blur-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 text-sm">
                  <th className="p-4 font-medium">Issue</th>
                  <th className="p-4 font-medium">Cluster</th>
                  <th className="p-4 font-medium">Severity</th>
                  <th className="p-4 font-medium">AI Status</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
                  <tr key={issue.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group cursor-pointer">
                    <td className="p-4">
                      <div className="font-medium text-slate-200">{issue.title}</div>
                      <div className="text-xs text-slate-500 mt-1">{issue.id}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300">
                        {issue.cluster}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                        issue.severity === 'Critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                      }`}>
                        {issue.severity}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2 text-sm text-cyan-400">
                        <Terminal className="w-4 h-4" />
                        <span>{issue.aiStatus}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Productivity Analytics Engine */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold flex items-center">
            <Activity className="w-5 h-5 mr-2 text-emerald-400" />
            Sprint Velocity
          </h2>
          
          <div className="bg-slate-900/50 rounded-xl border border-slate-800/60 p-6 backdrop-blur-sm flex flex-col items-center justify-center h-48 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent"></div>
            <div className="text-5xl font-extrabold text-white tracking-tighter relative z-10">
              {velocity}<span className="text-xl text-slate-400 ml-1 font-normal">pts</span>
            </div>
            <p className="text-sm text-emerald-400 mt-2 font-medium tracking-wide z-10">+12% vs last sprint</p>
          </div>

          <div className="bg-slate-900/50 rounded-xl border border-slate-800/60 p-6 backdrop-blur-sm">
            <h3 className="text-sm font-medium text-slate-400 mb-4">Autonomous Actions (24h)</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2" />
                  Issues Triaged
                </div>
                <span className="font-semibold text-slate-200">142</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm">
                  <GitPullRequest className="w-4 h-4 text-indigo-400 mr-2" />
                  PRs Generated
                </div>
                <span className="font-semibold text-slate-200">18</span>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
