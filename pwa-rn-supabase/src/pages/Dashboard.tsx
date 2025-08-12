export default function Dashboard() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h2 style={{ margin: 0 }}>Dasbor</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {[
          { label: 'Populasi', value: '12.450' },
          { label: 'Produksi Telur (hari ini)', value: '9.650' },
          { label: 'Kematian (hari ini)', value: '14' },
          { label: 'Pakan (kg/hari)', value: '1.165' },
        ].map((c) => (
          <div key={c.label} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 12, color: '#64748b' }}>{c.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{c.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}