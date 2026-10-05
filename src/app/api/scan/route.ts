import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ScanOrchestrator, VisionScanRequest } from '@/domain/scanner';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { primaryPhotoUrl, labelPhotoUrl, pinPhotoUrl, filename, fileSizeBytes, mimeType } = body;

    const workspace = await prisma.workspace.findFirst({
      where: { slug: 'alexs-maker-bench' },
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    const scanRequest: VisionScanRequest = {
      primaryPhotoUrl: primaryPhotoUrl || '/images/bench_arduino.jpg',
      labelPhotoUrl,
      pinPhotoUrl,
      filename: filename || 'component_capture.jpg',
      fileSizeBytes: fileSizeBytes || 2400000,
      mimeType: mimeType || 'image/jpeg',
    };

    const orchestrator = new ScanOrchestrator();
    const scanResult = await orchestrator.runScan(scanRequest);

    // Persist scan record in database
    const savedScan = await prisma.componentScan.create({
      data: {
        workspaceId: workspace.id,
        primaryPhotoUrl: scanRequest.primaryPhotoUrl,
        labelPhotoUrl: scanRequest.labelPhotoUrl,
        pinPhotoUrl: scanRequest.pinPhotoUrl,
        providerName: scanResult.providerName,
        modelVersion: scanResult.modelVersion,
        status: 'completed',
        highestConfidence: scanResult.highestConfidence,
        summaryText: scanResult.summaryText,
        evidenceSummary: scanResult.evidenceSummary,
        candidates: {
          create: scanResult.candidates.map((c) => ({
            rank: c.rank,
            name: c.name,
            categoryName: c.categoryName,
            partNumber: c.partNumber,
            manufacturer: c.manufacturer,
            confidence: c.confidence,
            evidence: c.evidence,
            whyExplanation: c.whyExplanation,
            capabilities: JSON.stringify(c.capabilities),
            specifications: JSON.stringify(c.specifications),
            safetyNotes: c.safetyNotes,
            disposition: 'suggested',
          })),
        },
      },
      include: {
        candidates: true,
      },
    });

    return NextResponse.json({
      scanId: savedScan.id,
      scanResult,
    });
  } catch (error: any) {
    console.error('Scan API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process component scan' }, { status: 500 });
  }
}
