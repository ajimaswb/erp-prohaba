import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { unlink } from 'fs/promises';
import path from 'path';
import fs from 'fs';

export async function DELETE(req, { params }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.user.role !== 'TOP_MANAGEMENT' && session.user.role !== 'ENGINEERING' && session.user.role !== 'PJO') {
       return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const document = await prisma.document.findUnique({ where: { id } });
    if (!document) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Attempt to delete physical file
    if (document.fileUrl) {
      // fileUrl is like /uploads/documents/...
      const filepath = path.join(process.cwd(), 'public', document.fileUrl);
      if (fs.existsSync(filepath)) {
        await unlink(filepath);
      }
    }

    await prisma.document.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'DELETE',
        module: 'ENGINEERING_DOC',
        recordId: id,
        oldValue: JSON.stringify({ title: document.title, fileUrl: document.fileUrl }),
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
