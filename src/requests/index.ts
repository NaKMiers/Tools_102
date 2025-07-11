// Prompt
export * from './promptRequests'

// Page
export * from './pageRequests'

// Saved
export * from './savedRequests'

// [POST]: /page
export const postNewPostApi = async (pageId: string, promptId: string, data: any) => {
  const res = await fetch('/api/posting', {
    method: 'POST',
    body: JSON.stringify({ pageId, promptId, ...data }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
