import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { RoomCard } from './RoomCard'
import { Button } from '@/components/ui/button'
import { ArrowRight, SlidersHorizontal, Plus, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'

interface DbRoomListing {
  id: string
  title: string
  location: string
  price: number
  room_type: string
  photos: string[] | null
  amenities: string[] | null
  description: string | null
  available_from: string | null
  ai_score: number | null
}

export function FeaturedRooms() {
  const [dbRooms, setDbRooms] = useState<DbRoomListing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeatured() {
      setLoading(true)
      const { data, error } = await supabase
        .from('room_listings')
        .select('id,title,location,price,room_type,photos,amenities,description,available_from,ai_score')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(6)

      if (!error && data) {
        setDbRooms(data as DbRoomListing[])
      } else {
        setDbRooms([])
      }
      setLoading(false)
    }

    fetchFeatured()
  }, [])

  const featuredRooms = useMemo(() => dbRooms, [dbRooms])

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Rooms Near You</h2>
            <p className="text-muted-foreground max-w-lg">
              Real listings posted by owners — browse, save, review, chat and book.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/rooms">
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </Button>
            </Link>
            <Link to="/list-room">
              <Button variant="ghost" className="gap-2">
                List Room
                <Plus className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading featured rooms...
          </div>
        ) : featuredRooms.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-6">No listings yet — create the first one.</p>
            <div className="flex items-center justify-center gap-3">
              <Link to="/list-room">
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  List a Room
                </Button>
              </Link>
              <Link to="/rooms">
                <Button variant="outline" className="gap-2">
                  Browse Rooms
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRooms.map((room, _index) => (
                <RoomCard key={room.id} room={room}  />
              ))}
            </div>

            <motion.div
              className="flex justify-center mt-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link to="/rooms">
                <Button variant="hero-outline" size="lg" className="gap-2">
                  Browse All Rooms
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  )
}