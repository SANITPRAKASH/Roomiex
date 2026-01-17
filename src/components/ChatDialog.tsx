import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, Loader2, Circle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  room_id: string | null
  content: string
  created_at: string
  read: boolean
}

interface ChatDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  roomId?: string | null
  receiverId: string
  receiverName: string
}

export function ChatDialog({
  open,
  onOpenChange,
  roomId = null,
  receiverId,
  receiverName,
}: ChatDialogProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && user) {
      setIsLoading(true)
      fetchMessages()
      const unsubscribe = subscribeToMessages()
      return unsubscribe
    }
  }, [open, user, receiverId, roomId])

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const fetchMessages = async () => {
    if (!user) return

    try {
      let query = supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })

      // Filter by room OR direct messages
      if (roomId) {
        query = query.eq('room_id', roomId)
      } else {
        query = query
          .is('room_id', null)
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id})`)
      }

      const { data, error } = await query

      if (error) throw error
      setMessages(data || [])

      // Mark messages as read
      if (data && data.length > 0) {
        let updateQuery = supabase
          .from('messages')
          .update({ read: true })
          .eq('receiver_id', user.id)
          .eq('read', false)

        if (roomId) {
          updateQuery = updateQuery.eq('room_id', roomId)
        } else {
          updateQuery = updateQuery.is('room_id', null).eq('sender_id', receiverId)
        }

        await updateQuery
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const subscribeToMessages = () => {
    const channelId = roomId ? `messages-${roomId}` : `dm-${user?.id}-${receiverId}`
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newMsg = payload.new as Message

          // Check if this message belongs to our conversation
          const isOurConversation = roomId
            ? newMsg.room_id === roomId
            : !newMsg.room_id &&
              ((newMsg.sender_id === user?.id && newMsg.receiver_id === receiverId) ||
                (newMsg.sender_id === receiverId && newMsg.receiver_id === user?.id))

          if (isOurConversation) {
            setMessages((prev) => {
              // Avoid duplicates
              if (prev.some(msg => msg.id === newMsg.id)) return prev
              return [...prev, newMsg]
            })

            // Show notification if message is from other user
            if (newMsg.sender_id === receiverId) {
              // Toast notification
              toast(`💬 ${receiverName}`, {
                description: newMsg.content,
              })

              // Mark as read immediately since dialog is open
              supabase
                .from('messages')
                .update({ read: true })
                .eq('id', newMsg.id)
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const deletedId = payload.old.id
          setMessages((prev) => prev.filter((msg) => msg.id !== deletedId))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error('Please sign in to chat')
      navigate('/auth')
      return
    }

    if (!newMessage.trim()) return

    setIsSending(true)

    try {
      const { error } = await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: receiverId,
        room_id: roomId,
        content: newMessage.trim(),
      })

      if (error) throw error
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
    } finally {
      setIsSending(false)
    }
  }

  const deleteMessage = async (messageId: string) => {
    try {
      // First, optimistically remove from UI
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId))
      
      // Then delete from database
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)
        .eq('sender_id', user?.id) // Ensure only sender can delete

      if (error) {
        console.error('Error deleting message:', error)
        toast.error('Failed to delete message')
        // Refetch to restore on error
        fetchMessages()
      } else {
        toast.success('Message deleted')
      }
    } catch (error) {
      console.error('Error deleting message:', error)
      toast.error('Failed to delete message')
      fetchMessages()
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    }
    return date.toLocaleDateString()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg h-[600px] flex flex-col p-0">
        <DialogHeader className="p-4 pb-3 border-b">
          <DialogTitle className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-semibold text-lg">
                {receiverName[0]?.toUpperCase() || 'U'}
              </div>
              <Circle className="w-3 h-3 fill-green-500 text-green-500 absolute bottom-0 right-0 border-2 border-background rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-base truncate">{receiverName}</p>
              <p className="text-xs text-muted-foreground">
                {roomId ? 'Room chat' : 'Direct message'}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Send className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-foreground font-medium mb-1">No messages yet</p>
              <p className="text-sm text-muted-foreground">
                Send a message to start the conversation!
              </p>
            </div>
          ) : (
            <div className="h-full overflow-y-auto px-4 py-2" ref={scrollRef}>
              <div className="space-y-3 py-2">
                {messages.map((message, index) => {
                  const isOwn = message.sender_id === user?.id
                  const showDate =
                    index === 0 ||
                    formatDate(message.created_at) !==
                      formatDate(messages[index - 1].created_at)

                  return (
                    <div key={message.id}>
                      {showDate && (
                        <div className="text-center my-4">
                          <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                            {formatDate(message.created_at)}
                          </span>
                        </div>
                      )}
                      <div
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-3 py-2 shadow-sm group ${
                            isOwn
                              ? 'bg-primary text-primary-foreground rounded-br-md'
                              : 'bg-muted text-foreground rounded-bl-md'
                          }`}
                        >
                          <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                            {message.content}
                          </p>
                          <div className="flex items-center justify-between gap-3 mt-1.5">
                            <span
                              className={`text-[10px] font-medium ${
                                isOwn
                                  ? 'text-primary-foreground/60'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {formatTime(message.created_at)}
                            </span>
                            {isOwn && (
                              <button
                                onClick={() => deleteMessage(message.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-primary-foreground/10 rounded"
                                aria-label="Delete message"
                              >
                                <Trash2 className="w-3 h-3 text-primary-foreground/70 hover:text-primary-foreground" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}</div>

        <form
          onSubmit={sendMessage}
          className="p-3 border-t flex gap-2 bg-background"
        >
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={isSending}
            className="flex-1"
            autoFocus
          />
          <Button
            type="submit"
            size="icon"
            disabled={isSending || !newMessage.trim()}
            className="shrink-0 h-10 w-10"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}