import { NextRequest, NextResponse } from 'next/server';
import { AIContractDrafter, ContractDraftRequest } from '@/lib/ai-contract-drafter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, ...data } = body;

    const drafter = new AIContractDrafter();

    switch (action) {
      case 'draft': {
        const request: ContractDraftRequest = data;
        const result = await drafter.draftContract(request);

        // MVP Persistence: Save draft into AnalyzedContract
        try {
          await prisma.analyzedContract.create({
            data: {
              fileName: `${request.contractType} (Draft)`,
              contractType: 'Draft',
              riskScore: 0,
              summary: JSON.stringify(result), // Store full draft
              redFlagsCount: 0,
              clausesCount: result.sections?.length || 0,
            }
          });
        } catch (e) {
          console.error("Draft persistence failed", e);
        }

        return NextResponse.json(result);
      }

      case 'refine': {
        const { currentDraft, refinements } = data;
        const result = await drafter.refineDraft(currentDraft, refinements);
        return NextResponse.json(result);
      }

      case 'variations': {
        const { draftId } = data;
        const result = await drafter.generateVariations(draftId);
        return NextResponse.json(result);
      }

      case 'recommendations': {
        const { contractType, industry, parties, existingSections } = data;
        const result = await drafter.recommendClauses(contractType, industry, parties, existingSections);
        return NextResponse.json(result);
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Drafting API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
