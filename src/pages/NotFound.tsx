import { Link } from 'react-router-dom'
import { Home, Search} from 'lucide-react'
import { Button } from '@/components/ui/button'


export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Image */}
      

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Text */}
          <div className="mb-8">
            <h1 className="text-10xl md:text-[10 rem] font-bold text-gradient leading-none mb-4">
              404
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-6" />
          </div>

          {/* Message */}
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Oops! Room Not Found
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            Looks like this room doesn't exist. But don't worry, we have thousands of other great rooms waiting for you!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            </Link>
            <Link to="/rooms">
              <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                <Search className="w-4 h-4" />
                Browse Rooms
              </Button>
            </Link>
          </div>

          {/* Helper Text */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">
              Need help? Here are some helpful links:
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <Link to="/" className="text-primary hover:underline">
                Home
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/rooms" className="text-primary hover:underline">
                Browse Rooms
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/profile" className="text-primary hover:underline">
                My Profile
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/contact" className="text-primary hover:underline">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-2xl" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl" />
    </div>
  )
}