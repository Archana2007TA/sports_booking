import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')

    if (isSignup) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMessage(error.message)
      else {
        setMessage('Signup successful! You can now log in.')
        setIsSignup(false)
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
      else navigate('/booking')
    }
  }

  return (
    <div className="home-container">
      <h1>{isSignup ? '📝 Sign Up' : '🔐 Log In'}</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="cta-button" style={{ border: 'none', cursor: 'pointer' }}>
          {isSignup ? 'Sign Up' : 'Log In'}
        </button>
      </form>
      {message && <p style={{ marginTop: 12 }}>{message}</p>}
      <p style={{ marginTop: 16 }}>
        {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          onClick={() => setIsSignup(!isSignup)}
          style={{ border: 'none', background: 'none', color: '#ee0979', cursor: 'pointer', fontWeight: 600 }}
        >
          {isSignup ? 'Log In' : 'Sign Up'}
        </button>
      </p>
    </div>
  )
}