import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const component = await prisma.component.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        capabilities: true,
        specifications: true,
        tags: true,
        activities: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!component) {
      return NextResponse.json({ error: 'Component not found' }, { status: 404 });
    }

    return NextResponse.json({ component });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch component' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, condition, quantity, approxWeightG, location, notes } = body;

    const updated = await prisma.component.update({
      where: { id: params.id },
      data: {
        name,
        condition,
        quantity: quantity !== undefined ? Number(quantity) : undefined,
        approxWeightG: approxWeightG !== undefined ? Number(approxWeightG) : undefined,
        location,
        notes,
      },
      include: {
        category: true,
        capabilities: true,
        specifications: true,
      },
    });

    await prisma.inventoryActivity.create({
      data: {
        workspaceId: updated.workspaceId,
        componentId: updated.id,
        action: 'updated',
        details: `Updated properties for ${updated.name}`,
      },
    });

    return NextResponse.json({ component: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update component' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const existing = await prisma.component.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Component not found' }, { status: 404 });
    }

    // Soft delete / archive
    await prisma.component.update({
      where: { id: params.id },
      data: { status: 'archived' },
    });

    await prisma.inventoryActivity.create({
      data: {
        workspaceId: existing.workspaceId,
        componentId: existing.id,
        action: 'archived',
        details: `Archived ${existing.name} from active inventory`,
      },
    });

    return NextResponse.json({ success: true, message: 'Component archived' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to archive component' }, { status: 500 });
  }
}
