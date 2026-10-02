import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function DELETE(req, { params }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (session.user.role !== 'TOP_MANAGEMENT') {
      return NextResponse.json({ error: 'Forbidden: Hak akses ditolak. Hanya TOP_MANAGEMENT yang dapat menghapus proyek.' }, { status: 403 });
    }

    const { id } = await params;
    
    // Project dan semua relasinya akan dihapus otomatis karena onDelete: Cascade di schema
    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE project error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await req.json();

    const updated = await prisma.project.update({
      where: { id },
      data: {
        code: body.code,
        name: body.name,
        client: body.client,
        location: body.location,
        contractValue: body.contractValue ? parseFloat(body.contractValue) : null,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        status: body.status,
      }
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('PATCH project error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
