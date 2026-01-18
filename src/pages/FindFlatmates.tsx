import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, MapPin, Briefcase, Calendar, Loader2, MessageSquare, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ChatDialog } from '@/components/ChatDialog'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

interface FlatmateProfile {
  id: string
  user_id: string
  looking_for_room: boolean | null
  budget_min: number | null
  budget_max: number | null
  preferred_location: string | null
  move_in_date: string | null
  occupation: string | null
  age_range: string | null
  lifestyle_preferences: unknown
  bio: string | null
  profile?: {
    full_name: string | null
  }
}

export default function FindFlatmates() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [flatmates, setFlatmates] = useState<FlatmateProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchLocation, setSearchLocation] = useState('')
  const [selectedFlatmate, setSelectedFlatmate] = useState<FlatmateProfile | null>(null)
  const [chatOpen, setChatOpen] = useState(false)

  useEffect(() => {
    fetchFlatmates()
  }, [])

  const fetchFlatmates = async () => {
    try {
      const { data: flatmateData, error: flatmateError } = await supabase
        .from('flatmate_profiles')
        .select('*')
        .eq('looking_for_room', true)
        .order('created_at', { ascending: false })

      if (flatmateError) throw flatmateError

      const userIds = (flatmateData || []).map((f) => f.user_id)
      if (userIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('user_id, full_name')
          .in('user_id', userIds)

        if (profilesError) throw profilesError

        const flatmatesWithProfiles = (flatmateData || []).map((flatmate) => ({
          ...flatmate,
          profile: profilesData?.find((p) => p.user_id === flatmate.user_id) || null,
        }))

        setFlatmates(flatmatesWithProfiles as FlatmateProfile[])
      }
    } catch (error) {
      console.error('Error fetching flatmates:', error)
      toast.error('Failed to load flatmates', {
        description: 'Please refresh the page to try again',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredFlatmates = flatmates.filter((flatmate) =>
    searchLocation
      ? flatmate.preferred_location
          ?.toLowerCase()
          .includes(searchLocation.toLowerCase())
      : true
  )

  const formatBudget = (min: number | null, max: number | null) => {
    if (min && max) return `${formatCurrency(min)} - ${formatCurrency(max)}`
    if (max) return `Up to ${formatCurrency(max)}`
    if (min) return `From ${formatCurrency(min)}`
    return 'Not specified'
  }

  const openChat = (flatmate: FlatmateProfile) => {
    if (!user) {
      toast.error('Please sign in to send messages', {
        action: {
          label: 'Sign In',
          onClick: () => navigate('/auth')
        }
      })
      return
    }
    if (user.id === flatmate.user_id) {
      toast.info('This is your own profile', {
        description: 'You cannot message yourself',
      })
      return
    }
    setSelectedFlatmate(flatmate)
    setChatOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Users className="w-3.5 h-3.5 mr-1" />
              Find Flatmates
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Find Your Perfect Flatmate
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse profiles of people looking for rooms and connect with potential
              flatmates who match your lifestyle.
            </p>
          </div>

          {/* Filters */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by location..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button className="w-full md:w-auto" onClick={() => navigate('/flatmate-profile')}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your Profile
              </Button>
            </div>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredFlatmates.length === 0 ? (
            <Card className="text-center py-16 max-w-md mx-auto">
              <CardContent>
                <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No flatmates found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchLocation 
                    ? `No flatmates found in "${searchLocation}". Try a different location.`
                    : 'Be the first to create a profile and find flatmates!'}
                </p>
                <Button onClick={() => navigate('/flatmate-profile')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your Profile
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFlatmates.map((flatmate) => (
                <Card key={flatmate.id} className="card-elevated h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-xl font-semibold">
                        {flatmate.profile?.full_name?.[0] || '?'}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {flatmate.profile?.full_name || 'Anonymous'}
                        </h3>
                        {flatmate.occupation && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Briefcase className="w-3.5 h-3.5" />
                            {flatmate.occupation}
                          </p>
                        )}
                      </div>
                    </div>

                    {flatmate.bio && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {flatmate.bio}
                      </p>
                    )}

                    <div className="space-y-2 mb-4">
                      {flatmate.preferred_location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{flatmate.preferred_location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Budget:</span>
                        <span>{formatBudget(flatmate.budget_min, flatmate.budget_max)}</span>
                      </div>
                      {flatmate.move_in_date && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>
                            Move in: {new Date(flatmate.move_in_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => openChat(flatmate)}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Message
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {selectedFlatmate && (
        <ChatDialog
          open={chatOpen}
          onOpenChange={setChatOpen}
          roomId={null}  // ⭐ NULL for flatmate chats (no specific room)
          receiverId={selectedFlatmate.user_id}
          receiverName={selectedFlatmate.profile?.full_name || 'Flatmate'}
        />
      )}
    </div>
  )
}