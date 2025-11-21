import { Routes, Route, Navigate } from 'react-router-dom'
import OsNew from './pages/OsNew'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/os/nova" replace />} />
      <Route path="/os/nova" element={<OsNew />} />
    </Routes>
  )
}