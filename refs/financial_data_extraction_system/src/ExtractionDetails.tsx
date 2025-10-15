import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { useState } from "react";

export function ExtractionDetails({
  documentId,
}: {
  documentId: Id<"documents">;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const extractionResults = useQuery(api.enhancedChat.getExtractionDetails, {
    documentId,
  });

  if (!extractionResults || extractionResults.length === 0) {
    return null;
  }

  return (
    <div className="bg-white  shadow-sm border border-gray-200 mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h2 className="text-lg font-semibold text-gray-900">
            Extraction Details
          </h2>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="px-6 pb-4 border-t border-gray-200">
          <div className="mt-4 space-y-3">
            {extractionResults.map((result, idx) => (
              <div key={idx} className="bg-gray-50  p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900">
                    {result.metricName}
                  </h3>
                  <ConfidenceBadge confidence={result.confidence} />
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-semibold">Value:</span> {result.value}
                </p>
                {result.sourceChunkIndex !== undefined &&
                  result.sourceChunkIndex !== null && (
                    <p className="text-xs text-gray-600">
                      Found in chunk {result.sourceChunkIndex + 1}
                    </p>
                  )}
                <p className="text-xs text-gray-500 mt-1">
                  Method: {result.extractionMethod}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ConfidenceBadge({ confidence }: { confidence: string }) {
  const styles = {
    high: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-orange-100 text-orange-800",
    not_found: "bg-red-100 text-red-800",
  };

  const style = styles[confidence as keyof typeof styles] || styles.low;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${style}`}>
      {confidence}
    </span>
  );
}
