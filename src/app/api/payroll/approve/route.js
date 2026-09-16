import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const data = await request.json()
    const { payrollId, action } = data // action: SUBMIT, HRD_APPROVE, FINANCE_APPROVE, TOP_APPROVE

    // Simulate logged in user
    const user = await prisma.user.findFirst({
      where: { role: 'ADMIN' } // using ADMIN as a superuser for demo purposes
    })
    
    // Fallback if no user exists
    const actionUser = user || await prisma.user.findFirst()

    if (!actionUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    const payroll = await prisma.payroll.findUnique({
      where: { id: payrollId }
    })

    if (!payroll) {
      return NextResponse.json({ error: 'Payroll not found' }, { status: 404 })
    }

    let nextStatus = payroll.status
    
    switch (action) {
      case 'SUBMIT':
        if (payroll.status === 'DRAFT') nextStatus = 'SUBMITTED'
        break
      case 'HRD_APPROVE':
        if (payroll.status === 'SUBMITTED') nextStatus = 'HRD_APPROVED'
        break
      case 'FINANCE_APPROVE':
        if (payroll.status === 'HRD_APPROVED') nextStatus = 'FINANCE_APPROVED'
        break
      case 'TOP_APPROVE':
        if (payroll.status === 'FINANCE_APPROVED') nextStatus = 'PAID'
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Determine the approval state
    const approvalState = 
      action === 'HRD_APPROVE' ? 'APPROVED' :
      action === 'FINANCE_APPROVE' ? 'APPROVED' :
      action === 'TOP_APPROVE' ? 'APPROVED' : 'SUBMITTED'

    const step = 
      action === 'SUBMIT' ? 1 :
      action === 'HRD_APPROVE' ? 2 :
      action === 'FINANCE_APPROVE' ? 3 :
      action === 'TOP_APPROVE' ? 4 : 0

    // Create the approval record
    await prisma.payrollApproval.create({
      data: {
        payrollId,
        approverId: actionUser.id,
        status: approvalState,
        step,
        notes: `Approved via ${action}`
      }
    })

    // Update payroll status
    const updatedPayroll = await prisma.payroll.update({
      where: { id: payrollId },
      data: { status: nextStatus }
    })

    return NextResponse.json(updatedPayroll)
  } catch (error) {
    console.error('Error approving payroll:', error)
    return NextResponse.json({ error: 'Failed to approve payroll' }, { status: 500 })
  }
}
