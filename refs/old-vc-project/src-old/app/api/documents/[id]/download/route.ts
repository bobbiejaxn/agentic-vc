import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { DocumentService } from "@/lib/database/documents";
import { supabaseStorageService } from "@/lib/storage/supabase-storage";
import { DevAuthBypass } from "@/lib/auth/dev-bypass";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id;

    // Get user session
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({
      cookies: () => cookieStore,
    });

    let userId: string;

    // Check for development bypass
    const devUserId = request.headers.get("x-dev-user-id");
    if (devUserId && DevAuthBypass.isDevUser(devUserId)) {
      userId = devUserId;
    } else {
      // Normal authentication flow
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      userId = user.id;
    }

    // Get document from database
    const document = await DocumentService.getDocumentById(documentId);

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Check if user owns the document
    if (document.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if file path exists
    if (!document.filePath) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Download file from Supabase Storage
    const downloadResult = await supabaseStorageService.downloadFile(
      document.filePath
    );

    if (!downloadResult.success) {
      return NextResponse.json(
        { error: `File download failed: ${downloadResult.error}` },
        { status: 500 }
      );
    }

    // Return file with appropriate headers
    return new NextResponse(downloadResult.file, {
      headers: {
        "Content-Type": document.mimeType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${document.name}"`,
        "Content-Length": document.fileSize || "0",
      },
    });
  } catch (error) {
    console.error("Document download error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
