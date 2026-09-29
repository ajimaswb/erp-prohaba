import { prisma } from '@/lib/prisma';

export async function recalculateSortOrder(projectId) {
  const items = await prisma.bOQItem.findMany({
    where: { projectId },
    select: { id: true, code: true }
  });

  // Natural sort by code
  // Example: "1.1", "1.2", "1.10", "A", "A.1", "B"
  items.sort((a, b) => {
    const codeA = a.code || '';
    const codeB = b.code || '';
    return codeA.localeCompare(codeB, undefined, { numeric: true, sensitivity: 'base' });
  });

  // Update sortOrder for all items sequentially
  const updates = items.map((item, index) => {
    return prisma.bOQItem.update({
      where: { id: item.id },
      data: { sortOrder: index }
    });
  });

  await prisma.$transaction(updates);
}
