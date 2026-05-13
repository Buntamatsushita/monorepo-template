import { useEffect, useState } from 'react'
import './App.css'

const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

type HealthState =
  | { status: 'loading' }
  | { status: 'ok'; data: unknown }
  | { status: 'error'; message: string }

function App() {
  const [health, setHealth] = useState<HealthState>({ status: 'loading' })

  useEffect(() => {
    const ac = new AbortController()
    fetch(`${apiBase.replace(/\/$/, '')}/health`, { signal: ac.signal })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }
        return res.json()
      })
      .then((data) => setHealth({ status: 'ok', data }))
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return
        const message = err instanceof Error ? err.message : String(err)
        setHealth({ status: 'error', message })
      })
    return () => ac.abort()
  }, [])

  return (
    <main className="app">
      <h1>monorepo web</h1>
      <p>
        API: <code>{apiBase}</code>
      </p>
      <section className="health">
        <h2>/health</h2>
        {health.status === 'loading' && <p>読み込み中…</p>}
        {health.status === 'ok' && (
          <pre>{JSON.stringify(health.data, null, 2)}</pre>
        )}
        {health.status === 'error' && (
          <p className="error">
            接続できません（API を起動し、CORS と URL を確認してください）。
            <br />
            <code>{health.message}</code>
          </p>
        )}
      </section>
    </main>
  )
}

export default App
