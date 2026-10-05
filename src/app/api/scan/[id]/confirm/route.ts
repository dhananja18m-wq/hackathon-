import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { IdentificationResolver } from '@/domain/identification';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { candidateRank, userEdits } = body;

    const scan = await prisma.componentScan.findUnique({
      where: { id: params.id },
      include: { candidates: true },
    });

    if (!scan) {
      return NextResponse.json({ error: 'Scan record not found' }, { status: 404 });
    }

    const selectedCandidate = scan.candidates.find((c) => c.rank === (candidateRank || 1)) || scan.candidates[0];

    let parsedCapabilities: string[] = [];
    let parsedSpecs: Array<{ key: string; value: string }> = [];

    try {
      parsedCapabilities = JSON.parse(selectedCandidate.capabilities || '[]');
      parsedSpecs = JSON.parse(selectedCandidate.specifications || '[]');
    } catch (e) {
      console.warn('JSON parse warning:', e);
    }

    const resolved = IdentificationResolver.resolveConfirmation(
      {
        rank: selectedCandidate.rank,
        name: selectedCandidate.name,
        categoryName: selectedCandidate.categoryName,
        partNumber: selectedCandidate.partNumber || undefined,
        manufacturer: selectedCandidate.manufacturer || undefined,
        confidence: selectedCandidate.confidence,
        evidence: selectedCandidate.evidence,
        whyExplanation: selectedCandidate.whyExplanation,
        capabilities: parsedCapabilities,
        specifications: parsedSpecs,
        safetyNotes: selectedCandidate.safetyNotes || undefined,
      },
      userEdits
    );

    // Ensure category exists
    let category = await prisma.componentCategory.findFirst({
      where: { name: resolved.categoryName },
    });

    if (!category) {
      category = await prisma.componentCategory.create({
        data: {
          name: resolved.categoryName,
          slug: resolved.categoryName.toLowerCase().replace(/\s+/g, '-'),
        },
      });
    }

    // Create Component with full provenance
    const newComponent = await prisma.component.create({
      data: {
        workspaceId: scan.workspaceId,
        categoryId: category.id,
        name: resolved.name,
        partNumber: resolved.partNumber,
        manufacturer: resolved.manufacturer,
        description: selectedCandidate.whyExplanation,
        quantity: resolved.quantity,
        condition: resolved.condition,
        approxWeightG: resolved.approxWeightG,
        confidenceScore: resolved.confidenceScore,
        provenanceSource: resolved.provenanceSource,
        photoUrl: resolved.photoUrl,
        location: resolved.location,
        notes: resolved.notes,
        scanId: scan.id,
        capabilities: {
          create: resolved.capabilities.map((c) => ({
            name: c.name,
            category: c.category,
            provenance: c.provenance,
          })),
        },
        specifications: {
          create: resolved.specifications.map((s) => ({
            key: s.key,
            value: s.value,
            provenance: s.provenance,
          })),
        },
        compatibilities: {
          create: resolved.compatibilities.map((cp) => ({
            platform: cp.platform,
            isCompatible: cp.isCompatible,
            notes: cp.notes,
          })),
        },
        safetyFlags: {
          create: resolved.safetyFlags.map((sf) => ({
            level: sf.level,
            title: sf.title,
            description: sf.description,
          })),
        },
        tags: {
          create: [
            { tag: resolved.categoryName.toLowerCase() },
            { tag: 'scanned_ai' },
          ],
        },
      },
      include: {
        category: true,
        capabilities: true,
        specifications: true,
        compatibilities: true,
        safetyFlags: true,
      },
    });

    // Update candidate disposition
    await prisma.componentIdentificationCandidate.updateMany({
      where: { scanId: scan.id, rank: selectedCandidate.rank },
      data: { disposition: 'confirmed' },
    });

    // Log Activity
    await prisma.inventoryActivity.create({
      data: {
        workspaceId: scan.workspaceId,
        componentId: newComponent.id,
        action: 'confirmed_scan',
        details: `Confirmed and added ${newComponent.name} (${newComponent.quantity} unit) with ${resolved.confidenceScore}% confidence`,
      },
    });

    return NextResponse.json({
      success: true,
      component: newComponent,
    });
  } catch (error: any) {
    console.error('Scan confirm error:', error);
    return NextResponse.json({ error: error.message || 'Failed to confirm scan' }, { status: 500 });
  }
}
