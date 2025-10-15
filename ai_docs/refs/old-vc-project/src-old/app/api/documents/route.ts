import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { DocumentService } from "@/lib/database/documents";
import { DevAuthBypass } from "@/lib/auth/dev-bypass";
import { UserService } from "@/lib/database/users";
import { PortfolioService } from "@/lib/database/portfolios";
import { DocumentListResponse } from "@/lib/types/documents";

export async function GET(request: NextRequest) {
  try {
    let userId: string;

    // Check for development bypass
    const devUserId = request.headers.get("x-dev-user-id");
    if (devUserId && DevAuthBypass.isDevUser(devUserId)) {
      userId = devUserId;

      // Ensure development user exists in database
      try {
        const devUser = DevAuthBypass.getDevUserById(devUserId);
        if (devUser) {
          await UserService.ensureUserExists(devUserId, {
            email: devUser.email,
            fullName: devUser.fullName,
            role: devUser.role,
          });
          await PortfolioService.ensureDefaultPortfolio(devUserId);
        }
      } catch (error) {
        console.error("Error ensuring dev user exists:", error);
        // Continue anyway
      }
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

    // Get user documents
    const documents = await DocumentService.getUserDocuments(userId);

    const response: DocumentListResponse = {
      success: true,
      data: documents,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}
