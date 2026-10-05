import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function csvCell(value: string | number) {
  return `"${String(value).replace(/^([=+\-@])/, "'$1").replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  try {
    const workspace = await prisma.workspace.findFirst({
      where: { slug: 'ece-hardware-lab' },
      include: { members: { include: { user: { select: { name: true, role: true } } } } },
    });
    if (!workspace) return NextResponse.json({ error: 'Lab workspace not found. Run the seed command to load the demo lab.' }, { status: 404 });
    const [components, events, projects] = await Promise.all([
      prisma.component.findMany({ where: { workspaceId: workspace.id }, include: { category: true } }),
      prisma.impactEvent.findMany({ where: { workspaceId: workspace.id }, orderBy: { occurredAt: 'desc' } }),
      prisma.projectWorkspace.findMany({ where: { workspaceId: workspace.id }, orderBy: { updatedAt: 'desc' } }),
    ]);
    const totalItems = components.reduce((sum, item) => sum + item.quantity, 0);
    const reusableValue = components.reduce((sum, item) => sum + item.quantity * item.estimatedValueUsd, 0);
    const conditionCounts = components.reduce<Record<string, number>>((acc, item) => { acc[item.condition] = (acc[item.condition] || 0) + item.quantity; return acc; }, {});
    const categories = components.reduce<Record<string, number>>((acc, item) => { acc[item.category.name] = (acc[item.category.name] || 0) + item.quantity; return acc; }, {});
    const impact = events.reduce((sum, item) => ({ massKg: sum.massKg + item.massGrams / 1000, cost: sum.cost + item.avoidedCostUsd, parts: sum.parts + item.quantityUnits }), { massKg: 0, cost: 0, parts: 0 });
    const payload = {
      workspace: { name: workspace.name, type: workspace.type, description: workspace.description, members: workspace.members.map((member) => ({ name: member.user.name, role: member.role })) },
      inventory: { totalItems, uniqueTypes: components.length, reusableValue: Number(reusableValue.toFixed(2)), untestedItems: components.filter((item) => item.condition.toLowerCase().includes('untested')).reduce((sum, item) => sum + item.quantity, 0), conditions: conditionCounts, categories },
      activity: { reusedComponents: impact.parts, completedProjects: projects.filter((project) => project.status === 'completed').length, activeProjects: projects.filter((project) => project.status === 'in_progress').length, events: events.slice(0, 6).map((event) => ({ type: event.eventType, date: event.occurredAt, detail: event.notes || 'Lab activity recorded', quantity: event.quantityUnits })) },
      impact: { massKg: Number(impact.massKg.toFixed(2)), avoidedCost: Number(impact.cost.toFixed(2)), methodology: 'v3.0-standard', coverage: components.length ? 100 : 0 },
      recommendations: components.length ? ['Test unverified components before assigning them to student teams.', 'Record each project’s reused parts at completion to sharpen impact coverage.'] : ['Add your first salvage intake and label condition, category, and quantity.', 'Invite a lab editor once your inventory is ready for shared projects.'],
    };
    if (new URL(request.url).searchParams.get('format') === 'csv') {
      const rows = ['Category,Quantity,Estimated reusable value (USD),Condition'];
      components.forEach((item) => rows.push([item.category.name, item.quantity, (item.quantity * item.estimatedValueUsd).toFixed(2), item.condition].map(csvCell).join(',')));
      return new NextResponse(rows.join('\n'), { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="secondlife-lab-insights.csv"' } });
    }
    return NextResponse.json(payload);
  } catch (error) {
    console.error('Classroom API error:', error);
    return NextResponse.json({ error: 'Unable to load lab insights' }, { status: 500 });
  }
}
