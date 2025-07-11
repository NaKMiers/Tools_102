import { db, initDB } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// [GET]: /saved
export async function GET() {
  await initDB()
  return NextResponse.json({ articles: db.data.articles })
}

// [POST]: /saved
export async function POST(req: NextRequest) {
  const body = await req.json()
  await initDB()

  const now = new Date().toISOString()

  db.data.articles.push({
    _id: now,
    createdAt: now,
    updatedAt: now,
    ...body,
  })
  await db.write()

  return NextResponse.json({ success: true })
}

// [DELETE]: /saved
export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  await initDB()

  db.data.articles = db.data.articles.filter(article => article._id !== id)
  await db.write()

  return NextResponse.json({ success: true })
}
