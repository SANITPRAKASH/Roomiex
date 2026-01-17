import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Star, Heart } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface RoomCardProps {
  room: {
    id: string
    title: string
    location: string
    price: number
    room_type: string
    photos: string[] | null
    ai_score: number | null
  }
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <div className="group">
      <Link to={`/room/${room.id}`}>
        <div className="card-elevated overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img 
              src={room.photos?.[0] || '/placeholder.jpg'} 
              alt={room.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* AI Score Badge */}
            {room.ai_score && (
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-background/90 backdrop-blur-sm">
                <Star className="w-4 h-4 text-primary fill-primary" />
                <span className="text-sm font-semibold">{room.ai_score}</span>
                <span className="text-xs text-muted-foreground">AI</span>
              </div>
            )}

            {/* Save Button */}
            <button className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors">
              <Heart className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Title & Location */}
            <h3 className="font-semibold text-foreground line-clamp-1 mb-1 group-hover:text-primary transition-colors">
              {room.title}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
              <MapPin className="w-3.5 h-3.5" />
              {room.location}
            </div>

            {/* Room Type */}
            <div className="mb-3">
              <Badge variant="secondary" className="capitalize">
                {room.room_type}
              </Badge>
            </div>

            {/* Price & CTA */}
            <div className="flex items-center justify-between pt-3 border-t border-border/50">
              <div>
                <span className="text-xl font-bold text-foreground">
                  {formatCurrency(room.price)}
                </span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}