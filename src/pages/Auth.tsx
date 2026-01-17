import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Home, Mail, Lock, User, Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false)

  const { signIn, signUp, user, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user && !isLoading) {
      toast.success('Welcome back!')
      navigate('/')
    }
  }, [user, isLoading, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (isLogin) {
        // Sign In
        const { error } = await signIn(email, password)
        if (error) {
          toast.error(error.message || 'Failed to sign in')
        } else {
          toast.success('Welcome back!')
          navigate('/')
        }
      } else {
        // Sign Up
        const { error } = await signUp(email, password, fullName)
        if (error) {
          toast.error(error.message || 'Failed to create account')
        } else {
          // Show success message and email confirmation notice
          setShowEmailConfirmation(true)
          toast.success('Account created! Check your email to verify.')
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  // Email Confirmation Screen
  if (showEmailConfirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full">
          <div className="card-elevated p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            
            <h1 className="text-2xl font-bold mb-2">Check Your Email</h1>
            <p className="text-muted-foreground mb-6">
              We've sent a confirmation email to <span className="font-semibold text-foreground">{email}</span>
            </p>

            <div className="bg-accent/50 border border-border rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                Next Steps:
              </h3>
              <ol className="text-sm text-muted-foreground space-y-2 ml-6 list-decimal">
                <li>Check your inbox for our confirmation email</li>
                <li>Click the verification link in the email</li>
                <li>Come back here and sign in with your credentials</li>
              </ol>
            </div>

            <div className="space-y-3">
              <Button 
                className="w-full"
                onClick={() => {
                  setShowEmailConfirmation(false)
                  setIsLogin(true)
                  setPassword('')
                }}
              >
                Go to Sign In
              </Button>
              
              <p className="text-sm text-muted-foreground">
                Didn't receive the email?{' '}
                <button 
                  onClick={() => {
                    toast.info('Please wait a few minutes and check your spam folder')
                  }}
                  className="text-primary hover:underline"
                >
                  Check spam folder
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left - Auth Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-sm">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-gradient">RoomieX</span>
          </Link>

          <div>
            <h1 className="text-3xl font-bold mb-2">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-muted-foreground mb-8">
              {isLogin
                ? 'Sign in to manage your listings and find flatmates'
                : 'Join RoomieX to list your room or find your perfect flatmate'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      className="pl-10"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {!isLogin && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Must be at least 6 characters
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  <>{isLogin ? 'Sign In' : 'Create Account'}</>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setPassword('')
                  setShowEmailConfirmation(false)
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Hero Image */}
      <div className="hidden lg:block lg:flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
        <img
          src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80"
          alt="Modern apartment"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Find your perfect room
          </h2>
          <p className="text-muted-foreground">
            Join thousands of people finding their ideal living space.
          </p>
        </div>
      </div>
    </div>
  )
}