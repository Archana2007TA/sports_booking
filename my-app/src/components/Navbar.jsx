import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">🏏 TicketBooking</div>
      <div className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
          Home
        </NavLink>
        <NavLink to="/booking" className={({ isActive }) => isActive ? 'active' : ''}>
          Booking
        </NavLink>
        <NavLink to="/my-bookings" className={({ isActive }) => isActive ? 'active' : ''}>
          My Bookings
        </NavLink>
        <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>
          Login
        </NavLink>
      </div>
    </nav>
  )
}