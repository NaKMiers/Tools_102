// Prompt  -------------------------------------

// [GET]: /prompt
export const getPromptsApi = async (
  query: string = '',
  option: RequestInit = { next: { revalidate: 0 } }
) => {
  const res = await fetch(`/api/prompt${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]: /prompt
export const createPromptApi = async (data: any) => {
  const res = await fetch('/api/prompt', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
// [PUT]: /prompt
export const updatePromptApi = async (id: string, data: any) => {
  const res = await fetch(`/api/prompt`, {
    method: 'PUT',
    body: JSON.stringify({ id, ...data }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]: /prompt
export const deletePromptApi = async (id: string) => {
  const res = await fetch(`/api/prompt`, {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
