import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../AuthContext'

export default function BookingForm({ matchId, seatsLeft, onBookingSuccess }) {
  const { user } = useAuth()
  const [seats, setSeats] = useState(1)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')

    if (!user) {
      setMessage('Please log in to book seats.')
      return
    }

    const seatsRequested = Number(seats)
    if (seatsRequested > seatsLeft) {
      setMessage(`Only ${seatsLeft} seat(s) left.`)
      return
    }

    setLoading(true)

    const { error } = await supabase
      .from('bookings')
      .insert([{
        match_id: matchId,
        user_id: user.id,
        user_name: user.email,
        seats: seatsRequested,
      }])

    if (error) {
      console.error('Booking error:', error)
      setMessage(error.message)
    } else {
      setMessage('Booking confirmed!')
      setSeats(1)
      if (onBookingSuccess) onBookingSuccess()
    }
    setLoading(false)
  }

  if (!user) {
    return <p className="booking-message">🔒 Please log in to book seats.</p>
  }

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <input
        type="number"
        min="1"
        max={seatsLeft}
        value={seats}
        onChange={(e) => setSeats(e.target.value)}
        required
      />
      <button type="submit" disabled={loading || seatsLeft <= 0}>
        {seatsLeft <= 0 ? '❌ Sold Out' : loading ? 'Booking...' : '✅ Book Seats'}
      </button>
      {message && <p className="booking-message">{message}</p>}
    </form>
  )
}