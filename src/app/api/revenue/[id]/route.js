import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';


export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const { status, notes } = await request.json();

    const invoice = await prisma.salesInvoice.update({
      where: { id },
      data: { status, notes },
    });
    
    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Error updating sales invoice:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui tagihan' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const invoice = await prisma.salesInvoice.findUnique({ where: { id } });
    if (!invoice) return NextResponse.json({ error: 'Tagihan tidak ditemukan' }, { status: 404 });

    // Hapus jurnal terkait jika ada
    await prisma.$transaction(async (tx) => {
      await tx.salesInvoice.delete({ where: { id } });
      if (invoice.journalVoucherId) {
        await tx.journalVoucher.delete({ where: { id: invoice.journalVoucherId } });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting sales invoice:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus tagihan' },
      { status: 500 }
    );
  }
}
