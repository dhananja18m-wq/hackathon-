import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ImpactLedgerService } from '@/domain/impactLedger';

export const dynamic = 'force-dynamic';
const validRanges = ['30_days', '90_days', 'all_time'] as const;
type Range = (typeof validRanges)[number];

function csvCell(value: string | number) {
  const text = String(value).replace(/^([=+\-@])/, "'$1");
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawRange = searchParams.get('range') || 'all_time';
    const range: Range = validRanges.includes(rawRange as Range) ? (rawRange as Range) : 'all_time';
    const workspace = await prisma.workspace.findFirst({ where: { slug: 'alexs-maker-bench' } });
    if (!workspace) return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });

    const days = range === '30_days' ? 30 : range === '90_days' ? 90 : 3650;
    const since = new Date(Date.now() - days * 86_400_000);
    const events = await prisma.impactEvent.findMany({
      where: { workspaceId: workspace.id, occurredAt: { gte: since } },
      include: { component: { include: { category: true } } }, orderBy: { occurredAt: 'desc' },
    });
    const [components, projectCount] = await Promise.all([
      prisma.component.findMany({ where: { workspaceId: workspace.id, status: { not: 'archived' } } }),
      prisma.projectWorkspace.count({ where: { workspaceId: workspace.id } }),
    ]);
    const totals = events.reduce((total, event) => ({ mass: total.mass + event.massGrams, cost: total.cost + event.avoidedCostUsd, parts: total.parts + event.quantityUnits, co2e: total.co2e + event.co2eAvoidedKg }), { mass: 0, cost: 0, parts: 0, co2e: 0 });
    const categories = new Map<string, { massGrams: number; count: number; co2eKg: number }>();
    for (const event of events) {
      const category = event.component?.category.name || (event.eventType === 'build_completed' ? 'Completed builds' : 'Rescued inventory');
      const row = categories.get(category) || { massGrams: 0, count: 0, co2eKg: 0 };
      row.massGrams += event.massGrams; row.count += event.quantityUnits; row.co2eKg += event.co2eAvoidedKg;
      categories.set(category, row);
    }
    const untested = components.filter((item) => item.condition.toLowerCase().includes('untested')).length;
    const stalled = await prisma.projectWorkspace.count({ where: { workspaceId: workspace.id, status: 'paused' } });
    const actionableInsights = [
      ...(untested ? [{ type: 'inventory', message: `${untested} inventory item${untested === 1 ? '' : 's'} still need${untested === 1 ? 's' : ''} a quick test before matching to a build.`, action: 'Review untested inventory in My inventory.' }] : []),
      ...(stalled ? [{ type: 'project', message: `${stalled} project${stalled === 1 ? ' is' : 's are'} paused. A short review can turn reserved parts into a finished outcome.`, action: 'Open My project plans.' }] : []),
      { type: 'method', message: 'Log the components actually reused when you complete a build to improve data coverage.', action: 'All figures are estimates from recorded reuse events.' },
    ];
    const payload = {
      summary: { totalMassKg: Number((totals.mass / 1000).toFixed(3)), totalCostAvoided: Number(totals.cost.toFixed(2)), totalPartsReused: totals.parts, totalCo2eKg: Number(totals.co2e.toFixed(3)), eventCount: events.length, projectCount, activeInventory: components.reduce((n, item) => n + item.quantity, 0), dateRange: range, methodology: { version: ImpactLedgerService.METHODOLOGY.VERSION, co2eFactor: ImpactLedgerService.METHODOLOGY.CO2E_FACTOR_KG_PER_KG, standard: 'SECONDLIFE AI documented estimate methodology' } },
      categoryBreakdowns: Array.from(categories.entries()).map(([category, row]) => ({ category, massKg: Number((row.massGrams / 1000).toFixed(3)), count: row.count, co2eKg: Number(row.co2eKg.toFixed(3)) })),
      actionableInsights,
      recentEvents: events.slice(0, 8).map((event) => ({ id: event.id, type: event.eventType, date: event.occurredAt, notes: event.notes, quantity: event.quantityUnits })),
    };
    if (searchParams.get('format') === 'csv') {
      const rows = ['Date,Event,Quantity,Mass (kg),Estimated cost avoided (USD),Estimated CO2e avoided (kg),Notes'];
      events.forEach((event) => rows.push([event.occurredAt.toISOString().slice(0, 10), event.eventType, event.quantityUnits, (event.massGrams / 1000).toFixed(3), event.avoidedCostUsd.toFixed(2), event.co2eAvoidedKg.toFixed(3), event.notes || ''].map(csvCell).join(',')));
      return new NextResponse(rows.join('\n'), { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="secondlife-impact.csv"' } });
    }
    return NextResponse.json(payload);
  } catch (error) {
    console.error('Impact API error:', error);
    return NextResponse.json({ error: 'Failed to compute impact' }, { status: 500 });
  }
}
