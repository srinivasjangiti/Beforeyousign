import { NextRequest, NextResponse } from 'next/server';
import { ContractLifecycleManager, ApprovalWorkflow } from '@/lib/contract-lifecycle-automation';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action, ...data } = body;

    const manager = new ContractLifecycleManager();

    switch (action) {
      case 'create': {
        const { contractType, contractValue } = data;
        const workflow = manager.createDefaultApprovalWorkflow(contractType, contractValue);
        return NextResponse.json(workflow);
      }

      case 'approve': {
        const { lifecycle, stepId, approverId, comments } = data;
        const response = {
          approverId,
          approverName: data.approverName || 'Unknown',
          decision: 'approved' as const,
          timestamp: new Date(),
          comments,
        };
        const result = await manager.processApproval(lifecycle, stepId, approverId, response);
        return NextResponse.json(result);
      }

      case 'reject': {
        const { lifecycle, stepId, approverId, comments } = data;
        const response = {
          approverId,
          approverName: data.approverName || 'Unknown',
          decision: 'rejected' as const,
          timestamp: new Date(),
          comments,
        };
        const result = await manager.processApproval(lifecycle, stepId, approverId, response);
        return NextResponse.json(result);
      }

      case 'obligations': {
        const { contractId, contractText } = data;
        const obligations = await manager.extractObligations(contractId, contractText);
        return NextResponse.json(obligations);
      }

      case 'renewals': {
        const contracts = data.contracts || [];
        const alerts = await manager.checkRenewals(contracts);
        return NextResponse.json(alerts);
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Lifecycle API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
