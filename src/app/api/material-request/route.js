import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const data = await request.json()
    const { projectId, priority, notes, items, requestedBy } = data
    
    if (!projectId || !items || items.length === 0 || !requestedBy) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Generate MR Number
    const count = await prisma.materialRequest.count()
    const mrNumber = `MR-${new Date().getFullYear()}-${(count + 1).toString().padStart(3, '0')}`

    const materialRequest = await prisma.materialRequest.create({
      data: {
        mrNumber,
        projectId,
        requestedBy,
        priority: priority || 'NORMAL',
        notes,
        status: 'SUBMITTED',
        items: {
          create: items.map(item => ({
            description: item.description,
            unit: item.unit,
            quantity: parseFloat(item.quantity)
          }))
        }
      },
      include: {
        items: true
      }
    })

    return NextResponse.json(materialRequest)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
