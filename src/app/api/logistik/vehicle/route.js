import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { code, name, type, plateNumber, status } = data;

    if (!name || !type) {
      return NextResponse.json({ error: 'Nama dan Tipe wajib diisi' }, { status: 400 });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        code,
        name,
        type,
        plateNumber,
        status: status || 'ACTIVE',
      }
    });

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    console.error('Failed to create vehicle:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
