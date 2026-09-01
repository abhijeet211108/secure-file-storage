'use client'

import { useMemo, useRef, useState } from 'react'
import {
  ArrowDownToLine,
  Check,
  Cloud,
  FileArchive,
  FileCode2,
  FileText,
  HardDrive,
  LockKeyhole,
  LogOut,
  Plus,
  ShieldCheck,
  Upload,
  UserRound,
  X,
} from 'lucide-react'

type UserId = 'alex' | 'jordan'
type StoredFile = {
  id: string
  name: string
  size: number
  type: string
  owner: UserId
  createdAt: string
  content: string
}

const demoUsers = [
  { id: 'alex' as UserId, name: 'Alex Morgan', email: 'alex@vault.test', password: 'demo123', initials: 'AM' },
  { id: 'jordan' as UserId, name: 'Jordan Lee', email: 'jordan@vault.test', password: 'demo456', initials: 'JL' },
]

const initialFiles: StoredFile[] = [
  { id: 'brief', name: 'product-brief.txt', size: 18420, type: 'text/plain', owner: 'alex', createdAt: 'Today, 9:42 AM', content: 'Synthetic product brief for the Vault demo.' },
  { id: 'notes', name: 'meeting-notes.md', size: 8420, type: 'text/markdown', owner: 'alex', createdAt: 'Yesterday, 4:15 PM', content: '# Meeting notes\n\nSynthetic meeting notes for demonstration.' },
  { id: 'archive', name: 'design-assets.zip', size: 2480000, type: 'application/zip', owner: 'alex', createdAt: 'Aug 28, 2026', content: 'Synthetic archive payload.' },
  { id: 'jordan-file', name: 'private-budget.csv', size: 1280, type: 'text/csv', owner: 'jordan', createdAt: 'Today, 8:05 AM', content: 'category,total\nDemo,100' },
]

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function FileIcon({ name }: { name: string }) {
  if (name.endsWith('.zip')) return <FileArchive aria-hidden="true" />
  if (name.endsWith('.md') || name.endsWith('.txt')) return <FileText aria-hidden="true" />
  return <FileCode2 aria-hidden="true" />
}

export default function Page() {
  const [user, setUser] = useState<(typeof demoUsers)[number] | null>(null)
  const [files, setFiles] = useState(initialFiles)
  const [email, setEmail] = useState('alex@vault.test')
  const [password, setPassword] = useState('demo123')
  const [loginError, setLoginError] = useState('')
  const [notice, setNotice] = useState('')
  const [showSecurity, setShowSecurity] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const visibleFiles = useMemo(() => user ? files.filter((file) => file.owner === user.id) : [], [files, user])

  function signIn(event: React.FormEvent) {
    event.preventDefault()
    const match = demoUsers.find((candidate) => candidate.email === email.trim().toLowerCase() && candidate.password === password)
    if (!match) {
      setLoginError('Email or password is incorrect. Try the demo credentials below.')
      return
    }
    setLoginError('')
    setNotice('Signed in securely. Your private vault is ready.')
    setUser(match)
  }

  function downloadFile(file: StoredFile) {
    if (!user || file.owner !== user.id) {
      setNotice('Access denied: this file belongs to another user.')
      return
    }
    const blob = new Blob([file.content], { type: file.type })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = file.name
    anchor.click()
    URL.revokeObjectURL(url)
    setNotice(`${file.name} downloaded.`)
  }

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0]
    if (!selected || !user) return
    const nextFile: StoredFile = {
      id: crypto.randomUUID(), name: selected.name, size: selected.size, type: selected.type || 'application/octet-stream', owner: user.id,
      createdAt: 'Just now', content: `Synthetic content for ${selected.name}`,
    }
    setFiles((current) => [nextFile, ...current])
    setNotice(`${selected.name} uploaded to your private vault.`)
    event.target.value = ''
  }

  if (!user) {
    return (
      <main className="auth-shell">
        <section className="auth-panel">
          <div className="brand-lockup"><span className="brand-mark"><LockKeyhole size={18} /></span><span>vault<span className="brand-dot">.</span></span></div>
          <div className="auth-copy"><p className="eyebrow">Private file storage</p><h1>Your files.<br /><em>Only yours.</em></h1><p className="muted">A focused, secure place for the files that matter. Sign in to access your private vault.</p></div>
          <form onSubmit={signIn} className="login-form" aria-label="Sign in form">
            <label htmlFor="email">Email address</label><input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
            <label htmlFor="password">Password</label><input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
            {loginError && <p className="form-error" role="alert"><X size={15} />{loginError}</p>}
            <button className="primary-button" type="submit">Unlock vault <ArrowDownToLine size={16} /></button>
          </form>
          <div className="demo-hint"><span className="status-dot" />Demo account: <strong>alex@vault.test</strong> / <strong>demo123</strong></div>
        </section>
        <aside className="auth-aside"><div className="aside-top"><span className="pill"><span className="status-dot" />Synthetic demo</span><span className="mono">VLT / 01</span></div><div className="aside-message"><ShieldCheck size={30} /><p>Built around a simple promise: your files are private by default.</p></div><div className="aside-footer"><span>End-to-end access control</span><span>2026 / Secure by design</span></div></aside>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <header className="topbar"><div className="brand-lockup"><span className="brand-mark"><LockKeyhole size={18} /></span><span>vault<span className="brand-dot">.</span></span></div><div className="topbar-right"><span className="demo-label">SYNTHETIC DATA</span><span className="user-chip"><span className="avatar">{user.initials}</span>{user.name}</span><button className="icon-button" onClick={() => { setUser(null); setNotice(''); }} aria-label="Sign out"><LogOut size={17} /></button></div></header>
      <div className="content-wrap"><div className="page-heading"><div><p className="eyebrow">Personal workspace / {user.id}</p><h1>My vault</h1><p className="muted">Your private files, in one quiet place.</p></div><button className="primary-button upload-button" onClick={() => inputRef.current?.click()}><Plus size={17} /> Upload file</button><input ref={inputRef} className="sr-only" type="file" onChange={handleUpload} /></div>
        {notice && <div className="notice" role="status"><Check size={16} />{notice}<button onClick={() => setNotice('')} aria-label="Dismiss notice"><X size={15} /></button></div>}
        <section className="stats-grid"><div className="stat-card"><span className="stat-icon"><HardDrive size={17} /></span><div><span className="stat-label">Storage used</span><strong>{formatSize(visibleFiles.reduce((sum, file) => sum + file.size, 0))}</strong></div><span className="stat-meta">of 10 GB</span></div><div className="stat-card"><span className="stat-icon"><Cloud size={17} /></span><div><span className="stat-label">Files</span><strong>{visibleFiles.length}</strong></div><span className="stat-meta">private items</span></div><div className="stat-card"><span className="stat-icon"><ShieldCheck size={17} /></span><div><span className="stat-label">Vault status</span><strong>Protected</strong></div><span className="stat-meta"><span className="status-dot" /> active</span></div></section>
        <section className="files-section"><div className="section-heading"><div><h2>Recent files</h2><p className="muted">Only files owned by {user.name.split(' ')[0]} are shown.</p></div><button className="text-button" onClick={() => setShowSecurity(!showSecurity)}><ShieldCheck size={15} /> Security details</button></div>{showSecurity && <div className="security-note"><ShieldCheck size={20} /><div><strong>Access control is active</strong><p>This demo checks a signed-in session and matches every file to its owner before listing or downloading. Production storage should enforce the same rule on the server with hashed passwords, secure cookies, authorization checks, and private object storage.</p></div></div>}{visibleFiles.length > 0 ? <div className="file-list" role="list">{visibleFiles.map((file) => <div className="file-row" role="listitem" key={file.id}><span className="file-icon"><FileIcon name={file.name} /></span><div className="file-main"><strong>{file.name}</strong><span>{formatSize(file.size)} <span className="separator">·</span> {file.createdAt}</span></div><span className="private-tag"><LockKeyhole size={12} /> Private</span><button className="download-button" onClick={() => downloadFile(file)} aria-label={`Download ${file.name}`}><ArrowDownToLine size={17} /></button></div>)}</div> : <div className="empty-state"><Upload size={22} /><strong>Your vault is empty</strong><span>Upload a file to get started.</span></div>}</section>
        <footer className="app-footer"><span><LockKeyhole size={13} /> Files are private to your account</span><span className="mono">DEMO / IN-MEMORY ONLY</span></footer>
      </div>
    </main>
  )
}
