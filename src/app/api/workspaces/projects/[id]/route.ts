import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const workspaceProject = await prisma.projectWorkspace.findFirst({
      where: {
        OR: [
          { id: params.id },
          { projectId: params.id },
        ],
      },
      include: {
        components: {
          include: { inventoryComponent: true },
        },
        buildSteps: {
          orderBy: { stepNumber: 'asc' },
        },
        project: true,
      },
    });

    if (!workspaceProject) {
      return NextResponse.json({ error: 'Workspace project not found' }, { status: 404 });
    }

    const completedSteps = workspaceProject.buildSteps.filter((s) => s.isCompleted).length;
    const totalSteps = workspaceProject.buildSteps.length;
    const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

    return NextResponse.json({
      workspaceProject,
      progress: {
        completedSteps,
        totalSteps,
        progressPercent,
      },
    });
  } catch (error: any) {
    console.error('Workspace project GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch project workspace' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { stepNumber, isCompleted, notes, status, componentId, isSatisfied } = body;

    const workspaceProject = await prisma.projectWorkspace.findFirst({
      where: {
        OR: [
          { id: params.id },
          { projectId: params.id },
        ],
      },
      include: { buildSteps: true },
    });

    if (!workspaceProject) {
      return NextResponse.json({ error: 'Workspace project not found' }, { status: 404 });
    }

    // If step completion is being updated
    if (stepNumber !== undefined && isCompleted !== undefined) {
      await prisma.projectWorkspaceStep.updateMany({
        where: {
          workspaceProjectId: workspaceProject.id,
          stepNumber,
        },
        data: {
          isCompleted: Boolean(isCompleted),
          completedAt: isCompleted ? new Date() : null,
        },
      });
    }

    // If status or notes are being updated
    if (status || notes !== undefined) {
      await prisma.projectWorkspace.update({
        where: { id: workspaceProject.id },
        data: {
          status: status || undefined,
          notes: notes !== undefined ? notes : undefined,
        },
      });
    }

    // If a component satisfaction status is updated
    if (componentId && isSatisfied !== undefined) {
      await prisma.projectWorkspaceComponent.updateMany({
        where: {
          workspaceProjectId: workspaceProject.id,
          id: componentId,
        },
        data: {
          isSatisfied: Boolean(isSatisfied),
        },
      });
    }

    // Return updated record
    const updated = await prisma.projectWorkspace.findUnique({
      where: { id: workspaceProject.id },
      include: {
        components: true,
        buildSteps: { orderBy: { stepNumber: 'asc' } },
        project: true,
      },
    });

    return NextResponse.json({ workspaceProject: updated });
  } catch (error: any) {
    console.error('Workspace project PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update project workspace' }, { status: 500 });
  }
}
