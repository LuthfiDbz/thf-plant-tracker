import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { Flex, Spinner } from '@radix-ui/themes'
import { useAuth } from './context/AuthContext'
import { TopBar } from './components/TopBar'
import { BottomNav } from './components/BottomNav'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Soil from './pages/Soil'
import Hydroponic from './pages/Hydroponic'
import Plants from './pages/Plants'

function ProtectedLayout() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: '100vh' }}>
        <Spinner size="3" />
      </Flex>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="app-shell">
      <TopBar />
      <div className="app-content">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Navigate to="/soil" replace />} />
        <Route path="/soil" element={<Soil />} />
        <Route path="/hydroponic" element={<Hydroponic />} />
        <Route path="/plants" element={<Plants />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
