import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const data = await request.json()
    const { code, name, client, location, contractValue, startDate, endDate } = data
    
    if (!code || !name || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const newProject = await prisma.project.create({
      data: {
        code,
        name,
        client: client || '',
        location: location || '',
        contractValue: parseFloat(contractValue) || 0,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: 'ACTIVE'
      }
    })

    return NextResponse.json(newProject)
  } catch (error) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Project code already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
