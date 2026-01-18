import { useState, useEffect } from 'react'
import { Heart, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

interface SaveRoomButtonProps {
  roomId: string
  className?: string
}

export function SaveRoomButton({ roomId, className = '' }: SaveRoomButtonProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      checkIfSaved()
    }
  }, [user, roomId])

  const checkIfSaved = async () => {
    if (!user) return

    try {
      const { data } = await supabase
        .from('saved_rooms')
        .select('id')
        .eq('user_id', user.id)
        .eq('room_id', roomId)
        .single()

      setIsSaved(!!data)
    } catch {
      // Not saved
    }
  }

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation if inside Link
    e.stopPropagation()

    if (!user) {
      toast.error('Please sign in to save rooms', {
        action: {
          label: 'Sign In',
          onClick: () => navigate('/auth')
        }
      })
      return
    }

    setIsLoading(true)

    try {
      if (isSaved) {
        // Unsave
        const { error } = await supabase
          .from('saved_rooms')
          .delete()
          .eq('user_id', user.id)
          .eq('room_id', roomId)

        if (error) throw error
        
        setIsSaved(false)
        toast.success('Removed from saved', {
          description: 'Room removed from your collection',
        })
      } else {
        // Save
        const { error } = await supabase.from('saved_rooms').insert({
          user_id: user.id,
          room_id: roomId,
        })

        if (error) throw error
        
        setIsSaved(true)
        toast.success('Saved to collection', {
          description: 'View all saved rooms in your profile',
          action: {
            label: 'View',
            onClick: () => navigate('/saved')
          }
        })
      }
    } catch (error) {
      console.error('Error toggling save:', error)
      toast.error('Failed to save room', {
        description: 'Please try again',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={toggleSave}
      disabled={isLoading}
      className={`p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors ${className}`}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Heart
          className={`w-4 h-4 transition-colors ${
            isSaved ? 'fill-red-500 text-red-500' : ''
          }`}
        />
      )}
    </button>
  )
}