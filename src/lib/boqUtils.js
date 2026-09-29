import { prisma } from '@/lib/prisma';

export async function recalculateSortOrder(projectId) {
  const items = await prisma.bOQItem.findMany({
    where: { projectId },
    select: { id: true, code: true, level: true }
  });

  // Natural sort by code
  items.sort((a, b) => {
    const codeA = a.code || '';
    const codeB = b.code || '';
    return codeA.localeCompare(codeB, undefined, { numeric: true, sensitivity: 'base' });
  });

  // Update sortOrder and level dynamically
  const updates = items.map((item, index) => {
    const code = item.code || '';
    let newLevel = 1; // Default
    if (code) {
      const parts = code.split('.');
      if (parts.length > 0) {
        newLevel = Math.min(Math.max(parts.length, 1), 4);
      }
    }
    
    // Fallback: if it's purely alphabetical (like 'A'), it's level 1.
    // If it's '1.1', parts.length = 2 => level 2.
    // This perfectly matches standard BOQ hierarchies.

    return prisma.bOQItem.update({
      where: { id: item.id },
      data: { 
        sortOrder: index,
        level: newLevel
      }
    });
  });

  await prisma.(updates);
}
