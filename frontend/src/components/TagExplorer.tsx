import React, { useEffect, useState } from "react";
import type { TagDefinition } from "../types/TagDefinition";

export const TagExplorer: React.FC = () => {
  const [tags, setTags] = useState<Record<string, TagDefinition>>({});

  useEffect(() => {
    fetch("/tag-bank.json")
      .then((res) => res.json())
      .then((data) => setTags(data))
      .catch((err) => console.error("Failed to load tag bank:", err));
  }, []);

  const copyTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">🧠 Tag Bank Explorer</h2>
      <ul className="space-y-6">
        {Object.entries(tags).map(([tag, def]) => (
          <li
            key={tag}
            className={`border rounded-lg p-4 shadow-sm transition-shadow hover:shadow-md ${
              def.required ? "bg-red-50 border-red-200" : "bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xl font-semibold text-blue-700">{tag}</span>
                <span className="ml-2 text-sm text-gray-500">({def.type})</span>
                {def.required && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                    Required
                  </span>
                )}
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(tag)}
                className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                📋 Copy
              </button>
            </div>
            <p className="mt-2 text-gray-700">{def.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
