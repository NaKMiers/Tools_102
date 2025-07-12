import { db, initDB } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// [GET]: /page
export async function GET() {
  await initDB()
  return NextResponse.json({ pages: db.data.pages })
}

// [POST]: /page
export async function POST(req: NextRequest) {
  const { pageId, name, color, key } = await req.json()
  await initDB()

  if (!pageId || !name || !color || !key) {
    return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 })
  }

  const now = new Date().toISOString()

  db.data.pages.push({
    _id: now,
    createdAt: now,
    updatedAt: now,

    pageId,
    name,
    color,
    key,
  })
  await db.write()

  return NextResponse.json({ success: true })
}

// [PUT]: /page
export async function PUT(req: NextRequest) {
  const { id, pageId, name, color, key } = await req.json()
  await initDB()

  if (!id || !pageId || !name || !color || !key) {
    return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 })
  }

  const page = db.data.pages.find(page => page._id === id)
  if (!page) {
    return Response.json({ success: false, message: 'Page not found' }, { status: 404 })
  }

  page.pageId = pageId
  page.name = name
  page.color = color
  page.key = key
  page.updatedAt = new Date().toISOString()
  await db.write()

  return NextResponse.json({ success: true })
}

// [DELETE]: /page
export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  await initDB()

  db.data.pages = db.data.pages.filter(page => page._id !== id)
  await db.write()

  return NextResponse.json({ success: true })
}
