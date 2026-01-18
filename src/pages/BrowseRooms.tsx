import { useState, useMemo, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { RoomCard } from '@/components/RoomCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Slider } from '@/components/ui/slider'
import { supabase } from '@/lib/supabase'
import type { RoomListing } from '@/lib/supabase'
import { Search, SlidersHorizontal, MapPin, X, Loader2, Plus, Home, Users, Building } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

export default function BrowseRooms() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [rooms, setRooms] = useState<RoomListing[]>([])
  const [loading, setLoading] = useState(true)

  const [searchQuery, setSearchQuery] = useState(searchParams.get('location') || '')
  const [roomType, setRoomType] = useState(searchParams.get('type') || 'all')
  const [priceRange, setPriceRange] = useState<[number, number]>([
    parseInt(searchParams.get('minPrice') || '0'),
    parseInt(searchParams.get('maxPrice') || '50000'),
  ])
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const fetchRooms = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('room_listings')
      .select('id,title,location,price,room_type,photos,amenities,description,available_from,ai_score')
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      toast.error('Failed to load listings')
      setRooms([])
      setLoading(false)
      return
    }

    setRooms((data || []) as RoomListing[])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchRooms()
  }, [fetchRooms])

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesLocation = room.location.toLowerCase().includes(query)
        const matchesTitle = room.title.toLowerCase().includes(query)
        if (!matchesLocation && !matchesTitle) return false
      }

      if (roomType !== 'all' && room.room_type !== roomType) return false
      if (room.price < priceRange[0] || room.price > priceRange[1]) return false

      return true
    })
  }, [rooms, searchQuery, roomType, priceRange])

  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('location', searchQuery)
    if (roomType !== 'all') params.set('type', roomType)
    if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString())
    if (priceRange[1] < 50000) params.set('maxPrice', priceRange[1].toString())
    setSearchParams(params, { replace: true })
  }, [searchQuery, roomType, priceRange, setSearchParams])

  const clearFilters = () => {
    setSearchQuery('')
    setRoomType('all')
    setPriceRange([0, 50000])
  }

  const hasActiveFilters =
    !!searchQuery || roomType !== 'all' || priceRange[0] > 0 || priceRange[1] < 50000

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Browse Rooms</h1>
            <p className="text-muted-foreground">Find rooms posted by real owners</p>
          </motion.div>

          <motion.div
            className="flex flex-col md:flex-row gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by location or area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <Select value={roomType} onValueChange={setRoomType}>
              <SelectTrigger className="w-full md:w-48 h-12">
                <SelectValue placeholder="Room Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="shared">Shared</SelectItem>
                <SelectItem value="pg">PG</SelectItem>
              </SelectContent>
            </Select>

            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-12 gap-2 ">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {hasActiveFilters && (
                    <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full text-xs">
                      1
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <SheetHeader className="border-b border-border pb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <SheetTitle className="text-2xl">Filters</SheetTitle>
                      <SheetDescription className="text-sm mt-1">
                        Refine your search results
                      </SheetDescription>
                    </div>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-primary hover:text-primary/80 hover:bg-primary/10"
                      >
                        Clear all
                      </Button>
                    )}
                  </div>
                </SheetHeader>

                <div className="mt-8 space-y-8 pb-6">
                  {/* Price Range Section */}
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">Price Range</Label>
                      <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                        ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                      </span>
                    </div>
                    <div className="pt-4 pb-2 px-2">
                      <Slider
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                        max={50000}
                        min={0}
                        step={1000}
                        className="w-full"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground px-1">
                      <span>₹0</span>
                      <span>₹50,000</span>
                    </div>
                  </div>

                  {/* Room Type Section */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Room Type</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setRoomType('all')}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          roomType === 'all'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Home className={`w-5 h-5 mb-2 ${roomType === 'all' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <p className={`text-sm font-medium ${roomType === 'all' ? 'text-primary' : ''}`}>
                          All Types
                        </p>
                      </button>
                      <button
                        onClick={() => setRoomType('private')}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          roomType === 'private'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Home className={`w-5 h-5 mb-2 ${roomType === 'private' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <p className={`text-sm font-medium ${roomType === 'private' ? 'text-primary' : ''}`}>
                          Private
                        </p>
                      </button>
                      <button
                        onClick={() => setRoomType('shared')}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          roomType === 'shared'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Users className={`w-5 h-5 mb-2 ${roomType === 'shared' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <p className={`text-sm font-medium ${roomType === 'shared' ? 'text-primary' : ''}`}>
                          Shared
                        </p>
                      </button>
                      <button
                        onClick={() => setRoomType('pg')}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          roomType === 'pg'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Building className={`w-5 h-5 mb-2 ${roomType === 'pg' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <p className={`text-sm font-medium ${roomType === 'pg' ? 'text-primary' : ''}`}>
                          PG
                        </p>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="sticky bottom-0 bg-background pt-4 pb-6 border-t border-border">
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="flex-1 h-12"
                    >
                      Reset
                    </Button>
                    <Button
                      onClick={() => setIsFilterOpen(false)}
                      className="flex-1 h-12"
                    >
                      Show {filteredRooms.length} Results
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {hasActiveFilters && (
              <Button variant="ghost" onClick={clearFilters} className="h-12">
                Clear
              </Button>
            )}
          </motion.div>

          {hasActiveFilters && (
            <motion.div className="flex flex-wrap gap-2 mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Location: {searchQuery}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                </Badge>
              )}
              {roomType !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  Type: {roomType}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setRoomType('all')} />
                </Badge>
              )}
              {(priceRange[0] > 0 || priceRange[1] < 50000) && (
                <Badge variant="secondary" className="gap-1">
                  ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setPriceRange([0, 50000])} />
                </Badge>
              )}
            </motion.div>
          )}

          <div className="mb-6 text-sm text-muted-foreground">
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading rooms...
              </span>
            ) : (
              <span>{filteredRooms.length} rooms found</span>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No real listings yet</h3>
              <p className="text-muted-foreground mb-6">
                List your room to start testing chat, bookings, reviews and saved rooms.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button onClick={() => navigate('/list-room')} className="gap-2">
                  <Plus className="w-4 h-4" />
                  List a Room
                </Button>
              </div>
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No rooms found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}