import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-sm">
                <Home className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-gradient">RoomieX</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Smart room rentals with AI-powered flatmate matching.
            </p>
          </div>

          {/* For Tenants */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">For Tenants</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/rooms" className="text-muted-foreground hover:text-foreground transition-colors">Browse Rooms</Link></li>
              <li><Link to="/flatmates" className="text-muted-foreground hover:text-foreground transition-colors">Find Flatmates</Link></li>
            </ul>
          </div>

          {/* For Owners */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">For Owners</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/list-room" className="text-muted-foreground hover:text-foreground transition-colors">List Your Room</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            © 2025 RoomieX. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with ❤️ for hassle-free room hunting
          </p>
        </div>
      </div>
    </footer>
  )
}