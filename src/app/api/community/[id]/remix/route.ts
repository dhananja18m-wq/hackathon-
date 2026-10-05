import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const publication = await prisma.communityPublication.findUnique({
      where: { id: params.id },
      include: {
        sourceProject: {
          include: { requirements: true, buildSteps: true },
        },
      },
    });

    if (!publication) {
      return NextResponse.json({ error: 'Publication not found' }, { status: 404 });
    }

    const workspace = await prisma.workspace.findFirst({
      where: { slug: 'alexs-maker-bench' },
      include: { members: { include: { user: true } } },
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    const userId = workspace.members[0]?.userId || 'anonymous';
    const inventory = await prisma.component.findMany({
      where: { workspaceId: workspace.id, status: { notIn: ['archived', 'reused'] } },
    });
    const reusableParts = (publication.sourceProject?.requirements || []).map((requirement) => {
      const requirementWords = requirement.componentName.toLowerCase().split(/\W+/).filter((word) => word.length > 3);
      const match = inventory.find((component) => requirementWords.some((word) => component.name.toLowerCase().includes(word)));
      return {
        componentName: requirement.componentName,
        matchedComponentId: match?.id || null,
        quantityNeeded: requirement.quantityNeeded,
        quantityAssigned: match ? Math.min(match.quantity, requirement.quantityNeeded) : 0,
        isSatisfied: Boolean(match && match.quantity >= requirement.quantityNeeded),
        isSubstituted: Boolean(match && !match.name.toLowerCase().includes(requirement.componentName.toLowerCase())),
        substitutionNotes: match && !match.name.toLowerCase().includes(requirement.componentName.toLowerCase()) ? `Matched available inventory: ${match.name}` : null,
        estimatedUnitCost: requirement.unitCostUsd,
      };
    });

    // Create remixed private ProjectWorkspace
    const remixedWorkspace = await prisma.projectWorkspace.create({
      data: {
        workspaceId: workspace.id,
        userId,
        projectId: publication.projectId || null,
        title: `${publication.title} (Remix)`,
        tagline: `Remixed from community project by author`,
        status: 'in_progress',
        feasibilityScore: 86,
        currentStepIndex: 0,
        notes: `Remixed from community publication "${publication.title}".`,
        components: { create: reusableParts },
        buildSteps: {
          create: (publication.sourceProject?.buildSteps || []).map((s) => ({
            stepNumber: s.stepNumber,
            title: s.title,
            description: s.description,
            durationMinutes: s.durationMinutes,
            safetyWarning: s.safetyWarning,
            milestoneCheck: s.milestoneCheck,
            isCompleted: false,
          })),
        },
      },
    });

    // Record Remix Lineage
    await prisma.projectRemix.create({
      data: {
        publicationId: publication.id,
        targetWorkspaceId: workspace.id,
        authorId: userId,
        lineageNotes: `Remix created on ${new Date().toLocaleDateString()}`,
      },
    });

    // Increment remix counter
    await prisma.communityPublication.update({
      where: { id: publication.id },
      data: { remixCount: { increment: 1 } },
    });

    return NextResponse.json({
      success: true,
      workspaceProjectId: remixedWorkspace.id,
    });
  } catch (error: any) {
    console.error('Remix error:', error);
    return NextResponse.json({ error: error.message || 'Failed to remix project' }, { status: 500 });
  }
}
