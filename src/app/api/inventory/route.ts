import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ComponentNormalizer } from '@/domain/normalizer';
import { CapabilityResolver } from '@/domain/capability';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const condition = searchParams.get('condition') || '';

    const workspace = await prisma.workspace.findFirst({
      where: { slug: 'alexs-maker-bench' },
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    const whereClause: any = {
      workspaceId: workspace.id,
      status: { not: 'archived' },
    };

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { partNumber: { contains: search } },
        { capabilities: { some: { name: { contains: search } } } },
      ];
    }

    if (category && category !== 'All categories') {
      whereClause.category = {
        name: { equals: category },
      };
    }

    if (condition && condition !== 'All conditions') {
      whereClause.condition = { equals: condition };
    }

    const components = await prisma.component.findMany({
      where: whereClause,
      include: {
        category: true,
        capabilities: true,
        specifications: true,
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const categories = await prisma.componentCategory.findMany();

    return NextResponse.json({
      components,
      categories,
      totalCount: components.length,
      totalUnits: components.reduce((sum, c) => sum + c.quantity, 0),
    });
  } catch (error) {
    console.error('API Inventory GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, categoryName, partNumber, quantity, condition, approxWeightG, notes, photoUrl, location } = body;

    const workspace = await prisma.workspace.findFirst({
      where: { slug: 'alexs-maker-bench' },
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    // Run domain normalization & heuristic derivation
    const normalized = ComponentNormalizer.normalize({
      name,
      category: categoryName,
      partNumber,
      quantity: Number(quantity) || 1,
      condition,
      approxWeightG: approxWeightG ? Number(approxWeightG) : undefined,
    });

    // Ensure category exists
    let category = await prisma.componentCategory.findFirst({
      where: { name: normalized.category },
    });

    if (!category) {
      category = await prisma.componentCategory.create({
        data: {
          name: normalized.category,
          slug: normalized.category.toLowerCase().replace(/\s+/g, '-'),
        },
      });
    }

    const derivedCapabilities = CapabilityResolver.deriveCapabilities(
      normalized.canonicalName,
      normalized.category,
      normalized.specifications
    );

    const newComponent = await prisma.component.create({
      data: {
        workspaceId: workspace.id,
        categoryId: category.id,
        name: normalized.canonicalName,
        partNumber: normalized.partNumber,
        manufacturer: normalized.manufacturer,
        description: normalized.description,
        quantity: Number(quantity) || 1,
        condition: condition || 'Used · working',
        approxWeightG: normalized.approxWeightG,
        estimatedValueUsd: normalized.estimatedValueUsd,
        confidenceScore: normalized.confidenceScore,
        photoUrl: photoUrl || '/images/bench_arduino.jpg',
        location: location || 'Bench Drawer A',
        notes: notes || '',
        capabilities: {
          create: derivedCapabilities.map((c) => ({
            name: c.name,
            category: c.category,
          })),
        },
        specifications: {
          create: normalized.specifications.map((s) => ({
            key: s.key,
            value: s.value,
          })),
        },
        tags: {
          create: normalized.tags.map((t) => ({ tag: t })),
        },
      },
      include: {
        category: true,
        capabilities: true,
        specifications: true,
      },
    });

    await prisma.inventoryActivity.create({
      data: {
        workspaceId: workspace.id,
        componentId: newComponent.id,
        action: 'created',
        details: `Identified and added ${newComponent.name} (${newComponent.quantity} unit)`,
      },
    });

    return NextResponse.json({ component: newComponent }, { status: 201 });
  } catch (error) {
    console.error('API Inventory POST Error:', error);
    return NextResponse.json({ error: 'Failed to create component' }, { status: 500 });
  }
}
