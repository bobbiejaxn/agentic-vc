import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { PortfolioService } from "@/lib/database/portfolios";
import { z } from "zod";

const createInvestmentSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  sector: z.string().optional(),
  stage: z.string().optional(),
  investmentDate: z.string().optional(),
  amountInvested: z.number().positive("Amount invested must be positive"),
  currentValue: z.number().positive().optional(),
  ownershipPercentage: z.number().min(0).max(100).optional(),
  irr: z.number().optional(),
  moic: z.number().positive().optional(),
  status: z
    .enum(["active", "exited", "written_off", "pending"])
    .default("active"),
  notes: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get user session
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

    const { id: portfolioId } = await params;

    // Get portfolio investments from investments table
    const { data: investments, error } = await supabase
      .from("investments")
      .select("*")
      .eq("portfolio_id", portfolioId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch investments: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      data: investments,
    });
  } catch (error) {
    console.error("Error fetching investments:", error);
    return NextResponse.json(
      { error: "Failed to fetch investments" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get user session
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

    const { id: portfolioId } = await params;

    // Parse request body
    const body = await request.json();
    const validatedData = createInvestmentSchema.parse(body);

    // Create investment directly in Supabase
    const { data: investment, error } = await supabase
      .from("investments")
      .insert({
        portfolio_id: portfolioId,
        company_name: validatedData.companyName,
        sector: validatedData.sector,
        stage: validatedData.stage,
        investment_date: validatedData.investmentDate,
        amount_invested: validatedData.amountInvested,
        current_value: validatedData.currentValue,
        ownership_percentage: validatedData.ownershipPercentage,
        irr: validatedData.irr,
        moic: validatedData.moic,
        status: validatedData.status,
        notes: validatedData.notes,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create investment: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      data: investment,
    });
  } catch (error) {
    console.error("Error creating investment:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create investment" },
      { status: 500 }
    );
  }
}
