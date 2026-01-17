import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/hooks/useAuth'

// Pages
import Index from '@/pages/Index'
import BrowseRooms from '@/pages/BrowseRooms'
import RoomDetail from '@/pages/RoomDetail'
import RoomScorer from '@/pages/RoomScorer'
import ListRoom from '@/pages/ListRoom'
import Auth from '@/pages/Auth'
import Profile from '@/pages/Profile'
import NotFound from '@/pages/NotFound'
import FindFlatmates from './pages/FindFlatmates'
import Messages from './pages/Messages'
import SavedRooms from './pages/SavedRooms'
import MyBookings from './pages/MyBookings'
import FlatmateProfile from './pages/FlatemateProfile'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/rooms" element={<BrowseRooms />} />
          <Route path="/room/:id" element={<RoomDetail />} />
          <Route path="/room-scorer" element={<RoomScorer />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/flatmates" element={<FindFlatmates />} />
          
          {/* Protected Routes (require auth) */}
          <Route path="/list-room" element={<ListRoom />} />
          <Route path="/profile" element={<Profile />} />
           <Route path="/messages" element={<Messages />} />
          <Route path="/saved" element={<SavedRooms />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/flatmate-profile" element={<FlatmateProfile />} />
          
          {/* 404 Not Found - MUST BE LAST! */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App