// Page  -------------------------------------

// [GET]: /page
export const getPagesApi = async (
  query: string = '',
  option: RequestInit = { next: { revalidate: 0 } }
) => {
  const res = await fetch(`/api/page${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]: /page
export const createPageApi = async (data: any) => {
  const res = await fetch('/api/page', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]: /page
export const updatePageApi = async (id: string, data: any) => {
  const res = await fetch(`/api/page`, {
    method: 'PUT',
    body: JSON.stringify({ id, ...data }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]: /page
export const deletePageApi = async (id: string) => {
  const res = await fetch(`/api/page`, {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
