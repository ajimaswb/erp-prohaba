import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 })
    }

    const progressItems = await prisma.progressItem.findMany({
      where: { projectId },
      include: {
        boqItem: true,
        user: {
          select: { name: true }
        }
      },
      orderBy: { reportDate: 'desc' }
    })
    
    return NextResponse.json(progressItems)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    const { projectId, boqItemId, reportDate, progressPct, notes, photos, inputBy } = data
    
    if (!projectId || !boqItemId || progressPct === undefined || !inputBy) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const progress = await prisma.progressItem.create({
      data: {
        projectId,
        boqItemId,
        reportDate: reportDate ? new Date(reportDate) : new Date(),
        progressPct: parseFloat(progressPct),
        notes: notes || null,
        photos: photos ? JSON.stringify(photos) : null,
        inputBy
      }
    })

    return NextResponse.json(progress)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
