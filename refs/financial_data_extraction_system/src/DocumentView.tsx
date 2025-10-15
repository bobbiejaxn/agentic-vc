import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id, Doc } from "../convex/_generated/dataModel";
import { MetricsTable } from "./MetricsTable";
import { ChatInterface } from "./ChatInterface";
import { ExtractionDetails } from "./ExtractionDetails";

export function DocumentView({
  documentId,
  onBack,
}: {
  documentId: Id<"documents">;
  onBack: () => void;
}) {
  const document = useQuery(api.documents.getDocument, { documentId });
  const metrics = useQuery(api.metrics.getMetrics, { documentId });
  const progress = useQuery(api.enhancedChat.getProcessingProgress, {
    documentId,
  });

  if (document === undefined || metrics === undefined) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Documents
      </button>

      <div className="bg-white  shadow-sm border border-gray-200 p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {document.title}
        </h1>
        <p className="text-gray-600">
          Uploaded on {new Date(document._creationTime).toLocaleDateString()}
        </p>
      </div>

      {document.status === "processing" && (
        <ProcessingStatus progress={progress} />
      )}

      {document.status === "failed" && (
        <div className="bg-red-50 border border-red-200  p-4 mb-6">
          <p className="text-red-800 font-medium">
            Failed to process document:{" "}
            {document.errorMessage || "Unknown error"}
          </p>
        </div>
      )}

      {document.status === "completed" && metrics && (
        <>
          <MetricsTable metrics={metrics} />
          <ExtractionDetails documentId={documentId} />
          <ChatInterface documentId={documentId} />
        </>
      )}
    </div>
  );
}

function ProcessingStatus({
  progress,
}: {
  progress: Doc<"processingProgress"> | null | undefined;
}) {
  if (!progress) {
    return (
      <div className="bg-yellow-50 border border-yellow-200  p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
          <p className="text-yellow-800 font-medium">Processing document...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200  p-4 mb-6">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
          <p className="text-yellow-800 font-medium">{progress.message}</p>
        </div>
        <div className="flex justify-between text-sm text-yellow-700">
          <span className="capitalize">{progress.stage}</span>
          <span>{progress.progress}%</span>
        </div>
        <div className="w-full bg-yellow-200 rounded-full h-2">
          <div
            className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
