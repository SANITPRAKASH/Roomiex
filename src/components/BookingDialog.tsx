import { useState } from 'react'
import { Calendar, Clock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

interface BookingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  roomId: string
  ownerId: string
  roomTitle: string
  bookingType: 'viewing' | 'trial_stay'
}

const timeSlots = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
]

export function BookingDialog({
  open,
  onOpenChange,
  roomId,
  ownerId,
  roomTitle,
  bookingType,
}: BookingDialogProps) {
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      alert('Please sign in to book')
      return
    }

    if (!formData.date || !formData.time) {
      alert('Please select date and time')
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await supabase.from('bookings').insert({
        room_id: roomId,
        user_id: user.id,
        owner_id: ownerId,
        booking_type: bookingType,
        preferred_date: formData.date,
        preferred_time: formData.time,
        message: formData.message || null,
      })

      if (error) throw error

      alert(
        bookingType === 'viewing'
          ? 'Visit request sent! The owner will confirm shortly.'
          : 'Trial stay request sent! The owner will confirm shortly.'
      )
      onOpenChange(false)
      setFormData({ date: '', time: '', message: '' })
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Failed to submit request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const minDate = new Date().toISOString().split('T')[0]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {bookingType === 'viewing' ? (
              <>
                <Calendar className="w-5 h-5 text-primary" />
                Schedule a Visit
              </>
            ) : (
              <>
                <Clock className="w-5 h-5 text-primary" />
                Book Trial Stay
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {bookingType === 'viewing'
              ? `Request to visit "${roomTitle}". The owner will confirm your preferred time.`
              : `Book a trial stay at "${roomTitle}" to experience living there before committing.`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="date">Preferred Date</Label>
            <Input
              id="date"
              type="date"
              min={minDate}
              value={formData.date}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, date: e.target.value }))
              }
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="time">Preferred Time</Label>
            <Select
              value={formData.time}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, time: value }))
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder={
                bookingType === 'viewing'
                  ? "Any questions or specific things you'd like to see?"
                  : 'Let them know about your trial stay preferences...'
              }
              value={formData.message}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, message: e.target.value }))
              }
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Request'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}