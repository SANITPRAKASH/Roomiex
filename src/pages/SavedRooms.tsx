import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Heart, Loader2, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { RoomCard } from '@/components/RoomCard'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import type { RoomListing } from '@/lib/supabase'

interface SavedRoom {
  id: string
  room_id: string
  created_at: string
  room: RoomListing
}

export default function SavedRooms() {
  const { user, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [savedRooms, setSavedRooms] = useState<SavedRoom[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth')
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (user) {
      fetchSavedRooms()
    }
  }, [user])

  const fetchSavedRooms = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('saved_rooms')
        .select(`
          id,
          room_id,
          created_at,
          room:room_listings(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedData = (data || [])
        .map((item) => ({
          ...item,
          room: item.room as unknown as RoomListing,
        }))
        .filter((item) => item.room)

      setSavedRooms(formattedData)
    } catch (error) {
      console.error('Error fetching saved rooms:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredRooms = savedRooms.filter((saved) =>
    saved.room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    saved.room.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-8 h-8 text-primary fill-primary" />
              <h1 className="text-3xl md:text-4xl font-bold">Saved Rooms</h1>
            </div>
            <p className="text-muted-foreground">
              {savedRooms.length} {savedRooms.length === 1 ? 'room' : 'rooms'} saved
            </p>
          </div>

          {savedRooms.length > 0 && (
            <div className="relative mb-6 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search saved rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          )}

          {savedRooms.length === 0 ? (
            <Card className="text-center py-20">
              <CardContent>
                <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No saved rooms yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Browse rooms and click the heart icon to save them for later. Your saved
                  rooms will appear here.
                </p>
                <Link to="/rooms">
                  <Button>Browse Rooms</Button>
                </Link>
              </CardContent>
            </Card>
          ) : filteredRooms.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No matching rooms</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search
                </p>
                <Button onClick={() => setSearchQuery('')}>Clear Search</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map((saved) => (
                <RoomCard key={saved.id} room={saved.room} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}