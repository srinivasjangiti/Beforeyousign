import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const risk = searchParams.get('risk') || 'all';
    const sort = searchParams.get('sort') || 'date';

    // Build the where clause
    const where: any = {};
    if (search) {
      where.OR = [
        { fileName: { contains: search, mode: 'insensitive' } },
        { contractType: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (risk !== 'all') {
      if (risk === 'High') {
        where.riskScore = { gte: 70 };
      } else if (risk === 'Medium') {
        where.riskScore = { gte: 40, lt: 70 };
      } else if (risk === 'Low') {
        where.riskScore = { lt: 40 };
      }
    }

    // Build the orderBy clause
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'risk') {
      orderBy = { riskScore: 'desc' };
    } else if (sort === 'date') {
      orderBy = { createdAt: 'desc' };
    }

    const contracts = await prisma.analyzedContract.findMany({
      where,
      orderBy,
    });

    return NextResponse.json({ success: true, contracts });
  } catch (error) {
    console.error('Failed to fetch contracts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contracts' },
      { status: 500 }
    );
  }
}
