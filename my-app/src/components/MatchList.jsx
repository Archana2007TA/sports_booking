import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import BookingForm from './BookingForm'

export default function MatchList() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  fetchMatches()

  const channel = supabase
    .channel('bookings-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'bookings' },
      () => {
        fetchMatches()
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [])

  async function fetchMatches() {
  setLoading(true)

  const { data: matchesData, error: matchesError } = await supabase
    .from('matches')
    .select('*')
    .order('match_date', { ascending: true })

  if (matchesError) {
    console.error('Error fetching matches:', matchesError)
    setLoading(false)
    return
  }

  const { data: bookingsData, error: bookingsError } = await supabase
  .from('match_booking_totals')
  .select('match_id, total_booked')

if (bookingsError) {
  console.error('Error fetching booking totals:', bookingsError)
}

const bookedCounts = {}
;(bookingsData || []).forEach((b) => {
  bookedCounts[b.match_id] = b.total_booked
})

  const merged = matchesData.map((m) => ({
    ...m,
    bookedSeats: bookedCounts[m.id] || 0,
  }))

  setMatches(merged)
  setLoading(false)
}

  if (loading) return <p>Loading matches...</p>

  return (
  <div>
    {matches.map((m) => {
      const percentBooked = Math.min(100, (m.bookedSeats / m.capacity) * 100)
      return (
        <div key={m.id} className="match-card">
          <div className="match-teams">🏟️ {m.team_a} vs {m.team_b}</div>
          <p className="match-meta">📅 {new Date(m.match_date).toLocaleString()}</p>
          <p className="match-meta">📍 {m.venue}</p>
          <span className="status-badge">🟢 {m.status}</span>

          <div className="seats-info">
            🎟️ {m.bookedSeats} / {m.capacity} seats booked
          </div>
          <div className="seats-bar">
            <div className="seats-bar-fill" style={{ width: `${percentBooked}%` }} />
          </div>

          <BookingForm
            matchId={m.id}
            seatsLeft={m.capacity - m.bookedSeats}
            onBookingSuccess={fetchMatches}
          />
        </div>
      )
    })}
  </div>
)
}