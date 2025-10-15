import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { DuplicateDetectionService } from "@/lib/duplicate-detection";

export async function POST(request: NextRequest) {
  try {
    let userId: string;

    // Check for development bypass
    const devUserId = request.headers.get("x-dev-user-id");
    if (devUserId) {
      userId = devUserId;
    } else {
      // Normal authentication flow
      try {
        const cookieStore = await cookies();
        const supabase = createServerComponentClient({
          cookies: () => cookieStore,
        });
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        userId = user.id;
      } catch (error) {
        console.error("Authentication error:", error);
        return NextResponse.json(
          { error: "Authentication failed" },
          { status: 401 }
        );
      }
    }

    // Parse request body
    const { action, documentId, newDocumentData } = await request.json();

    if (!action || !newDocumentData) {
      return NextResponse.json(
        { error: "action and newDocumentData are required" },
        { status: 400 }
      );
    }

    // For retrigger actions, we need to create a mock file object
    // since the actual file processing will be handled by the upload flow
    const mockFile = new File(
      [new Blob(["Mock file for duplicate handling"])],
      newDocumentData.name,
      { type: newDocumentData.mimeType || "application/octet-stream" }
    );

    // Handle duplicate action
    const result = await DuplicateDetectionService.handleDuplicate(
      {
        action,
        documentId,
        userId,
      },
      {
        ...newDocumentData,
        file: mockFile,
      }
    );

    return NextResponse.json({
      success: result.success,
      data: result,
    });
  } catch (error) {
    console.error("Duplicate handling error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
