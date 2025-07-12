import { initDB } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// [POST]: /convert-key
export async function POST(req: NextRequest) {
  const { token, clientId, clientSecret } = await req.json()
  if (!token || !clientId || !clientSecret) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  await initDB()

  // step 1: Convert to Long-Lived User Token
  const res1 = await fetch(
    `https://graph.facebook.com/v22.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${clientId}&client_secret=${clientSecret}&fb_exchange_token=${token}`
  )
  const { access_token: accessToken } = await res1.json()

  if (!accessToken) {
    return NextResponse.json({ error: 'Failed to convert token' }, { status: 400 })
  }

  // step 2: Get Lifeless User Token
  const res2 = await fetch(`https://graph.facebook.com/v22.0/me/accounts?access_token=${accessToken}`)
  const data = await res2.json()

  return NextResponse.json({ data, success: true })
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
