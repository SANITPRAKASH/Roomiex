import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Calendar, Clock, CheckCircle, XCircle, Loader2, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import type { RoomListing } from '@/lib/supabase'

interface Booking {
  id: string
  room_id: string | null
  user_id: string
  owner_id: string
  booking_type: string
  preferred_date: string
  preferred_time: string
  message: string | null
  status: string | null
  created_at: string
  room?: RoomListing | null
  is_owner: boolean
}

export default function MyBookings() {
  const { user, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth')
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user])

  const fetchBookings = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          room:room_listings(*)
        `)
        .or(`user_id.eq.${user.id},owner_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedData = (data || []).map((item) => ({
        ...item,
        room: item.room as unknown as RoomListing | null,
        is_owner: item.owner_id === user.id,
      }))

      setBookings(formattedData)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId: string, status: 'confirmed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId)

      if (error) throw error

      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
      )

      alert(status === 'confirmed' ? 'Booking confirmed!' : 'Booking cancelled')
    } catch (error) {
      console.error('Error updating booking:', error)
      alert('Failed to update booking')
    }
  }

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Confirmed</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const myBookings = bookings.filter((b) => !b.is_owner)
  const receivedBookings = bookings.filter((b) => b.is_owner)

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

      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
            <p className="text-muted-foreground">
              Manage your room viewings and trial stays
            </p>
          </div>

          <Tabs defaultValue="my-bookings" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="my-bookings">My Requests</TabsTrigger>
              <TabsTrigger value="received">Received Requests</TabsTrigger>
            </TabsList>

            <TabsContent value="my-bookings">
              {myBookings.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Browse rooms and schedule a viewing
                    </p>
                    <Link to="/rooms">
                      <Button>
                        <Home className="w-4 h-4 mr-2" />
                        Browse Rooms
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {myBookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              {booking.booking_type === 'viewing' ? (
                                <Calendar className="w-6 h-6 text-primary" />
                              ) : (
                                <Clock className="w-6 h-6 text-primary" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold capitalize">
                                {booking.booking_type === 'viewing'
                                  ? 'Room Visit'
                                  : 'Trial Stay'}
                              </h3>
                              {booking.room && (
                                <Link
                                  to={`/room/${booking.room.id}`}
                                  className="text-sm text-primary hover:underline"
                                >
                                  {booking.room.title}
                                </Link>
                              )}
                              <p className="text-sm text-muted-foreground mt-1">
                                {new Date(booking.preferred_date).toLocaleDateString()} at{' '}
                                {booking.preferred_time}
                              </p>
                              {booking.message && (
                                <p className="text-sm text-muted-foreground mt-2 italic">
                                  "{booking.message}"
                                </p>
                              )}
                            </div>
                          </div>
                          <div>{getStatusBadge(booking.status)}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="received">
              {receivedBookings.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No booking requests</h3>
                    <p className="text-muted-foreground">
                      When someone books a viewing for your room, it will appear here
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {receivedBookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              {booking.booking_type === 'viewing' ? (
                                <Calendar className="w-6 h-6 text-primary" />
                              ) : (
                                <Clock className="w-6 h-6 text-primary" />
                              )}
                            </div>
                            <div>
                              <Badge variant="outline" className="mb-2">
                                Received Request
                              </Badge>
                              <h3 className="font-semibold capitalize">
                                {booking.booking_type === 'viewing'
                                  ? 'Room Visit'
                                  : 'Trial Stay'}
                              </h3>
                              {booking.room && (
                                <p className="text-sm text-muted-foreground">
                                  {booking.room.title}
                                </p>
                              )}
                              <p className="text-sm text-muted-foreground mt-1">
                                {new Date(booking.preferred_date).toLocaleDateString()} at{' '}
                                {booking.preferred_time}
                              </p>
                              {booking.message && (
                                <p className="text-sm text-muted-foreground mt-2 italic">
                                  "{booking.message}"
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {getStatusBadge(booking.status)}
                            {booking.status === 'pending' && (
                              <div className="flex gap-1 mt-2">
                                <Button
                                  size="sm"
                                  onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                >
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                >
                                  Decline
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}