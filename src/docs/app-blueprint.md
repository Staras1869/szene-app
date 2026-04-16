# 📱 Szene App Blueprint
## Transform Website to Full-Featured Mobile App

### 🎯 **App Vision**
Transform Szene from a website into the **ultimate nightlife & dining companion app** for Mannheim & Heidelberg.

## 🏗️ **Technical Architecture**

### **Frontend Stack**
- **Next.js 14** with App Router (current)
- **React Native** for mobile apps (iOS/Android)
- **Expo** for rapid development and deployment
- **TypeScript** for type safety
- **Tailwind CSS** for web styling
- **NativeWind** for React Native styling

### **Backend & Database**
- **Neon PostgreSQL** (already integrated)
- **Prisma ORM** for database management
- **NextAuth.js** for authentication
- **Vercel** for hosting and serverless functions

### **Mobile Features**
- **Push Notifications** for events and deals
- **GPS Location** for nearby venues
- **Camera Integration** for photo uploads
- **Offline Mode** for saved venues
- **Social Sharing** to Instagram/TikTok

## 📊 **Database Schema Design**

### **Core Tables**
\`\`\`sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE,
  full_name VARCHAR(255),
  avatar_url TEXT,
  phone VARCHAR(20),
  date_of_birth DATE,
  city VARCHAR(100),
  preferences JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Venues table
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone VARCHAR(20),
  website TEXT,
  instagram VARCHAR(100),
  description TEXT,
  price_range VARCHAR(10),
  opening_hours JSONB,
  features JSONB,
  images JSONB,
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID REFERENCES venues(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  price VARCHAR(50),
  category VARCHAR(100),
  image_url TEXT,
  ticket_url TEXT,
  capacity INTEGER,
  attendees_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  venue_id UUID REFERENCES venues(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  images JSONB,
  visit_date DATE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User favorites
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  venue_id UUID REFERENCES venues(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, venue_id)
);

-- Check-ins
CREATE TABLE check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  venue_id UUID REFERENCES venues(id),
  event_id UUID REFERENCES events(id),
  check_in_time TIMESTAMP DEFAULT NOW(),
  location_verified BOOLEAN DEFAULT FALSE
);
\`\`\`

## 🚀 **App Features Roadmap**

### **Phase 1: Core App (Weeks 1-4)**
- [ ] User authentication (email, social login)
- [ ] Venue discovery with GPS
- [ ] Basic search and filters
- [ ] Venue details and photos
- [ ] User profiles and preferences

### **Phase 2: Social Features (Weeks 5-8)**
- [ ] User reviews and ratings
- [ ] Photo uploads and sharing
- [ ] Check-ins and location verification
- [ ] Friend system and social feed
- [ ] Event RSVPs and attendance

### **Phase 3: Advanced Features (Weeks 9-12)**
- [ ] Push notifications for events
- [ ] Personalized recommendations
- [ ] Loyalty programs and deals
- [ ] Table reservations
- [ ] In-app messaging

### **Phase 4: Business Features (Weeks 13-16)**
- [ ] Venue owner dashboard
- [ ] Event management system
- [ ] Analytics and insights
- [ ] Payment integration
- [ ] Marketing tools

## 📱 **Mobile App Structure**

### **Navigation Structure**
\`\`\`
📱 Szene App
├── 🏠 Home (Discover)
│   ├── Featured venues
│   ├── Nearby recommendations
│   ├── Current events
│   └── Weather integration
├── 🔍 Search
│   ├── Venue search
│   ├── Event search
│   ├── Advanced filters
│   └── Map view
├── 📍 Map
│   ├── Interactive venue map
│   ├── GPS navigation
│   ├── Real-time updates
│   └── Augmented reality
├── 📅 Events
│   ├── Tonight's events
│   ├── This weekend
│   ├── My RSVPs
│   └── Event calendar
├── ❤️ Favorites
│   ├── Saved venues
│   ├── Wishlist
│   ├── Recent visits
│   └── Collections
└── 👤 Profile
    ├── User settings
    ├── My reviews
    ├── Check-in history
    └── Social connections
\`\`\`

## 🎨 **UI/UX Design System**

### **Color Palette**
- **Primary**: Purple gradient (#8B5CF6 → #A855F7)
- **Secondary**: Amber/Orange (#F59E0B → #EA580C)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)
- **Neutral**: Gray scale (#F9FAFB → #111827)

### **Typography**
- **Headings**: Inter Bold
- **Body**: Inter Regular
- **Captions**: Inter Medium
- **Buttons**: Inter SemiBold

### **Component Library**
- **Cards**: Rounded corners, subtle shadows
- **Buttons**: Gradient backgrounds, rounded
- **Forms**: Clean inputs with validation
- **Navigation**: Bottom tab bar + stack navigation
- **Modals**: Slide-up animations

## 🔧 **Development Setup**

### **Project Structure**
\`\`\`
szene-app/
├── apps/
│   ├── web/                 # Next.js web app
│   ├── mobile/              # React Native app
│   └── admin/               # Admin dashboard
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── database/            # Prisma schema & migrations
│   ├── auth/                # Authentication logic
│   └── api/                 # Shared API functions
├── docs/                    # Documentation
└── tools/                   # Build tools & scripts
\`\`\`

## 📊 **Analytics & Metrics**

### **Key Performance Indicators (KPIs)**
- **User Engagement**: Daily/Monthly active users
- **Venue Discovery**: Search → visit conversion
- **Social Activity**: Reviews, check-ins, shares
- **Business Impact**: Venue partner growth
- **Revenue**: Premium subscriptions, commissions

### **Tracking Events**
- Venue views and interactions
- Search queries and results
- Event RSVPs and attendance
- Review submissions
- Social sharing activities

## 🔐 **Security & Privacy**

### **Data Protection**
- **GDPR Compliance**: User data rights
- **Location Privacy**: Opt-in GPS tracking
- **Photo Rights**: User-generated content policies
- **Age Verification**: 18+ content restrictions

### **Security Measures**
- **Authentication**: JWT tokens, refresh tokens
- **API Security**: Rate limiting, input validation
- **Data Encryption**: At rest and in transit
- **Privacy Controls**: Granular user settings

## 💰 **Monetization Strategy**

### **Revenue Streams**
1. **Venue Partnerships**: Commission on reservations
2. **Premium Features**: Advanced filters, early access
3. **Event Promotion**: Sponsored event listings
4. **Advertising**: Targeted venue promotions
5. **Data Insights**: Anonymous analytics for venues

### **Pricing Tiers**
- **Free**: Basic venue discovery and reviews
- **Premium** (€4.99/month): Advanced features, no ads
- **Business** (€29.99/month): Venue management tools

## 🚀 **Launch Strategy**

### **Beta Testing (Month 1)**
- **Closed Beta**: 100 local users
- **Venue Partners**: 20 key venues in Mannheim/Heidelberg
- **Feedback Collection**: In-app surveys, user interviews

### **Soft Launch (Month 2)**
- **Local Launch**: Mannheim & Heidelberg only
- **Influencer Partnerships**: Local food/nightlife bloggers
- **PR Campaign**: Local media coverage

### **Full Launch (Month 3)**
- **Regional Expansion**: Rhine-Neckar region
- **App Store Optimization**: Keywords, screenshots
- **Marketing Campaign**: Social media, events

## 📈 **Growth Roadmap**

### **Year 1 Goals**
- **10,000 app downloads**
- **500 verified venues**
- **50 venue partners**
- **€10,000 monthly revenue**

### **Year 2 Goals**
- **50,000 app downloads**
- **Expansion to Stuttgart, Frankfurt**
- **€50,000 monthly revenue**
- **Series A funding round**

## 🛠️ **Technical Implementation**

### **Immediate Next Steps**
1. Set up Neon database with Prisma
2. Create user authentication system
3. Build venue management API
4. Develop React Native mobile app
5. Implement core features (search, favorites, reviews)

### **Development Timeline**
- **Week 1-2**: Database setup and API development
- **Week 3-4**: Mobile app foundation and navigation
- **Week 5-6**: Core features implementation
- **Week 7-8**: UI/UX polish and testing
- **Week 9-10**: Beta testing and feedback
- **Week 11-12**: Launch preparation and marketing

This blueprint provides a comprehensive roadmap to transform Szene into a successful mobile app! 🚀
\`\`\`

Now let me create the database schema and setup:
