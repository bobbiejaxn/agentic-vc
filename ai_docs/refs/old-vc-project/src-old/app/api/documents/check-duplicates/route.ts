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
    }

    // Parse request body
    const { fileName, fileSize, contentHash } = await request.json();

    if (!fileName || !fileSize) {
      return NextResponse.json(
        { error: "fileName and fileSize are required" },
        { status: 400 }
      );
    }

    // Check for duplicates
    const duplicateResult = await DuplicateDetectionService.detectDuplicates(
      userId,
      fileName,
      fileSize,
      contentHash
    );

    return NextResponse.json({
      success: true,
      data: duplicateResult,
    });
  } catch (error) {
    console.error("Duplicate detection error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
