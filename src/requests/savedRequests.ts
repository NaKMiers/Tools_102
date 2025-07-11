// Saved  -------------------------------------

// [GET]: /saved
export const getSavedArticlesApi = async (
  query: string = '',
  option: RequestInit = { next: { revalidate: 0 } }
) => {
  const res = await fetch(`/api/saved${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]: /saved
export const saveArticleApi = async (data: any, pageId?: string) => {
  const res = await fetch('/api/saved', {
    method: 'POST',
    body: JSON.stringify(pageId ? { ...data, pageId } : data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]: /saved
export const removeSavedArticleApi = async (id: string) => {
  const res = await fetch(`/api/saved`, {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
