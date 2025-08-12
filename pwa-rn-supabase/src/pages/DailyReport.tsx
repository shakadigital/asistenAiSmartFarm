type LogItem = {
  date: string
  flock: string
  dead: number
  eggs: number
  feedKg: number
  weightKg: number
}

const sample: LogItem[] = [
  { date: '20/5/2024', flock: 'Kawanan A-101', dead: 2, eggs: 4500, feedKg: 550, weightKg: 1.8 },
  { date: '21/5/2024', flock: 'Kawanan A-101', dead: 3, eggs: 4450, feedKg: 545, weightKg: 1.81 },
  { date: '22/5/2024', flock: 'Kawanan A-101', dead: 8, eggs: 4200, feedKg: 530, weightKg: 1.79 },
  { date: '20/5/2024', flock: 'Kawanan B-202', dead: 1, eggs: 4800, feedKg: 580, weightKg: 1.85 },
  { date: '21/5/2024', flock: 'Kawanan B-202', dead: 2, eggs: 4820, feedKg: 585, weightKg: 1.86 },
  { date: '22/5/2024', flock: 'Kawanan B-202', dead: 1, eggs: 4850, feedKg: 582, weightKg: 1.87 },
]

export default function DailyReport() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h2 style={{ margin: 0 }}>Laporan Harian</h2>

      <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 6 }}>Tanggal</label>
            <input type="date" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 6 }}>Kawanan</label>
            <select style={inputStyle}>
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
            <input type="number" min={0} placeholder="0" style={inputStyle} />
          </div>
          <div>
            <label style={label}>Telur</label>
            <input type="number" min={0} placeholder="0" style={inputStyle} />
          </div>
          <div>
            <label style={label}>Pakan (kg)</label>
            <input type="number" min={0} placeholder="0" style={inputStyle} />
          </div>
          <div>
            <label style={label}>BB (kg)</label>
            <input type="number" min={0} step={0.01} placeholder="0" style={inputStyle} />
          </div>
          <div style={{ display: 'flex', alignItems: 'end' }}>
            <button style={{ ...button, width: '100%' }}>Simpan Laporan</button>
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
              {sample.map((row, idx) => (
                <tr key={idx}>
                  <td style={td}>{row.date}</td>
                  <td style={td}>{row.flock}</td>
                  <td style={tdRight}>{row.dead}</td>
                  <td style={tdRight}>{row.eggs.toLocaleString()}</td>
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