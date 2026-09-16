import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function PUT(req, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'TOP_MANAGEMENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;
    const body = await req.json();
    const { name, email, role, isActive, password } = body;

    const data = { name, email, role, isActive };
    
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    // Get old data for audit log
    const oldData = await prisma.user.findUnique({ where: { id } });

    const user = await prisma.user.update({
      where: { id },
      data
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE',
        module: 'USER_MANAGEMENT',
        recordId: user.id,
        oldValue: JSON.stringify({ role: oldData.role, isActive: oldData.isActive }),
        newValue: JSON.stringify({ role: user.role, isActive: user.isActive }),
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
