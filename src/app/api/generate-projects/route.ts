import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProjectGenerationService, ProjectGenerationInput } from '@/domain/generator';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      goalText,
      skillLevel,
      intendedUse,
      availableTime,
      maxBudgetUsd,
      constraints,
      refinementType,
    } = body;

    const workspace = await prisma.workspace.findFirst({
      where: { slug: 'alexs-maker-bench' },
      include: {
        members: { include: { user: true } },
      },
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    const userId = workspace.members[0]?.userId || 'anonymous';

    // Fetch active inventory
    const components = await prisma.component.findMany({
      where: {
        workspaceId: workspace.id,
        status: { not: 'archived' },
      },
      include: {
        category: true,
        capabilities: true,
      },
    });

    const inventoryInputs = components.map((c) => ({
      id: c.id,
      name: c.name,
      category: c.category.name,
      quantity: c.quantity,
      condition: c.condition,
      capabilities: c.capabilities.map((cap) => cap.name),
    }));

    const inputData: ProjectGenerationInput = {
      goalText: goalText || 'Build something useful with my available e-waste',
      skillLevel: skillLevel || 'Beginner friendly',
      intendedUse: intendedUse || 'Environment & Plants',
      availableTime: availableTime || '2–3 hours',
      maxBudgetUsd: parseFloat(maxBudgetUsd) || 10.0,
      constraints: Array.isArray(constraints) ? constraints : ['no_soldering'],
      refinementType,
    };

    const generationResult = ProjectGenerationService.generateConcepts(inputData, inventoryInputs);

    // Save generation request in DB for audit trail
    const savedRequest = await prisma.projectGenerationRequest.create({
      data: {
        workspaceId: workspace.id,
        userId,
        goalText: inputData.goalText,
        skillLevel: inputData.skillLevel,
        intendedUse: inputData.intendedUse,
        availableTime: inputData.availableTime,
        maxBudgetUsd: inputData.maxBudgetUsd,
        constraintsJson: JSON.stringify(inputData.constraints),
        refinementPrompt: inputData.refinementType || null,
        results: {
          create: generationResult.concepts.map((c) => ({
            title: c.title,
            tagline: c.tagline,
            oneSentenceValue: c.oneSentenceValue,
            difficulty: c.difficulty,
            estimatedTime: c.estimatedTime,
            estimatedExtraCost: c.estimatedExtraCost,
            estimatedReuseValue: c.estimatedReuseValue,
            feasibilityScore: c.feasibilityScore,
            assumptions: c.assumptions,
            safetyNotes: c.safetyNotes,
            reusedPartsJson: JSON.stringify(c.reusedParts),
            missingPartsJson: JSON.stringify(c.missingParts),
            flowStages: c.flowStages,
          })),
        },
      },
      include: {
        results: true,
      },
    });

    return NextResponse.json({
      requestId: savedRequest.id,
      ...generationResult,
    });
  } catch (error: any) {
    console.error('Project generation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate projects' }, { status: 500 });
  }
}
