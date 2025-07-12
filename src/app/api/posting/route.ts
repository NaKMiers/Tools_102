import { db, initDB } from '@/lib/db'
import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// [GET]: /posting
export async function GET(req: NextRequest) {
  await initDB()

  const pages = db.data.pages || []
  const prompts = db.data.prompts || []
  const articles = db.data.articles || []

  return NextResponse.json({ pages, prompts, articles }, { status: 200 })
}

// [POST]: /posting
export async function POST(req: NextRequest) {
  const { title, date, desc, content, link, author, thumbnail, promptId, pageId } = await req.json()
  await initDB()

  const prompt = db.data.prompts.find(p => p._id === promptId)
  if (!prompt) return NextResponse.json({ message: 'Prompt not found' }, { status: 400 })

  const page = db.data.pages.find(p => p._id === pageId)
  if (!page) return NextResponse.json({ message: 'Page not found' }, { status: 400 })

  const finalPrompt = `\n
  ${prompt.content}

  Title: ${title}
  Date: ${date}
  Description: ${desc}
  Content: ${content}
  Link: ${link}
  Auth: ${author}
  Thumbnail: ${thumbnail}

  Lưu ý: ko dùng dấu "*"
`

  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    system: 'Bạn là một content creator chuyên nghiệp trên nền tảng Facebook',
    schema: z.object({
      content: z.string(),
      imageUrl: z.string(),
    }),
    prompt: finalPrompt,
  })

  return NextResponse.json({ content: object.content, imageUrl: object.imageUrl, success: true })
}

// [PUT]: /posting
export async function PUT(req: NextRequest) {
  const { content, imageUrl, pageId } = await req.json()
  await initDB()

  const page = db.data.pages.find(p => p._id === pageId)
  if (!page) return NextResponse.json({ message: 'Page not found' }, { status: 400 })

  const facebookAccessToken = page.key
  const facebookPageId = page.pageId

  if (!facebookAccessToken || !facebookPageId) {
    return NextResponse.json({ message: 'Missing Facebook credentials' }, { status: 500 })
  }

  const fbRes = await fetch(`https://graph.facebook.com/v22.0/${facebookPageId}/photos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: content,
      url: imageUrl,
      access_token: facebookAccessToken,
    }),
  })

  const fbData = await fbRes.json()

  if (!fbRes.ok) {
    console.error('Facebook Post Failed:', fbData)
    return NextResponse.json({ message: 'Failed to post to Facebook', fbData }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
