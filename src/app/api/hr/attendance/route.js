import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const data = await request.json()
    const { date, employeeId, status, overtime, notes } = data

    // Simulate logged in user
    const user = await prisma.user.findFirst({
      where: { role: 'PJO' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    const attendance = await prisma.attendance.create({
      data: {
        date: new Date(date),
        employeeId,
        status,
        overtime: parseFloat(overtime) || 0,
        notes,
        enteredBy: user.id
      }
    })

    return NextResponse.json(attendance)
  } catch (error) {
    console.error('Error saving attendance:', error)
    return NextResponse.json({ error: 'Failed to save attendance' }, { status: 500 })
  }
}
