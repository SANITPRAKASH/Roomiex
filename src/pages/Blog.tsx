import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ChevronDown, User, ArrowUpRight, ArrowDown } from "lucide-react";

export default function Blog() {
  const [expandedPost, setExpandedPost] = useState<number | null>(null);

  const posts = [
    {
      title: "How AI is Revolutionizing Roommate Matching",
      excerpt: "Discover how artificial intelligence is transforming the way we find compatible flatmates, going beyond basic preferences to analyze lifestyle patterns, work schedules, and personality traits.",
      category: "Technology",
      date: "Jan 15, 2026",
      readTime: "6 min read",
      author: "Priya Sharma",
      image: "ai-roommate-matching.jpg",
      content: "The traditional way of finding roommates often relied on luck and basic compatibility checks. Today, AI algorithms analyze hundreds of data points including sleep schedules, cleanliness habits, social preferences, and even music tastes to suggest ideal matches. Our platform uses machine learning to continuously improve match quality based on successful long-term flatmate relationships. Early results show 85% of AI-matched flatmates report higher satisfaction compared to traditional matching methods. The technology considers factors like work-from-home schedules, guest policies, and shared space usage patterns to predict compatibility. As the AI learns from user feedback, match accuracy improves over time, creating better living experiences for everyone."
    },
    {
      title: "The Ultimate Guide to Bangalore's Best PG Areas in 2026",
      excerpt: "From Koramangala to Whitefield, we break down the top areas for young professionals looking for PG accommodations, covering rent prices, amenities, and commute times.",
      category: "City Guide",
      date: "Jan 12, 2026",
      readTime: "8 min read",
      author: "Rahul Mehta",
      image: "bangalore-pg-areas.jpg",
      content: "Bangalore's rental landscape has evolved significantly in 2026. Koramangala remains the favorite for tech professionals, with average PG rents ranging from ₹12,000-18,000 per month. HSR Layout offers excellent value with strong connectivity and vibrant cafe culture. Whitefield has emerged as the go-to area for IT professionals working in tech parks, with modern PG facilities offering gym access and co-working spaces. Indiranagar caters to those seeking a more upscale lifestyle with premium amenities. Marathahalli provides affordable options with good metro connectivity. When choosing a PG area, consider proximity to your workplace, availability of amenities like gyms and grocery stores, safety ratings, and the neighborhood vibe. Our AI-powered location score helps you find the perfect balance between budget, commute time, and lifestyle preferences."
    },
    {
      title: "First-Time Renter? Here's Everything You Need to Know",
      excerpt: "Moving out for the first time? This comprehensive guide covers security deposits, rental agreements, flatmate etiquette, and common pitfalls to avoid.",
      category: "Tips & Guides",
      date: "Jan 10, 2026",
      readTime: "10 min read",
      author: "Ananya Iyer",
      image: "first-time-renter.jpg",
      content: "Renting your first room is exciting but can be overwhelming. Start by understanding security deposits—typically 2-3 months' rent, which should be refunded when you move out. Always read rental agreements carefully, noting rent amount, due dates, notice periods, and maintenance responsibilities. Document the room's condition with photos on move-in day to avoid deposit disputes later. Budget beyond rent: factor in utilities (₹2,000-4,000/month), internet, food, and transportation. When meeting potential flatmates, discuss house rules, cleaning schedules, guest policies, and bill-splitting methods upfront. Red flags to watch: landlords refusing written agreements, excessive upfront payments, or properties significantly under market rate. Use our room quality scorer to evaluate listings objectively. Join our community forums to learn from experienced renters and get location-specific advice."
    },
    {
      title: "5 Red Flags to Watch Out for When Viewing Rooms",
      excerpt: "Learn how to spot potential issues during room viewings that could lead to problems down the line, from hidden damages to sketchy rental agreements.",
      category: "Safety",
      date: "Jan 8, 2026",
      readTime: "5 min read",
      author: "Vikram Singh",
      image: "room-viewing-red-flags.jpg",
      content: "During room viewings, watch for these warning signs: 1) Dampness or mold on walls/ceilings indicating water damage or poor ventilation. 2) Landlord reluctance to provide written agreements or rushing you to make immediate decisions. 3) Broken locks, faulty windows, or security concerns in the building. 4) Current tenants looking uncomfortable or avoiding eye contact—ask them directly about their experience. 5) Rent significantly below market rate often indicates hidden issues. Check water pressure, electrical outlets, and mobile network strength. Ask about maintenance response times and previous tenant issues. Verify the landlord's ownership documents. Never pay full deposits without a proper agreement. Use our platform's verified listings to reduce risks. Trust your instincts—if something feels off, it probably is. Take someone with you for viewings and schedule them during daylight hours."
    },
    {
      title: "Creating the Perfect Flatmate Agreement",
      excerpt: "A well-structured flatmate agreement prevents conflicts. We share templates and key clauses to include for a harmonious living arrangement.",
      category: "Tips & Guides",
      date: "Jan 5, 2026",
      readTime: "7 min read",
      author: "Sneha Reddy",
      image: "flatmate-agreement.jpg",
      content: "A flatmate agreement is crucial even between friends. Key elements to include: Rent and bills—who pays what and when. Specify bill-splitting methods (equal shares or based on usage). Cleaning schedule—assign rotating responsibilities for common areas. Guest policies—overnight guests, frequency limits, and notice requirements. Quiet hours—especially important for those with different work schedules. Kitchen usage—shared groceries, labeled items, cleaning after cooking. Conflict resolution—how disagreements will be handled. Notice period—minimum 30 days is standard. Deposit handling—document shared item purchases. Temperature preferences—AC/heating usage and costs. Our platform provides customizable agreement templates. Have all flatmates sign and keep copies. Review and update agreements every 6 months. Clear expectations from day one create better relationships and prevent 90% of common flatmate disputes."
    },
    {
      title: "The Rise of Co-Living Spaces: Worth the Premium?",
      excerpt: "Co-living spaces promise community and convenience at a premium price. We analyze if they're worth it compared to traditional PG accommodations.",
      category: "Trends",
      date: "Jan 2, 2026",
      readTime: "6 min read",
      author: "Arjun Patel",
      image: "coliving-spaces.jpg",
      content: "Co-living has exploded in Indian metros, offering fully-furnished spaces with amenities like gyms, co-working areas, and housekeeping. Average costs: ₹15,000-25,000/month vs ₹10,000-15,000 for traditional PGs. What you get extra: professional cleaning, community events, flexible lease terms, and better-maintained facilities. The social aspect attracts young professionals—built-in networking and friendship opportunities. Downsides: less privacy, higher costs, and sometimes corporate atmospheres. Co-living works best for: remote workers needing coworking spaces, newcomers to cities seeking instant communities, and those prioritizing convenience over cost. Traditional PGs suit: budget-conscious renters, those valuing privacy, and people with established social circles. Consider trial stays before committing. Our compatibility quiz helps determine which suits your lifestyle. The co-living premium (40-60% more) makes sense if you'll actually use the amenities and value the community."
    },
    {
      title: "Understanding Your Rights as a Tenant in India",
      excerpt: "Know your legal rights regarding deposits, evictions, maintenance, and privacy to protect yourself from unfair landlord practices.",
      category: "Legal",
      date: "Dec 28, 2025",
      readTime: "9 min read",
      author: "Advocate Meera Kulkarni",
      image: "tenant-rights-india.jpg",
      content: "Indian tenants have legal protections many don't know about. Security deposits cannot exceed 2-3 months' rent and must be refunded within 30 days of vacating. Landlords need proper notice (usually 30-60 days) before eviction and cannot forcibly remove you. You have the right to basic maintenance—plumbing, electricity, and structural repairs are landlord responsibilities. Privacy rights exist—landlords cannot enter without reasonable notice except in emergencies. Rent increases must follow agreement terms or local rent control laws. For disputes, approach local rent control boards before courts—they're faster and cheaper. Always insist on written agreements, even with month-to-month rentals. Police verification requests are legal, but landlords cannot discriminate based on religion, caste, or marital status. Document everything—emails, receipts, photos. Our platform provides legal agreement templates and connects you with tenant rights advocates for consultation."
    },
    {
      title: "Maximizing Small Spaces: Storage Hacks for PG Rooms",
      excerpt: "Transform your compact PG room into an organized, functional space with these creative storage solutions and space-saving tips.",
      category: "Lifestyle",
      date: "Dec 25, 2025",
      readTime: "5 min read",
      author: "Kavya Nair",
      image: "small-space-storage.jpg",
      content: "PG rooms average 100-150 sq ft—here's how to maximize them. Use vertical space: install floating shelves above desks and beds. Under-bed storage boxes utilize wasted space for off-season clothes and extra bedding. Over-door hooks and organizers add storage without drilling. Multipurpose furniture: ottomans with storage, fold-out desks, and bed risers create room underneath. Slim hangers save 50% of closet space compared to bulky ones. Shoe racks on walls free up floor space. Clear storage boxes let you see contents without opening. Use your suitcases for storing occasional-use items instead of letting them sit empty. Wall-mounted fold-down tables serve as desks that disappear when not needed. Magnetic strips hold small metal items. Command hooks avoid damage deposits. Door-mounted mirrors create illusion of more space. Digital decluttering—go paperless where possible. A well-organized small room beats a cluttered large one."
    }
  ];

  const togglePost = (index: number) => {
    setExpandedPost(expandedPost === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-1.5" variant="secondary">
              📚 Blog & Resources
            </Badge>
            <h1 className="text-5xl font-bold mb-4 tracking-tight">
              RoomieX <span className="text-gradient bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Insights</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Expert advice, city guides, and tips to help you find the perfect room and flatmates in India.
            </p>
          </div>

          {/* Blog Posts */}
          <div className="max-w-5xl mx-auto space-y-6">
            {posts.map((post, index) => (
              <div
                key={index}
                className="group border-2 border-border rounded-2xl overflow-hidden bg-card hover:border-primary/50 hover:shadow-2xl transition-all duration-300"
              >
                {/* Header - Always Visible */}
                <button
                  onClick={() => togglePost(index)}
                  className="w-full p-6 text-left flex items-start gap-6 cursor-pointer hover:bg-muted/30 transition-colors"
                >
                  {/* Image */}
                  <div className="w-28 h-28 rounded-xl overflow-hidden shrink-0 border-2 border-border shadow-md group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={`/${post.image}`}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <Badge variant="secondary" className="mb-3 font-medium">
                          {post.category}
                        </Badge>
                        <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors leading-tight">
                          {post.title}
                        </h2>
                      </div>
                      <div className="flex items-center gap-2">
                        <ChevronDown
                          className={`w-7 h-7 text-muted-foreground shrink-0 transition-all duration-300 ${
                            expandedPost === index ? 'rotate-180 text-primary' : ''
                          }`}
                        />
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5 font-medium">
                        <User className="w-3.5 h-3.5" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime}
                      </span>
                      {expandedPost !== index && (
                        <span className="flex items-center gap-1 text-primary ml-auto group-hover:gap-2 transition-all">
                          Read more
                          <ArrowDown className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded Content */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    expandedPost === index
                      ? 'max-h-[2000px] opacity-100'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-8 pt-4 border-t-2 border-border bg-muted/30">
                    <div className="prose prose-sm max-w-none ml-[136px]">
                      <p className="text-muted-foreground leading-relaxed text-base">
                        {post.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}