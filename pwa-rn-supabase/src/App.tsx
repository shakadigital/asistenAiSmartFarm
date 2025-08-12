import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthScreen from './screens/AuthScreen'
import { supabase } from './lib/supabase'
import AppShell from './components/AppShell'
import Dashboard from './pages/Dashboard'
import DailyReport from './pages/DailyReport'

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    let isMounted = true
    ;(async () => {
      const { data } = await supabase.auth.getSession()
      if (!isMounted) return
      setIsAuthenticated(!!data.session)
      setIsLoading(false)
    })()

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => {
      subscription.subscription.unsubscribe()
      isMounted = false
    }
  }, [])

  if (isLoading) return null

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={!isAuthenticated ? <AuthScreen /> : <Navigate to="/" replace />} />
        <Route path="/*" element={isAuthenticated ? (
          <AppShell>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/reports/daily" element={<DailyReport />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppShell>
        ) : (
          <Navigate to="/auth" replace />
        )} />
      </Routes>
    </BrowserRouter>
  )
}
