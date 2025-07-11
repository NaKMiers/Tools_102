'use client'

import ArticleCard from '@/components/ArticleCard'
import Creations from '@/components/Creations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Page } from '@/lib/db'
import { copy } from '@/lib/toolsClient'
import { getPagesApi } from '@/requests'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

const API_KEY = 'f11f346ee65c40cb9fb02b8b979c3c9d'
const API_BASE = 'https://newsapi.org/v2/everything'

const languages = [
  { value: 'all', label: 'All' },
  { value: 'en', label: 'English' },
  { value: 'vi', label: 'Vietnamese' },
  { value: 'fr', label: 'French' },
]

const sortOptions = [
  { value: 'publishedAt', label: 'Newest' },
  { value: 'relevancy', label: 'Most Relevant' },
  { value: 'popularity', label: 'Most Popular' },
]

export default function PostingPage() {
  // states
  const [query, setQuery] = useState('netflix movies')
  const [qInTitle, setQInTitle] = useState('')
  const [language, setLanguage] = useState('')
  const [sortBy, setSortBy] = useState('publishedAt')
  const [domains, setDomains] = useState('')
  const [excludeDomains, setExcludeDomains] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [pageSize, setPageSize] = useState('20')
  const [page, setPage] = useState('1')
  const [articles, setArticles] = useState<any[]>([])
  const [queryUrl, setQueryUrl] = useState('')

  const [pages, setPages] = useState<Page[]>([])

  // fetch news
  const fetchNews = useCallback(async () => {
    const params = new URLSearchParams({ q: query, apiKey: API_KEY })
    if (qInTitle) params.append('qInTitle', qInTitle)
    if (language) params.append('language', language)
    if (sortBy) params.append('sortBy', sortBy)
    if (domains) params.append('domains', domains)
    if (excludeDomains) params.append('excludeDomains', excludeDomains)
    if (from) params.append('from', from)
    if (to) params.append('to', to)
    if (pageSize) params.append('pageSize', pageSize)
    if (page) params.append('page', page)

    const url = `${API_BASE}?${params.toString()}`
    setQueryUrl(url)

    try {
      const res = await fetch(url)
      const data = await res.json()

      if (data.status !== 'ok') throw new Error(data.message || 'Error fetching data')
      setArticles(data.articles)
    } catch (err: any) {
      toast.error(err.message)
      setArticles([])
    }
  }, [query, qInTitle, language, sortBy, domains, excludeDomains, from, to, pageSize, page])

  // fetch pages
  const fetchPages = useCallback(async () => {
    try {
      const { pages } = await getPagesApi()
      setPages(pages)
    } catch (err: any) {
      toast.error(err.message)
    }
  }, [])

  // reset
  const reset = useCallback(() => {
    setQuery('netflix movies')
    setQInTitle('')
    setLanguage('')
    setSortBy('publishedAt')
    setDomains('')
    setExcludeDomains('')
    setFrom('')
    setTo('')
    setPageSize('20')
    setPage('1')
    setArticles([])
    setQueryUrl(`${API_BASE}?q=netflix+movies&apiKey=${API_KEY}`)
  }, [])

  // initial fetch
  useEffect(() => {
    fetchPages()
    fetchNews()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // keyboard event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        fetchNews()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [fetchNews])

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <h1 className="text-primary text-center text-3xl font-bold">News Search</h1>

      {/* MARK: Filters */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Input
          placeholder="Keywords (q)"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <Input
          placeholder="Title contains (qInTitle)"
          value={qInTitle}
          onChange={e => setQInTitle(e.target.value)}
        />
        <Input
          placeholder="Domains (comma separated)"
          value={domains}
          onChange={e => setDomains(e.target.value)}
        />
        <Input
          placeholder="Exclude domains"
          value={excludeDomains}
          onChange={e => setExcludeDomains(e.target.value)}
        />
        <Input
          type="date"
          value={from}
          onChange={e => setFrom(e.target.value)}
        />
        <Input
          type="date"
          value={to}
          onChange={e => setTo(e.target.value)}
        />
        <Select
          value={language}
          onValueChange={setLanguage}
        >
          <SelectTrigger>
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map(l => (
              <SelectItem
                key={l.value}
                value={l.value}
              >
                {l.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={sortBy}
          onValueChange={setSortBy}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map(s => (
              <SelectItem
                key={s.value}
                value={s.value}
              >
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Page Size (max 100)"
          value={pageSize}
          onChange={e => setPageSize(e.target.value)}
        />
        <Input
          placeholder="Page"
          value={page}
          onChange={e => setPage(e.target.value)}
        />
        <div className="col-span-full flex justify-end gap-2">
          <Button
            className="cursor-pointer"
            onClick={fetchNews}
          >
            Search
          </Button>
          <Button
            className="cursor-pointer"
            onClick={reset}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Query Preview */}
      <div className="bg-muted relative flex items-center justify-between overflow-auto rounded-lg px-4 py-3 font-mono text-sm">
        <span>{queryUrl}</span>
        <Button
          size="sm"
          className="absolute top-2 right-2 cursor-pointer"
          variant="default"
          onClick={() => copy(queryUrl)}
        >
          Copy
        </Button>
      </div>

      {/* News Results */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {articles.map((a, index) => {
          const article = {
            _id: `${a.publishedAt}-${index}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),

            title: a.title,
            date: a.publishedAt,
            desc: a.description,
            content: a.content,
            link: a.url,
            author: a?.source?.name || '',
            thumbnail: a.urlToImage,
          }

          return (
            <ArticleCard
              options={pages}
              article={article}
              key={index}
            />
          )
        })}
      </div>

      <Creations />
    </div>
  )
}
