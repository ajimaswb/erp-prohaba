import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    
    const newItem = await prisma.cuttingList.create({
      data: {
        fabricationOrderId: body.fabricationOrderId,
        materialName: body.materialName,
        dimensions: body.dimensions,
        quantity: parseInt(body.quantity) || 1,
        status: 'PENDING'
      }
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
