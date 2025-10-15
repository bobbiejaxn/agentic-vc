import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

export function DocumentList({
  onSelectDocument,
}: {
  onSelectDocument: (id: Id<"documents">) => void;
}) {
  const documents = useQuery(api.documents.listDocuments);

  if (documents === undefined) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="bg-white  shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-500">
          No documents yet. Upload your first document to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Recent Documents</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => (
          <button
            key={doc._id}
            onClick={() => onSelectDocument(doc._id)}
            className="bg-white  shadow-sm border border-gray-200 p-6 text-left hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900 mb-2 truncate">
              {doc.title}
            </h3>
            <div className="flex items-center gap-2">
              <StatusBadge status={doc.status} />
              <span className="text-sm text-gray-500">
                {new Date(doc._creationTime).toLocaleDateString()}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: "processing" | "completed" | "failed";
}) {
  const styles = {
    processing: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}
