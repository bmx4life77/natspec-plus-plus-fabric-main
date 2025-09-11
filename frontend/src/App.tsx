import React from "react";
import { TagExplorer } from "./components/TagExplorer";
import { MethodInspector } from "./components/MethodInspector";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-sm p-6">
        <h1 className="text-3xl font-bold text-blue-700">🔍 NatSpec++ Tag Explorer</h1>
        <p className="text-sm text-gray-500 mt-1">Semantic tags for protocol clarity</p>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-10">
        <TagExplorer />
        <MethodInspector />
      </main>
    </div>
  );
}

export default App;
