import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Home,
  Menu,
  X,
  User,
  Loader2,
  MessageSquare,
  Calendar,
  Heart,
  Sparkles,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isLoading } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)
  const [savedCount, setSavedCount] = useState(0)

  useEffect(() => {
    if (!user) {
      setUnreadCount(0)
      setSavedCount(0)
      return
    }

    const fetchUnreadCount = async () => {
      try {
        const { count } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('receiver_id', user.id)
          .eq('read', false)
        setUnreadCount(count || 0)
      } catch (error) {
        console.error('Error fetching unread count:', error)
      }
    }

    const fetchSavedCount = async () => {
      try {
        const { count } = await supabase
          .from('saved_rooms')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
        setSavedCount(count || 0)
      } catch (error) {
        console.error('Error fetching saved count:', error)
      }
    }

    fetchUnreadCount()
    fetchSavedCount()

    // Real-time subscription for unread messages
    const messagesChannel = supabase
      .channel(`unread-messages-${user.id}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`
        },
        fetchUnreadCount
      )
      .subscribe()

    // Real-time subscription for saved rooms
    const savedChannel = supabase
      .channel(`saved-rooms-${user.id}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'saved_rooms',
          filter: `user_id=eq.${user.id}`
        },
        fetchSavedCount
      )
      .subscribe()

    return () => {
      supabase.removeChannel(messagesChannel)
      supabase.removeChannel(savedChannel)
    }
  }, [user])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              RoomieX
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/rooms"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Browse Rooms
            </Link>
            <Link
              to="/flatmates"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Find Flatmates
            </Link>
            <Link
              to="/room-scorer"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              AI Room Scorer
            </Link>
            {user && (
              <>
                <Link
                  to="/saved"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 relative"
                >
                  <Heart className="w-4 h-4" />
                  Saved
                  {savedCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-3 min-w-[18px] h-[18px] px-1 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center font-bold"
                    >
                      {savedCount > 99 ? '99+' : savedCount}
                    </motion.span>
                  )}
                </Link>
                <Link
                  to="/messages"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 relative"
                >
                  <MessageSquare className="w-4 h-4" />
                  Messages
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                      className="absolute -top-1 -right-3 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-lg"
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </motion.span>
                  )}
                </Link>
                <Link
                  to="/bookings"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  Bookings
                </Link>
              </>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/list-room">
              <Button variant="ghost" size="sm">
                List Your Room
              </Button>
            </Link>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            ) : user ? (
              <Link to="/profile">
                <Button size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  Profile
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-2 py-4 border-t border-border/50">
                <Link
                  to="/rooms"
                  className="px-4 py-2.5 text-sm font-medium hover:bg-accent rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Browse Rooms
                </Link>
                <Link
                  to="/flatmates"
                  className="px-4 py-2.5 text-sm font-medium hover:bg-accent rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Find Flatmates
                </Link>
                <Link
                  to="/room-scorer"
                  className="px-4 py-2.5 text-sm font-medium hover:bg-accent rounded-lg transition-colors flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Sparkles className="w-4 h-4" />
                  AI Room Scorer
                </Link>
                {user && (
                  <>
                    <Link
                      to="/saved"
                      className="px-4 py-2.5 text-sm font-medium hover:bg-accent rounded-lg transition-colors flex items-center justify-between"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        Saved Rooms
                      </div>
                      {savedCount > 0 && (
                        <span className="min-w-[20px] h-5 px-1.5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-bold">
                          {savedCount > 99 ? '99+' : savedCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      to="/messages"
                      className="px-4 py-2.5 text-sm font-medium hover:bg-accent rounded-lg transition-colors flex items-center justify-between"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Messages
                      </div>
                      {unreadCount > 0 && (
                        <span className="min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      to="/bookings"
                      className="px-4 py-2.5 text-sm font-medium hover:bg-accent rounded-lg transition-colors flex items-center gap-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <Calendar className="w-4 h-4" />
                      Bookings
                    </Link>
                  </>
                )}
                <div className="flex gap-2 mt-2 px-4">
                  <Link
                    to="/list-room"
                    className="flex-1"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      List Room
                    </Button>
                  </Link>
                  {isLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  ) : user ? (
                    <Link
                      to="/profile"
                      className="flex-1"
                      onClick={() => setIsOpen(false)}
                    >
                      <Button size="sm" className="w-full gap-2">
                        <User className="w-4 h-4" />
                        Profile
                      </Button>
                    </Link>
                  ) : (
                    <Link
                      to="/auth"
                      className="flex-1"
                      onClick={() => setIsOpen(false)}
                    >
                      <Button size="sm" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}