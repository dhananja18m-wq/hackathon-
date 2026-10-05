import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProjectMatcher } from '@/domain/matcher';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';
    const sort = searchParams.get('sort') || 'recommended';

    const workspace = await prisma.workspace.findFirst({
      where: { slug: 'alexs-maker-bench' },
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    // Get active inventory
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

    // Get all projects
    const projects = await prisma.project.findMany({
      include: {
        requirements: true,
      },
      orderBy: { projectNumber: 'asc' },
    });

    // Evaluate matching score for each project
    const scoredProjects = projects.map((project) => {
      const matchResult = ProjectMatcher.matchProject(
        {
          id: project.id,
          projectNumber: project.projectNumber,
          title: project.title,
          tagline: project.tagline,
          description: project.description,
          difficulty: project.difficulty,
          estimatedHours: project.estimatedHours,
          requirements: project.requirements.map((r) => ({
            id: r.id,
            componentName: r.componentName,
            capabilityNeeded: r.capabilityNeeded,
            category: r.category,
            quantityNeeded: r.quantityNeeded,
            isOptional: r.isOptional,
            substitutions: r.substitutions,
            unitCostUsd: r.unitCostUsd,
          })),
        },
        inventoryInputs
      );

      return {
        ...project,
        matchResult,
      };
    });

    // Filter
    let filtered = scoredProjects;
    if (filter === 'for_inventory') {
      filtered = filtered.filter((p) => p.matchResult.feasibilityScore >= 60);
    } else if (filter === 'beginner') {
      filtered = filtered.filter((p) => p.difficulty.toLowerCase().includes('beginner'));
    } else if (filter === 'under_10') {
      filtered = filtered.filter((p) => p.matchResult.estimatedExtraCostUsd <= 10);
    }

    // Sort
    if (sort === 'recommended' || sort === 'feasibility') {
      filtered.sort((a, b) => b.matchResult.feasibilityScore - a.matchResult.feasibilityScore);
    } else if (sort === 'cost_low') {
      filtered.sort((a, b) => a.matchResult.estimatedExtraCostUsd - b.matchResult.estimatedExtraCostUsd);
    }

    return NextResponse.json({
      projects: filtered,
      totalCount: projects.length,
      matchedCount: scoredProjects.filter((p) => p.matchResult.feasibilityScore >= 50).length,
    });
  } catch (error) {
    console.error('API Projects GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
