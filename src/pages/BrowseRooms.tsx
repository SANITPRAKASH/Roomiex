import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { RoomCard } from '@/components/RoomCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MapPin, Search, Loader2 } from 'lucide-react'
import { supabase} from '@/lib/supabase'
import type { RoomListing } from '@/lib/supabase'

export default function BrowseRooms() {
  const [searchParams] = useSearchParams()
  const [rooms, setRooms] = useState<RoomListing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('location') || '')

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('room_listings')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (error) throw error
      setRooms(data || [])
    } catch (error) {
      console.error('Error fetching rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRooms = rooms.filter(room => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return room.location.toLowerCase().includes(query) || 
           room.title.toLowerCase().includes(query)
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Browse Rooms</h1>
            <p className="text-muted-foreground">Find rooms posted by real owners</p>
          </div>

          {/* Search */}
          <div className="flex gap-4 mb-8">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by location or area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <Button className="h-12 gap-2">
              <Search className="w-4 h-4" />
              Search
            </Button>
          </div>

          {/* Results */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No rooms found</h3>
              <p className="text-muted-foreground">Try adjusting your search</p>
            </div>
          ) : (
            <>
              <div className="mb-6 text-sm text-muted-foreground">
                {filteredRooms.length} rooms found
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRooms.map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}