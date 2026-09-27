import MatchList from '../components/MatchList'

export default function Booking() {
  return (
    <div className="app-container">
      <div className="app-header">
        <h1>🏏 IPL Match Booking</h1>
        <p>Book your seats for live IPL matches in real time ⚡</p>
      </div>
      <MatchList />
    </div>
  )
}