import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PublicationService } from '@/domain/community';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const difficulty = searchParams.get('difficulty') || '';

    const whereClause: any = {
      isPublished: true,
    };

    if (search) {
      whereClause.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } },
      ];
    }

    if (category && category !== 'All categories') {
      whereClause.category = { equals: category };
    }

    if (difficulty && difficulty !== 'All skill levels') {
      whereClause.difficulty = { contains: difficulty };
    }

    const publications = await prisma.communityPublication.findMany({
      where: whereClause,
      include: {
        author: {
          select: { id: true, name: true, role: true, avatarUrl: true },
        },
        comments: true,
        reactions: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      publications: publications.map((p) => ({
        ...p,
        tags: JSON.parse(p.tags || '[]'),
      })),
      totalCount: publications.length,
    });
  } catch (error: any) {
    console.error('Community GET error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch community projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { workspaceProjectId, title, tagline, description, difficulty, category, estimatedHours, tags, buildHighlights, safetyNotes } = body;

    const workspace = await prisma.workspace.findFirst({
      where: { slug: 'alexs-maker-bench' },
      include: { members: { include: { user: true } } },
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    const userId = workspace.members[0]?.userId || 'anonymous';

    const sanitized = PublicationService.sanitizeForPublic({
      workspaceProjectId,
      authorId: userId,
      title: title || 'Custom Salvaged Build',
      tagline: tagline || 'Community-shared electronics reuse build',
      description: description || 'Built with salvaged components and verified with reboard.',
      difficulty: difficulty || 'Beginner friendly',
      category: category || 'Environment & Plants',
      estimatedHours: estimatedHours || '2 hours',
      flowStages: 'INPUT -> PROCESS -> OUTPUT',
      tags: Array.isArray(tags) ? tags : ['arduino', 'maker'],
      buildHighlights,
      safetyNotes,
    });

    const newPublication = await prisma.communityPublication.create({
      data: {
        workspaceProjectId: workspaceProjectId || null,
        authorId: userId,
        title: sanitized.title,
        tagline: sanitized.tagline,
        description: sanitized.description,
        difficulty: difficulty || 'Beginner friendly',
        category: category || 'Environment & Plants',
        estimatedHours: estimatedHours || '2 hours',
        coverImageUrl: 'https://images.pexels.com/photos/35652454/pexels-photo-35652454/free-photo-of-arduino-circuit-board-with-tools-on-workbench.jpeg?auto=compress&cs=tinysrgb&w=1600',
        tags: JSON.stringify(sanitized.tags),
        buildHighlights: buildHighlights || 'Built using salvaged components from local bin.',
        safetyNotes: sanitized.safetyNotes,
        isPublished: true,
      },
    });

    // Mark project workspace as published if linked
    if (workspaceProjectId) {
      await prisma.projectWorkspace.update({
        where: { id: workspaceProjectId },
        data: { isPublished: true },
      });
    }

    return NextResponse.json({ publication: newPublication }, { status: 201 });
  } catch (error: any) {
    console.error('Community POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to publish project' }, { status: 500 });
  }
}
