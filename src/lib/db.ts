import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import path from 'path'

export type Page = {
  _id: string
  createdAt: string
  updatedAt: string

  name: string
  color: string
  key: string
}

export type Prompt = {
  _id: string
  createdAt: string
  updatedAt: string

  content: string
}

export type Article = {
  _id: string
  createdAt: string
  updatedAt: string

  title: string
  date: string
  desc: string
  content: string
  link: string
  author?: string
  thumbnail: string

  page?: Page
}

type DBData = {
  pages: Page[]
  prompts: Prompt[]
  articles: Article[]
}

const dbFile = path.join(process.cwd(), 'db.json')
const adapter = new JSONFile<DBData>(dbFile)
export const db = new Low<DBData>(adapter, { pages: [], prompts: [], articles: [] })

export async function initDB() {
  await db.read()
  db.data ||= {
    pages: [],
    prompts: [],
    articles: [],
  }
  await db.write()
}
