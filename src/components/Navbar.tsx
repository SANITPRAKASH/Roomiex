import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Home, Menu, X, User, MessageSquare, Calendar, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-gradient">RoomieX</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/rooms" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Browse Rooms
            </Link>
            <Link to="/flatmates" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Find Flatmates
            </Link>
            <Link to="/room-scorer" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              AI Room Scorer
            </Link>
            {user && (
              <>
                <Link to="/messages" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  Messages
                </Link>
                <Link to="/bookings" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
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
            {user ? (
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
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <div className="flex flex-col gap-3">
              <Link to="/rooms" className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg transition-colors" onClick={() => setIsOpen(false)}>
                Browse Rooms
              </Link>
              <Link to="/flatmates" className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg transition-colors" onClick={() => setIsOpen(false)}>
                Find Flatmates
              </Link>
              <Link to="/room-scorer" className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg transition-colors flex items-center gap-2" onClick={() => setIsOpen(false)}>
                <Sparkles className="w-4 h-4" />
                AI Room Scorer
              </Link>
              {user && (
                <>
                  <Link to="/messages" className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg transition-colors flex items-center gap-2" onClick={() => setIsOpen(false)}>
                    <MessageSquare className="w-4 h-4" />
                    Messages
                  </Link>
                  <Link to="/bookings" className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg transition-colors flex items-center gap-2" onClick={() => setIsOpen(false)}>
                    <Calendar className="w-4 h-4" />
                    Bookings
                  </Link>
                </>
              )}
              <div className="flex gap-2 mt-2 px-4">
                <Link to="/list-room" className="flex-1" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    List Room
                  </Button>
                </Link>
                {user ? (
                  <Link to="/profile" className="flex-1" onClick={() => setIsOpen(false)}>
                    <Button size="sm" className="w-full gap-2">
                      <User className="w-4 h-4" />
                      Profile
                    </Button>
                  </Link>
                ) : (
                  <Link to="/auth" className="flex-1" onClick={() => setIsOpen(false)}>
                    <Button size="sm" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}