// app/api/qrcodes/route.js
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET /api/qrcodes -> haal alle opgeslagen QR codes op, nieuwste eerst
export async function GET() {
  try {
    const qrcodes = await prisma.qrCode.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(qrcodes)
  } catch (error) {
    console.error('Fout bij ophalen QR codes:', error)
    return NextResponse.json(
      { error: 'Kon QR codes niet ophalen' },
      { status: 500 }
    )
  }
}

// POST /api/qrcodes -> sla een nieuwe QR code op
export async function POST(request) {
  try {
    const body = await request.json()
    const { type, label, data, dotColor, bgColor, dotStyle } = body

    if (!type || !data) {
      return NextResponse.json(
        { error: 'type en data zijn verplicht' },
        { status: 400 }
      )
    }

    const qrcode = await prisma.qrCode.create({
      data: {
        type,
        label: label || data.slice(0, 50),
        data,
        dotColor: dotColor || '#6366f1',
        bgColor: bgColor || '#ffffff',
        dotStyle: dotStyle || 'rounded',
      },
    })

    return NextResponse.json(qrcode, { status: 201 })
  } catch (error) {
    console.error('Fout bij opslaan QR code:', error)
    return NextResponse.json(
      { error: 'Kon QR code niet opslaan' },
      { status: 500 }
    )
  }
}
