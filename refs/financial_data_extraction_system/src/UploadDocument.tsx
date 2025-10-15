import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";

export function UploadDocument() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const uploadDocument = useMutation(api.documents.uploadDocument);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Please provide both title and content");
      return;
    }

    setIsUploading(true);
    try {
      await uploadDocument({ title, content });
      toast.success("Document uploaded successfully");
      setTitle("");
      setContent("");
    } catch (error) {
      toast.error("Failed to upload document");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white  shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Upload New Document
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Document Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Q4 2024 Financial Report"
            className="w-full px-4 py-2  bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            disabled={isUploading}
          />
        </div>
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Document Content (Markdown)
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your markdown content here (up to 150k characters)..."
            rows={8}
            className="w-full px-4 py-2  bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-y"
            disabled={isUploading}
          />
          <p className="text-sm text-gray-500 mt-1">
            {content.length.toLocaleString()} / 150,000 characters
          </p>
        </div>
        <button
          type="submit"
          disabled={isUploading || !title.trim() || !content.trim()}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold  hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? "Uploading..." : "Upload & Process Document"}
        </button>
      </form>
    </div>
  );
}
