import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { DocumentService } from "@/lib/database/documents";
import { DevAuthBypass } from "@/lib/auth/dev-bypass";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: portfolioId } = await params;

    // Get fund documents for this user
    const documents = await DocumentService.getUserDocuments(userId);
    const fundDocuments = documents.filter(
      (doc) => doc.type === "fund_report" && doc.status === "completed"
    );

    // Transform fund documents to fund data
    const funds = fundDocuments.map((doc) => {
      const extractedData = doc.extractedData;
      return {
        id: doc.id,
        name: doc.name,
        vintage: extractedData?.vintageYear || new Date().getFullYear(),
        fundSize: extractedData?.fundSize || 0,
        fundNav: extractedData?.fundNav || extractedData?.fundNAV || 0,
        fundDistributions: extractedData?.fundDistributions || 0,
        fundCalled:
          extractedData?.fundCalled ||
          extractedData?.cumulativeCalledCapital ||
          0,
        grossIrr: extractedData?.grossIrr || extractedData?.irr || 0,
        netIrr: extractedData?.netIrr || 0,
        grossMoic: extractedData?.grossMoic || extractedData?.moic || 0,
        tvpi: extractedData?.tvpi || 0,
        dpi: extractedData?.dpi || 0,
        rvpi: extractedData?.rvpi || 0,
        ownershipPercentage: doc.ownershipPercentage || 1.0,
        personalCommitment: doc.ownershipPercentage
          ? (extractedData?.fundSize || 0) * (doc.ownershipPercentage / 100)
          : (extractedData?.fundSize || 0) * 0.01,
        personalCalled: doc.ownershipPercentage
          ? (extractedData?.fundCalled ||
              extractedData?.cumulativeCalledCapital ||
              0) *
            (doc.ownershipPercentage / 100)
          : (extractedData?.fundCalled ||
              extractedData?.cumulativeCalledCapital ||
              0) * 0.01,
        personalNav: doc.ownershipPercentage
          ? (extractedData?.fundNav || extractedData?.fundNAV || 0) *
            (doc.ownershipPercentage / 100)
          : (extractedData?.fundNav || extractedData?.fundNAV || 0) * 0.01,
        personalDistributions: doc.ownershipPercentage
          ? (extractedData?.fundDistributions || 0) *
            (doc.ownershipPercentage / 100)
          : (extractedData?.fundDistributions || 0) * 0.01,
        portfolioId,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      };
    });

    return NextResponse.json({
      success: true,
      data: funds,
    });
  } catch (error) {
    console.error("Error fetching portfolio funds:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio funds" },
      { status: 500 }
    );
  }
}
