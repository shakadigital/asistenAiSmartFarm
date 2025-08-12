import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

type LogItem = {
  id: string
  date: string
  flock: string
  dead: number
  eggs: number
  feedKg: number
  weightKg: number
}

export default function DailyReport() {
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10))
  const [flock, setFlock] = useState('Kawanan A-101')
  const [dead, setDead] = useState<number | ''>('' as any)
  const [eggs, setEggs] = useState<number | ''>('' as any)
  const [feedKg, setFeedKg] = useState<number | ''>('' as any)
  const [weightKg, setWeightKg] = useState<number | ''>('' as any)
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<LogItem[]>([])

  const isValid = useMemo(() => date && flock && dead !== '' && eggs !== '' && feedKg !== '' && weightKg !== '', [date, flock, dead, eggs, feedKg, weightKg])

  async function fetchRows() {
    const { data, error } = await supabase
      .from('daily_reports')
      .select('*')
      .order('date', { ascending: false })
      .limit(100)
    if (error) console.error(error)
    else setRows(
      (data ?? []).map((d) => ({
        id: String(d.id),
        date: new Date(d.date).toLocaleDateString('id-ID'),
        flock: d.flock,
        dead: d.dead,
        eggs: d.eggs,
        feedKg: d.feed_kg,
        weightKg: d.weight_kg,
      }))
    )
  }

  useEffect(() => {
    fetchRows()
  }, [])

  async function handleSave() {
    if (!isValid) return
    setLoading(true)
    const payload = {
      date: new Date(date).toISOString(),
      flock,
      dead: Number(dead),
      eggs: Number(eggs),
      feed_kg: Number(feedKg),
      weight_kg: Number(weightKg),
    }
    const { error } = await supabase.from('daily_reports').insert(payload)
    setLoading(false)
    if (error) return alert(error.message)
    setDead('' as any); setEggs('' as any); setFeedKg('' as any); setWeightKg('' as any)
    fetchRows()
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h2 style={{ margin: 0 }}>Laporan Harian</h2>

      <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 6 }}>Tanggal</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 6 }}>Kawanan</label>
            <select value={flock} onChange={(e) => setFlock(e.target.value)} style={inputStyle}>
              <option>Kawanan A-101</option>
              <option>Kawanan B-202</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 6 }}>Catatan</label>
            <input placeholder="cth: vaksin ND hari ini" style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 12, marginTop: 12 }}>
          <div>
            <label style={label}>Mati</label>
            <input type="number" min={0} value={dead} onChange={(e) => setDead(e.target.value === '' ? '' as any : Number(e.target.value))} placeholder="0" style={inputStyle} />
          </div>
          <div>
            <label style={label}>Telur</label>
            <input type="number" min={0} value={eggs} onChange={(e) => setEggs(e.target.value === '' ? '' as any : Number(e.target.value))} placeholder="0" style={inputStyle} />
          </div>
          <div>
            <label style={label}>Pakan (kg)</label>
            <input type="number" min={0} value={feedKg} onChange={(e) => setFeedKg(e.target.value === '' ? '' as any : Number(e.target.value))} placeholder="0" style={inputStyle} />
          </div>
          <div>
            <label style={label}>BB (kg)</label>
            <input type="number" min={0} step={0.01} value={weightKg} onChange={(e) => setWeightKg(e.target.value === '' ? '' as any : Number(e.target.value))} placeholder="0" style={inputStyle} />
          </div>
          <div style={{ display: 'flex', alignItems: 'end' }}>
            <button onClick={handleSave} disabled={!isValid || loading} style={{ ...button, width: '100%', opacity: !isValid || loading ? 0.6 : 1 }}>{loading ? 'Menyimpan...' : 'Simpan Laporan'}</button>
          </div>
        </div>
      </div>

      <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
        <h3 style={{ margin: '4px 0 12px' }}>Log Laporan Harian</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Tanggal','Kawanan','Mati','Telur','Pakan (kg)','BB (kg)'].map(h => (
                  <th key={h} style={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td style={td}>{row.date}</td>
                  <td style={td}>{row.flock}</td>
                  <td style={tdRight}>{row.dead}</td>
                  <td style={tdRight}>{row.eggs.toLocaleString('id-ID')}</td>
                  <td style={tdRight}>{row.feedKg}</td>
                  <td style={tdRight}>{row.weightKg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const label: React.CSSProperties = { display: 'block', fontSize: 12, color: '#64748b', marginBottom: 6 }
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e7eb', background: '#f8fafc'
}
const button: React.CSSProperties = {
  appearance: 'none', border: 'none', padding: '10px 14px', borderRadius: 10, background: '#16a34a', color: 'white', fontWeight: 600, cursor: 'pointer'
}
const th: React.CSSProperties = { textAlign: 'left', fontSize: 12, color: '#64748b', padding: '10px 8px', borderBottom: '1px solid #e5e7eb' }
const td: React.CSSProperties = { padding: '12px 8px', borderBottom: '1px solid #f1f5f9' }
const tdRight: React.CSSProperties = { ...td, textAlign: 'right' as const }