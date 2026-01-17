import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Star, Calendar, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { supabase} from '@/lib/supabase'
import type { RoomListing } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'

const amenityIcons: Record<string, any> = {
  'WiFi': CheckCircle2,
  'AC': CheckCircle2,
  'Furnished': CheckCircle2,
  'Parking': CheckCircle2,
  'Balcony': CheckCircle2,
  'Kitchen': CheckCircle2,
  'Washing Machine': CheckCircle2,
  'Gym': CheckCircle2,
  'Power Backup': CheckCircle2,
}

export default function RoomDetail() {
  const { id } = useParams()
  const [room, setRoom] = useState<RoomListing | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchRoom()
    }
  }, [id])

  const fetchRoom = async () => {
    try {
      const { data, error } = await supabase
        .from('room_listings')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setRoom(data)
    } catch (error) {
      console.error('Error fetching room:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Room not found</h1>
          <Link to="/rooms">
            <Button>Browse Rooms</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link to="/rooms" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to listings
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Image */}
              <div className="relative rounded-2xl overflow-hidden mb-6">
                <img 
                  src={room.photos?.[0] || '/placeholder.jpg'} 
                  alt={room.title}
                  className="w-full aspect-[16/10] object-cover"
                />
                
                {/* AI Score Badge */}
                {room.ai_score && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-background/90 backdrop-blur-sm">
                      <Star className="w-3 h-3 text-primary fill-primary mr-1" />
                      {room.ai_score} AI Score
                    </Badge>
                  </div>
                )}
              </div>

              {/* Title & Location */}
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{room.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="w-4 h-4" />
                {room.location}
              </div>

              {/* Room Type */}
              <div className="mb-6">
                <Badge variant="secondary" className="capitalize">
                  {room.room_type} Room
                </Badge>
              </div>

              {/* Description */}
              {room.description && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-3">About this room</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {room.description}
                  </p>
                </div>
              )}

              {/* Amenities */}
              {room.amenities && room.amenities.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {room.amenities.map((amenity) => {
                      const Icon = amenityIcons[amenity] || CheckCircle2
                      return (
                        <div 
                          key={amenity}
                          className="flex items-center gap-3 p-3 rounded-xl bg-muted/50"
                        >
                          <Icon className="w-5 h-5 text-primary" />
                          <span className="text-sm">{amenity}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="card-elevated p-6 sticky top-24">
                {/* Price */}
                <div className="mb-6">
                  <span className="text-3xl font-bold">
                    {formatCurrency(room.price)}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>

                {/* Available */}
                {room.available_from && (
                  <div className="flex items-center gap-2 mb-6 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Available:</span>
                    <span className="font-medium">
                      {new Date(room.available_from).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {/* Contact Button */}
                <Button className="w-full mb-3">
                  Contact Owner
                </Button>
                <Button variant="outline" className="w-full">
                  Schedule Visit
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-6">
                  All communications are secure & verified
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}