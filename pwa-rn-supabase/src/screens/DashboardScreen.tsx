import { useEffect, useState } from 'react'
import { View, Text, Pressable, ScrollView } from 'react-native-web'
import { supabase } from '../lib/supabase'

export default function DashboardScreen() {
  const [email, setEmail] = useState<string>('')

  useEffect(() => {
    ;(async () => {
      const { data } = await supabase.auth.getUser()
      setEmail(data.user?.email ?? '')
    })()
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 24 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: '700' }}>Dashboard</Text>
        <Pressable onPress={handleSignOut} style={{ backgroundColor: '#ef4444', padding: 10, borderRadius: 8 }}>
          <Text style={{ color: 'white', fontWeight: '600' }}>Keluar</Text>
        </Pressable>
      </View>

      <View style={{ gap: 8 }}>
        <Text>Selamat datang {email ? `, ${email}` : ''} 👋</Text>
        <Text>Aplikasi ini adalah PWA berbasis Vite + React Native Web + Supabase.</Text>
      </View>
    </ScrollView>
  )
}