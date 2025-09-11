import React, { useEffect, useState } from "react";
import type { TagProfileValidator } from "../../shared/validation/TagProfileValidator";
import type { TagSet } from "../../shared/validation/TagProfileValidator";

interface MethodReport {
  contract: string;
  method: string;
  gasUsed: number;
  timestamp: number;
  tags: TagSet;
}

export const MethodInspector: React.FC = () => {
  const [report, setReport] = useState<MethodReport | null>(null);

  useEffect(() => {
    fetch("/benchmark-report.json")
      .then((res) => res.json())
      .then((data) => {
        const validator = new TagProfileValidator();
        const tags = validator.inferTagsFromEpoch({
          method: data.method,
          gasUsed: parseInt(data.gasUsed)
        });

        const methodData: MethodReport = {
          contract: data.contract,
          method: data.method,
          gasUsed: parseInt(data.gasUsed),
          timestamp: data.timestamp,
          tags
        };

        setReport(methodData);
      })
      .catch((err) => console.error("Failed to load benchmark report:", err));
  }, []);

  if (!report) {
    return <p className="text-gray-500">Loading method report...</p>;
  }

  return (
    <div className="bg-white border rounded-lg p-6 shadow-md">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">🧪 Method Inspector</h2>
      <div className="space-y-2 text-gray-800">
        <p><strong>Contract:</strong> {report.contract}</p>
        <p><strong>Method:</strong> {report.method}</p>
        <p><strong>Gas Used:</strong> {report.gasUsed.toLocaleString()} units</p>
        <p><strong>Timestamp:</strong> {new Date(report.timestamp).toLocaleString()}</p>
        <div>
          <strong>Inferred Tags:</strong>
          <ul className="list-disc list-inside mt-1">
            {Object.entries(report.tags).map(([tag, meta]) => (
              <li key={tag}>
                {tag} {meta.validated ? "✅" : ""}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
