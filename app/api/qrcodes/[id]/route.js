// app/api/qrcodes/[id]/route.js
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// DELETE /api/qrcodes/:id -> verwijder één QR code uit de geschiedenis
export async function DELETE(request, { params }) {
  try {
    await prisma.qrCode.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Fout bij verwijderen QR code:', error)
    return NextResponse.json(
      { error: 'Kon QR code niet verwijderen' },
      { status: 500 }
    )
  }
}
