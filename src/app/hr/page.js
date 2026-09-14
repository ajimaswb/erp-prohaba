import { prisma } from '@/lib/prisma'
import HRClient from './HRClient'

export const revalidate = 0

export default async function HRPage() {
  const employees = await prisma.employee.findMany({
    include: {
      projects: {
        include: {
          project: true
        }
      }
    }
  })

  const attendances = await prisma.attendance.findMany({
    include: {
      employee: true,
      enterUser: {
        select: {
          name: true
        }
      }
    },
    orderBy: {
      date: 'desc'
    }
  })

  // Format data for client
  const formattedEmployees = employees.map(emp => ({
    ...emp,
    projectsCount: emp.projects.length,
    activeProject: emp.projects[0]?.project?.name || 'Tidak Ada'
  }))

  const formattedAttendances = attendances.map(att => ({
    id: att.id,
    date: att.date.toISOString(),
    employeeName: att.employee.name,
    status: att.status,
    overtime: att.overtime,
    enteredBy: att.enterUser.name,
    notes: att.notes
  }))

  return (
    <HRClient 
      employees={formattedEmployees} 
      attendances={formattedAttendances} 
    />
  )
}
