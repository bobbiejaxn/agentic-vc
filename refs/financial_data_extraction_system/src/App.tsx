import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { DocumentList } from "./DocumentList";
import { UploadDocument } from "./UploadDocument";
import { useState } from "react";
import { DocumentView } from "./DocumentView";
import { Id } from "../convex/_generated/dataModel";

export default function App() {
  const [selectedDocumentId, setSelectedDocumentId] = useState<Id<"documents"> | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
        <h2 className="text-xl font-semibold text-gray-800">Financial Data Extractor</h2>
        <SignOutButton />
      </header>
      <main className="flex-1 p-4">
        <Authenticated>
          <AuthenticatedContent 
            selectedDocumentId={selectedDocumentId}
            setSelectedDocumentId={setSelectedDocumentId}
          />
        </Authenticated>
        <Unauthenticated>
          <UnauthenticatedContent />
        </Unauthenticated>
      </main>
      <Toaster />
    </div>
  );
}

function AuthenticatedContent({ 
  selectedDocumentId, 
  setSelectedDocumentId 
}: { 
  selectedDocumentId: Id<"documents"> | null;
  setSelectedDocumentId: (id: Id<"documents"> | null) => void;
}) {
  if (selectedDocumentId) {
    return (
      <DocumentView 
        documentId={selectedDocumentId} 
        onBack={() => setSelectedDocumentId(null)} 
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Documents</h1>
        <p className="text-gray-600">Upload financial documents to extract key metrics and chat with your data</p>
      </div>
      <UploadDocument />
      <DocumentList onSelectDocument={setSelectedDocumentId} />
    </div>
  );
}

function UnauthenticatedContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Financial Data Extractor</h1>
        <p className="text-xl text-gray-600 mb-8">
          Extract key financial metrics from documents using AI-powered analysis
        </p>
      </div>
      <SignInForm />
    </div>
  );
}
