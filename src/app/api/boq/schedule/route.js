import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/boq/schedule?projectId=xxx — get all BOQ items with schedule
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');
  if (!projectId) return NextResponse.json({ error: 'projectId required' }, { status: 400 });

  const items = await prisma.bOQItem.findMany({
    where: { projectId },
    orderBy: { sortOrder: 'asc' },
  });
  return NextResponse.json(items);
}

// PUT /api/boq/schedule — update start/end month for items
export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { updates } = await req.json();
  // updates: Array<{ id, startMonth, endMonth }>
  if (!Array.isArray(updates)) return NextResponse.json({ error: 'updates array required' }, { status: 400 });

  const results = await Promise.all(
    updates.map(({ id, startMonth, endMonth }) =>
      prisma.bOQItem.update({ where: { id }, data: { startMonth, endMonth } })
    )
  );

  return NextResponse.json({ success: true, updated: results.length });
}
