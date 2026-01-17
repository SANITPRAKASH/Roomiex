import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageSquare, Loader2, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ChatDialog } from '@/components/ChatDialog'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

interface Conversation {
  id: string
  otherUserId: string
  otherUserName: string
  roomId: string
  roomTitle: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}

export default function Messages() {
  const { user, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [chatOpen, setChatOpen] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth')
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (user) {
      fetchConversations()
      subscribeToNewMessages()
    }
  }, [user])

  const fetchConversations = async () => {
    if (!user) return

    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Group by room and other user
      const conversationMap = new Map<string, Conversation>()

      for (const msg of messages || []) {
        const otherUserId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id
        const key = `${msg.room_id}-${otherUserId}`

        if (!conversationMap.has(key)) {
          // Fetch other user's profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', otherUserId)
            .single()

          // Fetch room info
          const { data: room } = await supabase
            .from('room_listings')
            .select('title')
            .eq('id', msg.room_id)
            .single()

          const unreadCount = (messages || []).filter(
            (m) => m.room_id === msg.room_id && m.sender_id === otherUserId && !m.read
          ).length

          conversationMap.set(key, {
            id: key,
            otherUserId,
            otherUserName: profile?.full_name || 'Unknown User',
            roomId: msg.room_id,
            roomTitle: room?.title || 'Unknown Room',
            lastMessage: msg.content,
            lastMessageTime: msg.created_at,
            unreadCount,
          })
        }
      }

      setConversations(Array.from(conversationMap.values()))
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const subscribeToNewMessages = () => {
    const channel = supabase
      .channel('messages-list')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
        fetchConversations()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.otherUserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.roomTitle.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 48) {
      return 'Yesterday'
    }
    return date.toLocaleDateString()
  }

  const openChat = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    setChatOpen(true)
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Messages</h1>
            <p className="text-muted-foreground">Your conversations with room owners</p>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Conversations */}
          {filteredConversations.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                <p className="text-muted-foreground">
                  Start a conversation by messaging a room owner
                </p>
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-2">
                {filteredConversations.map((conversation) => (
                  <Card
                    key={conversation.id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => openChat(conversation)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold flex-shrink-0">
                          {conversation.otherUserName[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold truncate">
                              {conversation.otherUserName}
                            </h3>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(conversation.lastMessageTime)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate mb-1">
                            {conversation.lastMessage}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {conversation.roomTitle}
                            </Badge>
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-primary text-primary-foreground text-xs">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </main>

      <Footer />

      {selectedConversation && (
        <ChatDialog
          open={chatOpen}
          onOpenChange={setChatOpen}
          roomId={selectedConversation.roomId}
          receiverId={selectedConversation.otherUserId}
          receiverName={selectedConversation.otherUserName}
        />
      )}
    </div>
  )
}