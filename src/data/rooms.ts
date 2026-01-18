export interface Room {
  id: string
  title: string
  location: string
  price: number
  image: string
  roomType: 'private' | 'shared' | 'pg'
  bathroomType: 'attached' | 'shared'
  furnishing: 'fully' | 'semi' | 'unfurnished'
  flatmates: number
  qualityScore: number
  matchScore?: number
  isVerified: boolean
  amenities: string[]
  commute?: {
    location: string
    time: number
  }
  availableFrom: string
  ownerName: string
  ownerVerified: boolean
  description: string
}

export const rooms: Room[] = [
  {
    id: '1',
    title: 'Bright Private Room in Koramangala',
    location: 'Koramangala, Bangalore',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80',
    roomType: 'private',
    bathroomType: 'shared',
    furnishing: 'fully',
    flatmates: 2,
    qualityScore: 8.4,
    matchScore: 92,
    isVerified: true,
    amenities: ['WiFi', 'AC', 'Washing Machine', 'Kitchen'],
    commute: { location: 'Indiranagar', time: 15 },
    availableFrom: 'Immediate',
    ownerName: 'Priya S.',
    ownerVerified: true,
    description:
      'Beautiful sunlit room with large windows, perfect for remote workers. Quiet neighborhood with cafes nearby. The room comes fully furnished with a comfortable bed, study table, and wardrobe. High-speed WiFi available.',
  },
  {
    id: '2',
    title: 'Cozy Studio Space in HSR Layout',
    location: 'HSR Layout, Bangalore',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80',
    roomType: 'private',
    bathroomType: 'attached',
    furnishing: 'fully',
    flatmates: 1,
    qualityScore: 9.1,
    matchScore: 87,
    isVerified: true,
    amenities: ['WiFi', 'AC', 'Gym Access', 'Balcony'],
    commute: { location: 'Electronic City', time: 20 },
    availableFrom: 'Jan 15',
    ownerName: 'Rahul M.',
    ownerVerified: true,
    description:
      'Modern studio with dedicated workspace, attached bathroom, and amazing plant collection. Perfect for professionals looking for a peaceful living space.',
  },
  {
    id: '3',
    title: 'PG Room with Attached Bath',
    location: 'Marathahalli, Bangalore',
    price: 9500,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80',
    roomType: 'pg',
    bathroomType: 'attached',
    furnishing: 'semi',
    flatmates: 0,
    qualityScore: 7.8,
    matchScore: 78,
    isVerified: true,
    amenities: ['WiFi', 'Meals Included', 'Housekeeping'],
    commute: { location: 'Whitefield', time: 25 },
    availableFrom: 'Immediate',
    ownerName: 'Suman K.',
    ownerVerified: true,
    description:
      'Clean PG accommodation with meals included. Great for students and interns. Weekly housekeeping service provided.',
  },
  {
    id: '4',
    title: 'Premium Co-Living Suite',
    location: 'Indiranagar, Bangalore',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80',
    roomType: 'private',
    bathroomType: 'attached',
    furnishing: 'fully',
    flatmates: 3,
    qualityScore: 9.5,
    matchScore: 95,
    isVerified: true,
    amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Workspace', 'Events'],
    commute: { location: 'MG Road', time: 10 },
    availableFrom: 'Feb 1',
    ownerName: 'CoLive Spaces',
    ownerVerified: true,
    description:
      'Luxury co-living with city views, premium amenities, and vibrant community events. Rooftop pool and fully equipped gym.',
  },
  {
    id: '5',
    title: 'Budget-Friendly Student Room',
    location: 'BTM Layout, Bangalore',
    price: 7000,
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=80',
    roomType: 'shared',
    bathroomType: 'shared',
    furnishing: 'semi',
    flatmates: 4,
    qualityScore: 7.2,
    matchScore: 71,
    isVerified: true,
    amenities: ['WiFi', 'Study Table', 'Power Backup'],
    commute: { location: 'Christ University', time: 12 },
    availableFrom: 'Immediate',
    ownerName: 'Venkat R.',
    ownerVerified: false,
    description:
      'Affordable shared room perfect for students. Close to colleges and metro station. Study-friendly environment.',
  },
  {
    id: '6',
    title: 'Elegant Room in Whitefield',
    location: 'Whitefield, Bangalore',
    price: 16000,
    image: 'https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=1600&q=80',
    roomType: 'private',
    bathroomType: 'attached',
    furnishing: 'fully',
    flatmates: 2,
    qualityScore: 8.9,
    matchScore: 88,
    isVerified: true,
    amenities: ['WiFi', 'AC', 'Parking', 'Garden'],
    commute: { location: 'ITPL', time: 8 },
    availableFrom: 'Jan 20',
    ownerName: 'Arjun D.',
    ownerVerified: true,
    description:
      'Serene room with premium furnishing, attached bathroom, and peaceful garden access. Secure parking available.',
  },
]

// Lifestyle quiz questions for flatmate matching
export const lifestyleQuestions = [
  {
    id: 'sleep',
    question: "What's your sleep schedule?",
    options: [
      { value: 'early', label: 'Early Bird (Before 10 PM)', icon: '🌅' },
      { value: 'normal', label: 'Normal (10 PM - 12 AM)', icon: '🌙' },
      { value: 'late', label: 'Night Owl (After 12 AM)', icon: '🦉' },
    ],
  },
  {
    id: 'cleanliness',
    question: 'How clean do you keep your space?',
    options: [
      { value: 'very', label: 'Very Clean', icon: '✨' },
      { value: 'moderate', label: 'Moderately Clean', icon: '🧹' },
      { value: 'relaxed', label: 'Relaxed about it', icon: '😌' },
    ],
  },
  {
    id: 'social',
    question: 'How social are you at home?',
    options: [
      { value: 'extrovert', label: 'Love having people over', icon: '🎉' },
      { value: 'balanced', label: 'Occasional hangouts', icon: '☕' },
      { value: 'introvert', label: 'Prefer quiet time', icon: '📚' },
    ],
  },
  {
    id: 'smoking',
    question: 'Smoking / Drinking preferences?',
    options: [
      { value: 'none', label: 'Neither', icon: '🚫' },
      { value: 'social', label: 'Socially okay', icon: '🍷' },
      { value: 'regular', label: 'Regular', icon: '🍺' },
    ],
  },
  {
    id: 'wfh',
    question: 'Do you work from home?',
    options: [
      { value: 'always', label: 'Always WFH', icon: '💻' },
      { value: 'hybrid', label: 'Hybrid', icon: '🔄' },
      { value: 'never', label: 'Office Full-time', icon: '🏢' },
    ],
  },
  {
    id: 'pets',
    question: 'How do you feel about pets?',
    options: [
      { value: 'love', label: 'Love pets', icon: '🐕' },
      { value: 'okay', label: "Don't mind", icon: '👍' },
      { value: 'allergic', label: 'Prefer none', icon: '🤧' },
    ],
  },
]