import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('🔵 AuthProvider: Initializing...')
    
    let mounted = true

    // Check for existing session first
    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          console.error('❌ Error getting session:', error)
        }
        if (mounted) {
          console.log('🔵 Initial session:', session ? 'Found' : 'None')
          setSession(session)
          setUser(session?.user ?? null)
          setIsLoading(false)
        }
      })
      .catch((error) => {
        console.error('❌ Fatal error getting session:', error)
        if (mounted) {
          setIsLoading(false)
        }
      })

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔵 Auth state changed:', event, session ? 'Session exists' : 'No session')
        if (mounted) {
          setSession(session)
          setUser(session?.user ?? null)
          setIsLoading(false)
        }
      }
    )

    return () => {
      console.log('🔵 AuthProvider: Cleaning up...')
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, fullName: string) => {
    console.log('🔵 Attempting sign up...')
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })
      if (error) {
        console.error('❌ Sign up error:', error)
      } else {
        console.log('✅ Sign up successful')
      }
      return { error }
    } catch (error) {
      console.error('❌ Fatal sign up error:', error)
      return { error: error as Error }
    }
  }

  const signIn = async (email: string, password: string) => {
    console.log('🔵 Attempting sign in...')
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        console.error('❌ Sign in error:', error)
      } else {
        console.log('✅ Sign in successful')
      }
      return { error }
    } catch (error) {
      console.error('❌ Fatal sign in error:', error)
      return { error: error as Error }
    }
  }

  const signOut = async () => {
    console.log('🔵 Signing out...')
    try {
      await supabase.auth.signOut()
      console.log('✅ Sign out successful')
    } catch (error) {
      console.error('❌ Sign out error:', error)
    }
  }

  console.log('🔵 AuthProvider rendering, isLoading:', isLoading, 'user:', user ? 'Yes' : 'No')

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}