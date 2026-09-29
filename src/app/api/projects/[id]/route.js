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

    const { id } = params;
    
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
