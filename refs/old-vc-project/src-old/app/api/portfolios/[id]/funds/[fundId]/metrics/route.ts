import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { DevAuthBypass } from "@/lib/auth/dev-bypass";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; fundId: string }> }
) {
  try {
    let userId: string | null = null;

    // Check for development bypass
    const devUserId = request.headers.get("x-dev-user-id");
    if (devUserId && DevAuthBypass.isDevUser(devUserId)) {
      userId = devUserId;
    } else {
      // Normal authentication flow - for now, return unauthorized in non-dev mode
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { id: portfolioId, fundId } = await params;
    const body = await request.json();
    const { field, value } = body;

    if (!field || value === undefined) {
      return NextResponse.json(
        { error: "Field and value are required" },
        { status: 400 }
      );
    }

    // Validate field names
    const allowedFields = [
      "ownershipPercentage",
      "personalCommitment",
      "personalCalled",
      "personalNav",
      "personalDistributions",
    ];

    if (!allowedFields.includes(field)) {
      return NextResponse.json(
        { error: "Invalid field name" },
        { status: 400 }
      );
    }

    // Get current fund document
    const { data: fundDocument, error: fetchError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", fundId)
      .eq("user_id", userId)
      .eq("type", "fund_report")
      .single();

    if (fetchError || !fundDocument) {
      return NextResponse.json({ error: "Fund not found" }, { status: 404 });
    }

    // Calculate personal metrics based on ownership percentage
    const extractedData = fundDocument.extracted_data;
    const ownershipPercentage =
      field === "ownershipPercentage"
        ? value
        : fundDocument.ownership_percentage || 1.0;

    // Calculate personal metrics using database-side logic
    const personalMetrics = calculatePersonalMetrics(
      extractedData,
      ownershipPercentage
    );

    // Update the document with new metrics
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    // Only update ownership percentage - personal metrics are calculated dynamically
    if (field === "ownershipPercentage") {
      // Try updating the extracted_data field instead since personal_ownership might not exist
      const currentExtractedData = fundDocument.extracted_data || {};
      updateData.extracted_data = {
        ...currentExtractedData,
        ownershipPercentage: value,
      };

      // Also try to update the personal_ownership field if it exists
      updateData.personal_ownership = value;
    } else {
      // For other fields, we can't update them directly as they're calculated
      return NextResponse.json(
        { error: "Only ownership percentage can be updated directly" },
        { status: 400 }
      );
    }

    console.log("Updating fund metrics with data:", updateData);

    const { error: updateError } = await supabase
      .from("documents")
      .update(updateData)
      .eq("id", fundId)
      .eq("user_id", userId);

    if (updateError) {
      console.error("Error updating fund metrics:", updateError);
      return NextResponse.json(
        { error: "Failed to update fund metrics" },
        { status: 500 }
      );
    }

    console.log("Successfully updated fund metrics");

    return NextResponse.json({
      success: true,
      message: "Fund metrics updated successfully",
      data: {
        field,
        value,
        personalMetrics,
      },
    });
  } catch (error) {
    console.error("Error updating fund metrics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Calculate personal metrics based on fund data and ownership percentage
 * This is database-side calculation logic
 */
function calculatePersonalMetrics(
  extractedData: any,
  ownershipPercentage: number
) {
  const fundSize = extractedData?.fundSize || 0;
  const fundCalled =
    extractedData?.cumulativeCalledCapital || extractedData?.fundCalled || 0;
  const fundNav = extractedData?.fundNAV || extractedData?.fundNav || 0;
  const fundDistributions =
    extractedData?.cumulativeDistributions ||
    extractedData?.fundDistributions ||
    0;

  return {
    personalCommitment: fundSize * (ownershipPercentage / 100),
    personalCalled: fundCalled * (ownershipPercentage / 100),
    personalNav: fundNav * (ownershipPercentage / 100),
    personalDistributions: fundDistributions * (ownershipPercentage / 100),
  };
}
