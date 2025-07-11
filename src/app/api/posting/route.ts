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
  [Tiếng Việt]
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
  // return NextResponse.json(
  //   { content: 'This is a placeholder response for POST /posting', imageUrl: thumbnail, success: true },
  //   { status: 200 }
  // )
}

// [PUT]: /posting
export async function PUT(req: NextRequest) {
  const { content, imageUrl, pageId } = await req.json()
  await initDB()

  const page = db.data.pages.find(p => p._id === pageId)
  if (!page) return NextResponse.json({ message: 'Page not found' }, { status: 400 })

  const facebookAccessToken = page.key
  const facebookPageId = process.env.FACEBOOK_PAGE_ID

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

/*
How to get lifeless facebook access token for "user token"

1. copy temporary access token on facebook developer

2. run
curl -X GET "https://graph.facebook.com/v22.0/oauth/access_token
?grant_type=fb_exchange_token
&client_id=3673247972910296
&client_secret=ae3971562d4ed31b1bcef132f4f5e6ee
&fb_exchange_token=EAA0MzLCY5NgBPDV4sQJezbGsSsDtp8L99uRdPADmny1Lwp0TXHTil9tQDYkSvaMdeLbutvhxAZCduB4r9WZBZCRghA9TUXa7dhnVbciOgtID2Lrf3W3FtegSbM9J8iTgIWQDGlLVPKEmJMzI72jJGfjofaZBLiVbZCFIvDIcARkcbDLM5wDX0cXRut2YU3cZBRCwh6w0nxYAyqN2b7lKprWHHlZBnqS0FYyftr86QZDZD"

-> will receive LONG_LIVED_USER_TOKEN

3. run
curl -X GET "https://graph.facebook.com/v22.0/me/accounts?access_token=LONG_LIVED_USER_TOKEN"

-> will receive LIFELESS_USER_TOKEN


*/
