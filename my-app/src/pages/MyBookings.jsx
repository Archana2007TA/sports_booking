import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const savedName = localStorage.getItem('myBookingName') || ''
  const [nameInput, setNameInput] = useState(savedName)

  useEffect(() => {
    if (savedName) fetchBookings(savedName)
    else setLoading(false)
  }, [])

  async function fetchBookings(name) {
    setLoading(true)
    const { data, error } = await supabase
      .from('bookings')
      .select('id, seats, booked_at, matches ( team_a, team_b, match_date, venue )')
      .eq('user_name', name)
      .order('booked_at', { ascending: false })

    if (error) console.error('Error fetching bookings:', error)
    else setBookings(data)
    setLoading(false)
  }

  function handleSearch(e) {
    e.preventDefault()
    localStorage.setItem('myBookingName', nameInput)
    fetchBookings(nameInput)
  }

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>🎟️ My Bookings</h1>
        <p>See all the matches you've booked seats for</p>
      </div>

      <form onSubmit={handleSearch} className="booking-form" style={{ marginBottom: 24 }}>
        <input
          type="text"
          placeholder="👤 Enter your name"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          required
        />
        <button type="submit">🔍 Find My Bookings</button>
      </form>

      {loading && <p>Loading...</p>}

      {!loading && bookings.length === 0 && (
        <p>No bookings found. Book a match first! 🏏</p>
      )}

      {bookings.map((b) => (
        <div key={b.id} className="match-card">
          <div className="match-teams">
            🏟️ {b.matches.team_a} vs {b.matches.team_b}
          </div>
          <p className="match-meta">📅 {new Date(b.matches.match_date).toLocaleString()}</p>
          <p className="match-meta">📍 {b.matches.venue}</p>
          <p className="seats-info">🎫 Seats booked: {b.seats}</p>
        </div>
      ))}
    </div>
  )
}