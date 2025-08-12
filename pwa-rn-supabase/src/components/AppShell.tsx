import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

const menu = [
  { label: 'Dasbor', path: '/' },
  { label: 'Peternakan', path: '/farm' },
  { label: 'Laporan Harian', path: '/reports/daily' },
  { label: 'Inventori', path: '/inventory' },
  { label: 'Tenaga Kerja', path: '/workforce' },
  { label: 'Analisa Performa', path: '/analytics' },
  { label: 'Pengaturan', path: '/settings' },
]

export default function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '100vh', background: '#f5f7fb' }}>
      <aside style={{ background: '#0b4f2e', color: 'white', padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 8px', marginBottom: 16 }}>
          <span style={{ fontWeight: 700 }}>Smartfarm</span>
        </div>
        <nav style={{ display: 'grid', gap: 4 }}>
          {menu.map((m) => {
            const active = m.path === '/' ? pathname === '/' : pathname.startsWith(m.path)
            return (
              <Link key={m.path} to={m.path} style={{
                textDecoration: 'none', color: 'inherit',
                background: active ? '#166534' : 'transparent',
                padding: '10px 12px', borderRadius: 8
              }}>
                {m.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      <main style={{ display: 'grid', gridTemplateRows: '56px 1fr' }}>
        <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
          <div style={{ fontWeight: 600 }}>Unggas GreenValley</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 28, height: 28, background: '#16a34a', borderRadius: '50%' }} />
            <div style={{ fontSize: 14 }}>Jane Doe · Admin</div>
          </div>
        </header>
        <section style={{ padding: 16 }}>{children}</section>
      </main>
    </div>
  )
}