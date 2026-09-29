import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';



export async function POST(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await req.formData();
    const projectId = formData.get('projectId');
    const file = formData.get('file');

    if (!projectId || !file) {
      return NextResponse.json({ error: 'projectId dan file diperlukan' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const wb = XLSX.read(buffer, { type: 'buffer' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rawRows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return NextResponse.json({ error: 'Project tidak ditemukan' }, { status: 404 });

    // Find data start row
    let dataStartRow = 0;
    for (let i = 0; i < rawRows.length; i++) {
      const row = rawRows[i];
      if (row && row.some(c => typeof c === 'string' && c.toLowerCase().includes('uraian'))) {
        dataStartRow = i + 3;
        break;
      }
    }

    const items = [];
    let currentGroup = null;
    let currentNo = null;
    let sortOrder = 0;

    for (let i = dataStartRow; i < rawRows.length; i++) {
      const row = rawRows[i];
      if (!row || row.every(c => c === null || c === undefined || c === '')) continue;

      const col0 = row[0];
      const col1 = row[1];
      const col2 = row[2];
      const col3 = row[3];
      const col4 = row[4];
      const col5 = row[5];
      const col6 = row[6];
      const col7 = row[7];
      const col8 = row[8];

      const desc = col1 != null ? String(col1).trim() : (col0 != null ? String(col0).trim() : null);
      if (!desc) continue;

      const baseItem = {
        projectId,
        unit: col3 != null ? String(col3) : null,
        quantity: typeof col2 === 'number' ? col2 : null,
        costMaterial: typeof col4 === 'number' ? col4 : null,
        costLabor: typeof col5 === 'number' ? col5 : null,
        totalMaterial: typeof col6 === 'number' ? col6 : null,
        totalLabor: typeof col7 === 'number' ? col7 : null,
        totalPrice: typeof col8 === 'number' ? col8 : null,
        sortOrder: sortOrder++,
      };

      if (typeof col0 === 'string' && /^[A-Z]$/.test(col0.trim())) {
        currentGroup = col0.trim();
        currentNo = null;
        items.push({ ...baseItem, groupCode: currentGroup, no: null, subNo: null, level: 1, code: currentGroup, description: desc, unit: null, quantity: null, costMaterial: null, costLabor: null, totalMaterial: null, totalLabor: null, totalPrice: null });
      } else if (typeof col0 === 'number' && Number.isInteger(col0)) {
        currentNo = String(col0);
        items.push({ ...baseItem, groupCode: currentGroup, no: currentNo, subNo: null, level: 2, code: currentGroup ? `${currentGroup}.${currentNo}` : currentNo, description: desc });
      } else if (col0 === null && col1 != null) {
        const subMatch = String(col1).trim().match(/^([a-z])\.\s*/);
        if (subMatch) {
          const subNo = subMatch[1];
          items.push({ ...baseItem, groupCode: currentGroup, no: currentNo, subNo, level: 3, code: `${currentGroup || ''}.${currentNo || ''}.${subNo}`, description: String(col1).replace(/^[a-z]\.\s*/, '').trim() });
        } else {
          items.push({ ...baseItem, groupCode: currentGroup, no: currentNo, subNo: null, level: 4, code: `${currentGroup || ''}.${currentNo || ''}.detail.${sortOrder}`, description: desc });
        }
      }
    }

    const contractValue = project.contractValue || 0;
    const itemsWithWeight = items.map(item => ({
      ...item,
      weight: contractValue && item.totalPrice ? parseFloat(((item.totalPrice / contractValue) * 100).toFixed(4)) : null,
    }));

    await prisma.bOQItem.deleteMany({ where: { projectId } });
    await prisma.bOQItem.createMany({ data: itemsWithWeight });

    return NextResponse.json({ success: true, count: itemsWithWeight.length });
  } catch (err) {
    console.error('BOQ upload error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
