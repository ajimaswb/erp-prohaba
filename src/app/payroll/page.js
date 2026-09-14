import { prisma } from '@/lib/prisma'
import PayrollClient from './PayrollClient'

export const revalidate = 0

export default async function PayrollPage() {
  const payrolls = await prisma.payroll.findMany({
    include: {
      project: true,
      items: {
        include: {
          employee: true
        }
      },
      approvals: {
        include: {
          approver: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Format data for client
  const formattedPayrolls = payrolls.map(p => ({
    id: p.id,
    period: p.period,
    projectName: p.project.name,
    totalAmount: p.totalAmount,
    status: p.status,
    notes: p.notes,
    createdAt: p.createdAt.toISOString(),
    employeeCount: p.items.length,
    items: p.items.map(item => ({
      id: item.id,
      employeeName: item.employee.name,
      position: item.employee.position,
      baseSalary: item.baseSalary,
      workDays: item.workDays,
      overtime: item.overtime,
      overtimePay: item.overtimePay,
      allowances: item.allowances,
      deductions: item.deductions,
      bpjsPay: item.bpjsPay,
      netSalary: item.netSalary,
    })),
    approvals: p.approvals.map(app => ({
      id: app.id,
      approverName: app.approver.name,
      role: app.role,
      action: app.action,
      notes: app.notes,
      createdAt: app.createdAt.toISOString()
    }))
  }))

  return (
    <PayrollClient payrolls={formattedPayrolls} />
  )
}
