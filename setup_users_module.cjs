const fs = require('fs');
const path = require('path');

// Ensure directories exist
fs.mkdirSync('src/app/api/users/[id]', { recursive: true });

// 1. API: /api/users/route.js
const routeCode = `import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'TOP_MANAGEMENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    // Check existing
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        isActive: true,
      }
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE',
        module: 'USER_MANAGEMENT',
        recordId: user.id,
        newValue: JSON.stringify({ name: user.name, email: user.email, role: user.role }),
      }
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`;
fs.writeFileSync('src/app/api/users/route.js', routeCode, 'utf8');

// 2. API: /api/users/[id]/route.js
const idRouteCode = `import { NextResponse } from 'next/server';
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
`;
fs.writeFileSync('src/app/api/users/[id]/route.js', idRouteCode, 'utf8');

console.log("APIs created.");
