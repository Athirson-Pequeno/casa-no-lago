import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home     from './pages/Home.jsx'
import Login    from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Admin    from './pages/Admin.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin"    element={<Admin />} />
        <Route path="*"         element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
