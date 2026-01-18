import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { rooms } from '@/data/rooms'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookingDialog } from '@/components/BookingDialog'
import { ChatDialog } from '@/components/ChatDialog'
import { ReviewSection } from '@/components/ReviewSection'
import { SaveRoomButton } from '@/components/SaveRoomBotton'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Shield,
  Star,
  MapPin,
  Users,
  ShowerHead,
  Sparkles,
  Clock,
  Wifi,
  Wind,
  Car,
  Dumbbell,
  Coffee,
  Briefcase,
  Share2,
  MessageSquare,
  Calendar,
  CheckCircle2,
  Loader2,
} from 'lucide-react'
import { motion } from 'framer-motion'

interface DbRoom {
  id: string
  title: string
  location: string
  price: number
  room_type: string
  description: string | null
  amenities: string[] | null
  photos: string[] | null
  ai_score: number | null
  user_id: string | null
  available_from: string | null
  status: string | null
}

const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  WiFi: Wifi,
  AC: Wind,
  Parking: Car,
  'Gym Access': Dumbbell,
  Gym: Dumbbell,
  Kitchen: Coffee,
  Workspace: Briefcase,
  Pool: Dumbbell,
  Events: Users,
  Balcony: Wind,
  Garden: Coffee,
  'Power Backup': Wifi,
  'Meals Included': Coffee,
  Housekeeping: CheckCircle2,
  'Study Table': Briefcase,
  'Washing Machine': CheckCircle2,
}

export default function RoomDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [dbRoom, setDbRoom] = useState<DbRoom | null>(null)
  const [ownerProfile, setOwnerProfile] = useState<{ full_name: string | null } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [bookingType, setBookingType] = useState<'viewing' | 'trial_stay'>('viewing')

  // Check if this is a static room (numeric id like "1", "2", etc.)
  const isStaticRoom = id ? /^\d+$/.test(id) : false
  const staticRoom = isStaticRoom ? rooms.find((r) => r.id === id) : null

  useEffect(() => {
    if (!isStaticRoom && id) {
      fetchDbRoom()
    } else {
      setIsLoading(false)
    }
  }, [id, isStaticRoom])

  const fetchDbRoom = async () => {
    if (!id) return

    try {
      const { data, error } = await supabase
        .from('room_listings')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setDbRoom(data)

      // Fetch owner profile
      if (data.user_id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('user_id', data.user_id)
          .single()
        setOwnerProfile(profile)
      }
    } catch (error) {
      console.error('Error fetching room:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAction = (action: 'chat' | 'viewing' | 'trial_stay') => {
    if (!user) {
      toast.error('Please sign in to continue')
      navigate('/auth')
      return
    }

    if (isStaticRoom) {
      toast.error('This is a demo room. Actions are only available for real listings.')
      return
    }

    if (dbRoom?.user_id === user.id) {
      toast.error('You cannot perform this action on your own listing')
      return
    }

    if (action === 'chat') {
      setChatOpen(true)
    } else {
      setBookingType(action)
      setBookingOpen(true)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  // Use either static room or db room data
  const room = staticRoom || (dbRoom
    ? {
        id: dbRoom.id,
        title: dbRoom.title,
        location: dbRoom.location,
        price: dbRoom.price,
        image: dbRoom.photos?.[0] || '',
        roomType: dbRoom.room_type as 'private' | 'shared' | 'pg',
        bathroomType: 'shared' as const,
        furnishing: 'fully' as const,
        flatmates: 0,
        qualityScore: dbRoom.ai_score || 0,
        matchScore: undefined,
        isVerified: false,
        amenities: dbRoom.amenities || [],
        commute: undefined,
        availableFrom: dbRoom.available_from || 'Available Now',
        ownerName: ownerProfile?.full_name || 'Room Owner',
        ownerVerified: false,
        description: dbRoom.description || '',
      }
    : null)

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

  const getMatchColor = (score: number) => {
    if (score >= 85) return 'text-match-high'
    if (score >= 70) return 'text-match-medium'
    return 'text-match-low'
  }

  const isDbRoom = !isStaticRoom && !!dbRoom
  const ownerId = dbRoom?.user_id || ''
  const ownerName = ownerProfile?.full_name || 'Room Owner'

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link
            to="/rooms"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to listings
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Image */}
              <motion.div
                className="relative rounded-2xl overflow-hidden mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <img
                  src={room.image}
                  alt={room.title}
                  className="w-full aspect-[16/10] object-cover"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {room.isVerified && (
                    <Badge variant="default" className="backdrop-blur-sm bg-green-500">
                      <Shield className="w-3 h-3" />
                      Verified
                    </Badge>
                  )}
                  {room.qualityScore > 0 && (
                    <Link to="/room-scorer">
                      <Badge className="bg-background/90 backdrop-blur-sm text-foreground border-0 hover:bg-background transition-colors cursor-pointer">
                        <Star className="w-3 h-3 text-primary fill-primary" />
                        {room.qualityScore} AI Quality Score
                      </Badge>
                    </Link>
                  )}
                  {isStaticRoom && (
                    <Badge variant="secondary" className="backdrop-blur-sm">
                      Demo Room
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <SaveRoomButton roomId={id || ''} isDbRoom={isDbRoom} />
                </div>
              </motion.div>

              {/* Title & Location */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{room.title}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4" />
                  {room.location}
                </div>
              </motion.div>

              {/* Quick Info */}
              <motion.div
                className="flex flex-wrap gap-3 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Badge variant="outline" className="px-3 py-1.5">
                  <span className="capitalize">{room.roomType} Room</span>
                </Badge>
                <Badge variant="outline" className="px-3 py-1.5">
                  <ShowerHead className="w-3.5 h-3.5" />
                  {room.bathroomType} Bathroom
                </Badge>
                <Badge variant="outline" className="px-3 py-1.5">
                  <span className="capitalize">{room.furnishing} Furnished</span>
                </Badge>
                {room.flatmates > 0 && (
                  <Badge variant="outline" className="px-3 py-1.5">
                    <Users className="w-3.5 h-3.5" />
                    {room.flatmates} Flatmate{room.flatmates > 1 ? 's' : ''}
                  </Badge>
                )}
              </motion.div>

              {/* Description */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-lg font-semibold mb-3">About this room</h2>
                <p className="text-muted-foreground leading-relaxed">{room.description}</p>
              </motion.div>

              {/* Amenities */}
              {room.amenities.length > 0 && (
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
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
                </motion.div>
              )}

              {/* Commute Info */}
              {room.commute && (
                <motion.div
                  className="bg-muted/50 p-4 rounded-xl mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium">{room.commute.time} min commute</p>
                      <p className="text-sm text-muted-foreground">to {room.commute.location}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Reviews Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <ReviewSection roomId={id || ''} isDbRoom={isDbRoom} />
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                className="bg-card border rounded-2xl p-6 sticky top-24 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {/* Price */}
                <div className="mb-6">
                  <span className="text-3xl font-bold">₹{room.price.toLocaleString()}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>

                {/* Match Score */}
                {room.matchScore && (
                  <div
                    className={`flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5 mb-6`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className={`text-2xl font-bold ${getMatchColor(room.matchScore)}`}>
                        {room.matchScore}%
                      </p>
                      <p className="text-sm text-muted-foreground">Compatibility Match</p>
                    </div>
                  </div>
                )}

                {/* Available */}
                <div className="flex items-center gap-2 mb-6 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Available:</span>
                  <span className="font-medium">{room.availableFrom}</span>
                </div>

                {/* Owner */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold">
                    {ownerName[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium flex items-center gap-2">
                      {ownerName}
                      {room.ownerVerified && <Shield className="w-4 h-4 text-green-500" />}
                    </p>
                    <p className="text-xs text-muted-foreground">Property Owner</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full gap-2"
                    onClick={() => handleAction('chat')}
                    disabled={isStaticRoom}
                  >
                    <MessageSquare className="w-4 h-4" />
                    Chat with Owner
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full gap-2"
                    onClick={() => handleAction('viewing')}
                    disabled={isStaticRoom}
                  >
                    <Calendar className="w-4 h-4" />
                    Schedule Visit
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-full gap-2"
                    onClick={() => handleAction('trial_stay')}
                    disabled={isStaticRoom}
                  >
                    Book Trial Stay
                  </Button>
                </div>

                {isStaticRoom && (
                  <p className="text-xs text-muted-foreground text-center mt-4 p-3 bg-muted/50 rounded-lg">
                    This is a demo room. Create an account and list your own room to enable these
                    features.
                  </p>
                )}

                {/* Trust Note */}
                <p className="text-xs text-muted-foreground text-center mt-6">
                  All communications are secure & anonymous until you choose to share details.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Dialogs - Only render for real DB rooms */}
      {isDbRoom && ownerId && (
        <>
          <ChatDialog
            open={chatOpen}
            onOpenChange={setChatOpen}
            roomId={id || ''}
            receiverId={ownerId}
            receiverName={ownerName}
          />

          <BookingDialog
            open={bookingOpen}
            onOpenChange={setBookingOpen}
            roomId={id || ''}
            ownerId={ownerId}
            roomTitle={room.title}
            bookingType={bookingType}
          />
        </>
      )}
    </div>
  )
}