import { useState } from 'react'
import { View, Text, TextInput, Pressable } from 'react-native-web'
import { supabase } from '../lib/supabase'

export default function AuthScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'signIn' | 'signUp' | 'magicLink'>('signIn')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit() {
    setLoading(true)
    setMessage(null)
    try {
      if (mode === 'signIn') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else if (mode === 'signUp') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setMessage('Cek email Anda untuk verifikasi akun.')
      } else {
        const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } })
        if (error) throw error
        setMessage('Magic link dikirim ke email Anda.')
      }
    } catch (err: any) {
      setMessage(err.message ?? 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Masuk ke Smartfarm</Text>

      <View style={{ width: 360, maxWidth: '100%', gap: 12 }}>
        <Text>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          placeholder="email@contoh.com"
          style={{ borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8 }}
        />

        {mode !== 'magicLink' && (
          <>
            <Text>Kata sandi</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••"
              style={{ borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8 }}
            />
          </>
        )}

        <Pressable onPress={handleSubmit} disabled={loading} style={{ backgroundColor: '#16a34a', padding: 12, borderRadius: 8, alignItems: 'center' }}>
          <Text style={{ color: 'white', fontWeight: '600' }}>{loading ? 'Memproses…' : mode === 'signIn' ? 'Masuk' : mode === 'signUp' ? 'Daftar' : 'Kirim Magic Link'}</Text>
        </Pressable>

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12 }}>
          <Pressable onPress={() => setMode('signIn')}><Text style={{ color: mode === 'signIn' ? '#16a34a' : '#555' }}>Masuk</Text></Pressable>
          <Pressable onPress={() => setMode('signUp')}><Text style={{ color: mode === 'signUp' ? '#16a34a' : '#555' }}>Daftar</Text></Pressable>
          <Pressable onPress={() => setMode('magicLink')}><Text style={{ color: mode === 'magicLink' ? '#16a34a' : '#555' }}>Magic Link</Text></Pressable>
        </View>

        {message && (
          <Text style={{ color: '#2563eb', textAlign: 'center' }}>{message}</Text>
        )}
      </View>
    </View>
  )
}