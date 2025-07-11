import { db, initDB } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// [GET]: /prompt
export async function GET() {
  await initDB()
  return NextResponse.json({ prompts: db.data.prompts })
}

// [POST]: /prompt
export async function POST(req: NextRequest) {
  const { content } = await req.json()
  await initDB()

  const now = new Date().toISOString()

  db.data.prompts.push({
    _id: now,
    content,
    createdAt: now,
    updatedAt: now,
  })
  await db.write()

  return NextResponse.json({ success: true })
}

// [PUT]: /prompt
export async function PUT(req: NextRequest) {
  const { id, content } = await req.json()
  await initDB()

  const prompt = db.data.prompts.find(prompt => prompt._id === id)
  if (!prompt) {
    return Response.json({ success: false, message: 'Prompt not found' }, { status: 404 })
  }

  prompt.content = content
  prompt.updatedAt = new Date().toISOString()
  await db.write()

  return NextResponse.json({ success: true })
}

// [DELETE]: /prompt
export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  await initDB()

  db.data.prompts = db.data.prompts.filter(prompt => prompt._id !== id)
  await db.write()

  return NextResponse.json({ success: true })
}
