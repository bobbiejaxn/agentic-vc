import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { PersonalMetricsService } from "@/lib/database/personal-metrics";
import { DevAuthBypass } from "@/lib/auth/dev-bypass";

export async function GET(request: NextRequest) {
  try {
    let userId: string | null = null;

    // Check for development bypass
    const devUserId = request.headers.get("x-dev-user-id");
    if (devUserId && DevAuthBypass.isDevUser(devUserId)) {
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

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get("documentId");

    if (documentId) {
      // Get personal metrics for a specific document
      const metrics = await PersonalMetricsService.getPersonalMetrics(
        documentId,
        userId
      );

      if (!metrics) {
        return NextResponse.json(
          { error: "Personal metrics not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: metrics });
    } else {
      // Get all personal metrics for the user
      const metrics = await PersonalMetricsService.getUserPersonalMetrics(
        userId
      );
      return NextResponse.json({ success: true, data: metrics });
    }
  } catch (error) {
    console.error("Error fetching personal metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch personal metrics" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    let userId: string | null = null;

    // Check for development bypass
    const devUserId = request.headers.get("x-dev-user-id");
    if (devUserId && DevAuthBypass.isDevUser(devUserId)) {
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

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { documentId, metrics } = body;

    if (!documentId || !metrics) {
      return NextResponse.json(
        { error: "Document ID and metrics are required" },
        { status: 400 }
      );
    }

    const success = await PersonalMetricsService.updatePersonalMetrics(
      documentId,
      userId,
      metrics
    );

    if (!success) {
      return NextResponse.json(
        { error: "Failed to update personal metrics" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Personal metrics updated successfully",
    });
  } catch (error) {
    console.error("Error updating personal metrics:", error);
    return NextResponse.json(
      { error: "Failed to update personal metrics" },
      { status: 500 }
    );
  }
}
