import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="home-container">
      <h1>🏏 Welcome to Ticket Booking</h1>
      <p>Book your seats for live IPL matches — fast, easy, and in real time ⚡</p>
      <Link to="/booking" className="cta-button">
        🎟️ Book Now
      </Link>
    </div>
  )
}