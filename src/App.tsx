import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import OsEdit from './pages/OsEdit'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/os" element={<Navigate to="/" replace />} />
      <Route path="/os/:id" element={<OsEdit />} />
    </Routes>
  )
}