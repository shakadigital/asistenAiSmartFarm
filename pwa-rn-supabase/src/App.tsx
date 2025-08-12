import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthScreen from './screens/AuthScreen'
import DashboardScreen from './screens/DashboardScreen'
import { supabase } from './lib/supabase'

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
        <Route path="/" element={isAuthenticated ? <DashboardScreen /> : <Navigate to="/auth" replace />} />
        <Route path="/auth" element={!isAuthenticated ? <AuthScreen /> : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
