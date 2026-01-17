import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, MapPin, Calendar, Briefcase, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Navbar } from '@/components/Navbar'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

const lifestyleOptions = {
  schedule: ['Early Bird', 'Night Owl', 'Flexible'],
  cleanliness: ['Very Clean', 'Moderately Tidy', 'Relaxed'],
  social: ['Social Butterfly', 'Occasionally Social', 'Private'],
  noise: ['Quiet Environment', 'Moderate Noise', 'Lively'],
}

export default function FlatmateProfile() {
  const { user, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasProfile, setHasProfile] = useState(false)

  const [formData, setFormData] = useState({
    looking_for_room: true,
    budget_min: '',
    budget_max: '',
    preferred_location: '',
    move_in_date: '',
    occupation: '',
    age_range: '',
    bio: '',
    lifestyle_preferences: {} as Record<string, string>,
  })

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth')
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('flatmate_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        setHasProfile(true)
        setFormData({
          looking_for_room: data.looking_for_room ?? true,
          budget_min: data.budget_min?.toString() || '',
          budget_max: data.budget_max?.toString() || '',
          preferred_location: data.preferred_location || '',
          move_in_date: data.move_in_date || '',
          occupation: data.occupation || '',
          age_range: data.age_range || '',
          bio: data.bio || '',
          lifestyle_preferences: (data.lifestyle_preferences as Record<string, string>) || {},
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLifestyleChange = (category: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      lifestyle_preferences: {
        ...prev.lifestyle_preferences,
        [category]: value,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSaving(true)

    try {
      const profileData = {
        user_id: user.id,
        looking_for_room: formData.looking_for_room,
        budget_min: formData.budget_min ? parseFloat(formData.budget_min) : null,
        budget_max: formData.budget_max ? parseFloat(formData.budget_max) : null,
        preferred_location: formData.preferred_location || null,
        move_in_date: formData.move_in_date || null,
        occupation: formData.occupation || null,
        age_range: formData.age_range || null,
        bio: formData.bio || null,
        lifestyle_preferences: formData.lifestyle_preferences,
      }

      if (hasProfile) {
        const { error } = await supabase
          .from('flatmate_profiles')
          .update(profileData)
          .eq('user_id', user.id)

        if (error) throw error
        alert('Profile updated successfully!')
      } else {
        const { error } = await supabase.from('flatmate_profiles').insert(profileData)

        if (error) throw error
        setHasProfile(true)
        alert('Profile created successfully!')
      }

      navigate('/flatmates')
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save profile')
    } finally {
      setIsSaving(false)
    }
  }

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
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-4">
              <User className="w-3.5 h-3.5 mr-1" />
              Flatmate Profile
            </Badge>
            <h1 className="text-3xl font-bold mb-2">
              {hasProfile ? 'Edit Your Profile' : 'Create Your Flatmate Profile'}
            </h1>
            <p className="text-muted-foreground">
              Let others know what you're looking for
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Looking for a Room</Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle on if you're searching for a room
                    </p>
                  </div>
                  <Switch
                    checked={formData.looking_for_room}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, looking_for_room: checked }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="occupation">Occupation</Label>
                  <div className="relative mt-1">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="occupation"
                      placeholder="e.g., Software Engineer, Student"
                      value={formData.occupation}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, occupation: e.target.value }))
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="age_range">Age Range</Label>
                  <Select
                    value={formData.age_range}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, age_range: value }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select age range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="18-24">18-24</SelectItem>
                      <SelectItem value="25-30">25-30</SelectItem>
                      <SelectItem value="31-35">31-35</SelectItem>
                      <SelectItem value="36-40">36-40</SelectItem>
                      <SelectItem value="40+">40+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="bio">About You</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell potential flatmates about yourself..."
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, bio: e.target.value }))
                    }
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Room Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="location">Preferred Location</Label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="e.g., Koramangala, Indiranagar"
                      value={formData.preferred_location}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          preferred_location: e.target.value,
                        }))
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budget_min">Min Budget (₹)</Label>
                    <Input
                      id="budget_min"
                      type="number"
                      placeholder="5000"
                      value={formData.budget_min}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, budget_min: e.target.value }))
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="budget_max">Max Budget (₹)</Label>
                    <Input
                      id="budget_max"
                      type="number"
                      placeholder="15000"
                      value={formData.budget_max}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, budget_max: e.target.value }))
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="move_date">Move-in Date</Label>
                  <div className="relative mt-1">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="move_date"
                      type="date"
                      value={formData.move_in_date}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, move_in_date: e.target.value }))
                      }
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg">Lifestyle Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(lifestyleOptions).map(([category, options]) => (
                  <div key={category}>
                    <Label className="capitalize">{category}</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {options.map((option) => (
                        <Badge
                          key={option}
                          variant={
                            formData.lifestyle_preferences[category] === option
                              ? 'default'
                              : 'outline'
                          }
                          className="cursor-pointer"
                          onClick={() => handleLifestyleChange(category, option)}
                        >
                          {option}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {hasProfile ? 'Update Profile' : 'Create Profile'}
                </>
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}