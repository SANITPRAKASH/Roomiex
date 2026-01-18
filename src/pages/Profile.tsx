import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Home, MapPin, Edit, Trash2, Plus, Loader2, Heart, Calendar, MessageSquare, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface Profile {
  id: string
  user_id: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
}

interface RoomListing {
  id: string
  title: string
  location: string
  price: number
  status: string | null
  ai_score: number | null
  photos: string[] | null
  created_at: string
}

export default function Profile() {
  const { user, isLoading: authLoading, signOut } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [listings, setListings] = useState<RoomListing[]>([])
  const [savedCount, setSavedCount] = useState(0)
  const [messagesCount, setMessagesCount] = useState(0)
  const [bookingsCount, setBookingsCount] = useState(0)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isLoadingListings, setIsLoadingListings] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ full_name: '', phone: '' })

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth')
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (user) {
      fetchProfile()
      fetchListings()
      fetchCounts()
    }
  }, [user])

  const fetchProfile = async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) throw error
      setProfile(data)
      setEditForm({
        full_name: data.full_name || '',
        phone: data.phone || '',
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setIsLoadingProfile(false)
    }
  }

  const fetchListings = async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase
        .from('room_listings')
        .select('id, title, location, price, status, ai_score, photos, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setListings(data || [])
    } catch (error) {
      console.error('Error fetching listings:', error)
    } finally {
      setIsLoadingListings(false)
    }
  }

  const fetchCounts = async () => {
    if (!user) return
    
    try {
      const [savedRes, messagesRes, bookingsRes] = await Promise.all([
        supabase.from('saved_rooms').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('receiver_id', user.id).eq('read', false),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
      ])
      
      setSavedCount(savedRes.count || 0)
      setMessagesCount(messagesRes.count || 0)
      setBookingsCount(bookingsRes.count || 0)
    } catch (error) {
      console.error('Error fetching counts:', error)
    }
  }

  const updateProfile = async () => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editForm.full_name,
          phone: editForm.phone,
        })
        .eq('user_id', user.id)

      if (error) throw error

      setProfile(prev => prev ? { ...prev, ...editForm } : null)
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
  }

  const deleteListing = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return

    try {
      const { error } = await supabase
        .from('room_listings')
        .delete()
        .eq('id', id)

      if (error) throw error

      setListings(prev => prev.filter(l => l.id !== id))
      toast.success('Listing deleted successfully!')
    } catch (error) {
      console.error('Error deleting listing:', error)
      toast.error('Failed to delete listing')
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  if (authLoading || isLoadingProfile) {
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Profile Header */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <User className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold">
                        {profile?.full_name || 'Your Profile'}
                      </h1>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-1" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {isEditing && (
                <CardContent className="border-t pt-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={editForm.full_name}
                        onChange={(e) =>
                          setEditForm(prev => ({ ...prev, full_name: e.target.value }))
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={editForm.phone}
                        onChange={(e) =>
                          setEditForm(prev => ({ ...prev, phone: e.target.value }))
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={updateProfile}>Save Changes</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        My Listings
                      </h3>
                      <p className="text-3xl font-bold">{listings.length}</p>
                    </div>
                    <Home className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Saved Rooms
                      </h3>
                      <p className="text-3xl font-bold">{savedCount}</p>
                    </div>
                    <Heart className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Unread Messages
                      </h3>
                      <p className="text-3xl font-bold">{messagesCount}</p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* My Listings Tab */}
            <Tabs defaultValue="listings" className="w-full">
              <TabsList className="w-full grid grid-cols-2 mb-6">
                <TabsTrigger value="listings" className="gap-2">
                  <Home className="w-4 h-4" />
                  My Listings
                </TabsTrigger>
                <TabsTrigger value="quick-links" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Quick Links
                </TabsTrigger>
              </TabsList>

              <TabsContent value="listings">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Your Listings</h2>
                  <Link to="/list-room">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      New Listing
                    </Button>
                  </Link>
                </div>

                {isLoadingListings ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : listings.length === 0 ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Home className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
                      <p className="text-muted-foreground mb-4">
                        List your first room and start finding flatmates
                      </p>
                      <Link to="/list-room">
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          List Your Room
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {listings.map((listing) => (
                      <Card key={listing.id} className="overflow-hidden">
                        <div className="flex">
                          {listing.photos && listing.photos[0] && (
                            <div className="w-32 h-32 flex-shrink-0">
                              <img
                                src={listing.photos[0]}
                                alt={listing.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <CardContent className="flex-1 p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold">{listing.title}</h3>
                                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                  <MapPin className="w-3 h-3" />
                                  {listing.location}
                                </p>
                                <p className="text-lg font-bold mt-2">
                                  ₹{listing.price.toLocaleString()}
                                  <span className="text-sm font-normal text-muted-foreground">
                                    /month
                                  </span>
                                </p>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Badge
                                  variant={listing.status === 'published' ? 'default' : 'secondary'}
                                >
                                  {listing.status || 'draft'}
                                </Badge>
                                {listing.ai_score && (
                                  <Badge variant="outline" className="text-primary">
                                    AI Score: {listing.ai_score}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/room/${listing.id}`}>View</Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteListing(listing.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="quick-links">
                <div className="grid gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <Link to="/saved" className="flex items-center justify-between hover:opacity-80">
                        <div className="flex items-center gap-3">
                          <Heart className="w-5 h-5 text-primary" />
                          <span className="font-medium">Saved Rooms</span>
                        </div>
                        <Badge>{savedCount}</Badge>
                      </Link>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <Link to="/messages" className="flex items-center justify-between hover:opacity-80">
                        <div className="flex items-center gap-3">
                          <MessageSquare className="w-5 h-5 text-primary" />
                          <span className="font-medium">Messages</span>
                        </div>
                        <Badge>{messagesCount}</Badge>
                      </Link>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <Link to="/bookings" className="flex items-center justify-between hover:opacity-80">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-primary" />
                          <span className="font-medium">Bookings</span>
                        </div>
                        <Badge>{bookingsCount}</Badge>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}