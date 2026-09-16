import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function GET(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const documents = await prisma.document.findMany({
      include: {
        project: { select: { id: true, name: true, code: true } },
        uploader: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(documents);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await req.formData();
    const projectId = formData.get('projectId');
    const title = formData.get('title');
    const docNumber = formData.get('docNumber');
    const revision = formData.get('revision');
    const category = formData.get('category');
    const targets = formData.get('targets'); // Expected JSON string
    const file = formData.get('file');

    if (!projectId || !title || !docNumber || !category || !file) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'documents');
    await mkdir(uploadDir, { recursive: true });

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = uniqueSuffix + '-' + sanitizedName;
    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);
    const fileUrl = '/uploads/documents/' + filename;

    const document = await prisma.document.create({
      data: {
        projectId,
        title,
        docNumber,
        revision: revision || 'A',
        category,
        targets: targets || '[]',
        fileUrl,
        fileName: file.name,
        fileSize: file.size,
        uploadedBy: session.user.id
      },
      include: {
        project: { select: { id: true, name: true, code: true } },
        uploader: { select: { id: true, name: true } }
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE',
        module: 'ENGINEERING_DOC',
        recordId: document.id,
        newValue: JSON.stringify({ title, docNumber, category }),
      }
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
