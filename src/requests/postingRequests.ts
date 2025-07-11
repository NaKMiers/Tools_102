// Page  -------------------------------------

// [GET]: /posting
export const postingInitApi = async (
  query: string = '',
  option: RequestInit = { next: { revalidate: 0 } }
) => {
  const res = await fetch(`/api/posting${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]: /posting
export const postPostStep1Api = async (pageId: string, promptId: string, data: any) => {
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

// [PUT]: /posting
export const postPostStep2Api = async (pageId: string, data: any) => {
  const res = await fetch('/api/posting', {
    method: 'PUT',
    body: JSON.stringify({ pageId, ...data }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
