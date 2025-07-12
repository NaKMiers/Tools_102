// Prompt
export * from './promptRequests'

// Page
export * from './pageRequests'

// Saved
export * from './savedRequests'

// Posting
export * from './postingRequests'

// [POST]: /convert-key
export const convertKeyApi = async (clientId: string, clientSecret: string, token: string) => {
  const res = await fetch('/api/convert-key', {
    method: 'POST',
    body: JSON.stringify({ clientId, clientSecret, token }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
