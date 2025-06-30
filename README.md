# 📚 Library Management System - Frontend

A modern, comprehensive library management system built with React, TypeScript, and Vite. This application provides both client and admin interfaces for managing books, users, borrowing, reservations, and more.

## 🚀 Features

### 👥 User Features

- **Authentication & Profile Management**

  - User registration and login
  - Profile management with avatar upload
  - Password reset with email verification
  - XP-based leveling system with badges

- **Book Discovery & Search**

  - Browse book catalog with filtering and sorting
  - Search by title, author, or ISBN
  - Advanced image-based search using AI
  - Category-based filtering
  - Rating and review system

- **Book Management**

  - Borrow books with automatic due date tracking
  - Reserve books when unavailable
  - Wishlist functionality
  - View borrowing history and status
  - Overdue notifications

- **Interactive Features**
  - Real-time chat forum for book discussions
  - Leaderboard based on reading activity
  - Book reviews and ratings
  - Notification system

### 🔧 Admin Features

- **Dashboard & Analytics**

  - Comprehensive statistics and charts
  - User activity monitoring
  - Book circulation analytics
  - Overdue tracking

- **Book Management**

  - Add, edit, and delete books
  - Manage book copies (book items)
  - Category/catalog management
  - Bulk operations

- **User Management**

  - User account administration
  - Role-based access control
  - Activity monitoring
  - Badge system management

- **Transaction Management**
  - Borrow/return processing
  - Reservation management
  - Fine calculation and tracking
  - Notification management

## 🛠️ Technology Stack

### Core Technologies

- **React 19.1.0** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite 6.3.5** - Fast build tool and dev server
- **TailwindCSS 4.1.10** - Utility-first CSS framework

### State Management & Data Fetching

- **@tanstack/react-query 5.80.7** - Server state management
- **React Context** - Global state management
- **Axios** - HTTP client with interceptors

### UI Components & Styling

- **Ant Design (antd) 5.26.1** - Component library
- **Lucide React** - Modern icon library
- **Framer Motion 12.18.1** - Animation library
- **React Toastify** - Toast notifications

### Real-time Features

- **@stomp/stompjs 7.1.1** - WebSocket messaging
- **sockjs-client 1.6.1** - WebSocket fallback

### Data Visualization

- **Recharts 2.15.3** - Chart library for analytics
- **React CountUp** - Animated counters

### Development Tools

- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **date-fns** - Date manipulation utilities

## 📁 Project Structure

```
src/
├── api/                    # API layer
│   ├── badge.api.ts       # Badge management API
│   ├── book.api.ts        # Book operations API
│   ├── bookitem.api.ts    # Book item management API
│   ├── borrow.api.ts      # Borrowing system API
│   ├── catalog.api.ts     # Category management API
│   ├── chatbot.api.ts     # AI chatbot integration
│   ├── message.api.ts     # Real-time messaging API
│   ├── notification.api.ts # Notification system API
│   ├── reservation.api.ts # Book reservation API
│   ├── review.api.ts      # Review and rating API
│   ├── user.api.ts        # User management API
│   └── wishlist.api.ts    # Wishlist functionality API
├── components/             # Reusable components
│   ├── Admin/             # Admin-specific components
│   │   ├── AddAndUpdateBookItemForm.tsx
│   │   ├── AdminConfirmModal.tsx
│   │   ├── AdminDeleteModal.tsx
│   │   ├── ConfirmModal.tsx
│   │   ├── Layout.tsx
│   │   └── Sidebar.tsx
│   ├── Client/            # Client-specific components
│   │   ├── BookCard.tsx
│   │   ├── BookCardSkeleton.tsx
│   │   ├── BookDetailedSkeleton.tsx
│   │   ├── ClientConfirmModal.tsx
│   │   ├── ClientDeleteModal.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProfileSkeleton.tsx
│   │   └── SearchFilterSkeleton.tsx
│   ├── ui/                # Generic UI components
│   │   └── LoadingSpinner.tsx
│   └── ScrollToTop.tsx
├── contexts/              # React contexts
│   ├── notificationContext.tsx
│   ├── userContext.ts
│   └── userContext.tsx
├── hooks/                 # Custom React hooks
│   ├── useBook.ts         # Book operations hook
│   ├── useBookItem.ts     # Book item management hook
│   ├── useBorrow.ts       # Borrowing operations hook
│   ├── useChat.ts         # Chat functionality hook
│   ├── useDashboard.ts    # Dashboard data hook
│   ├── useMessage.ts      # Messaging hook
│   └── useUser.ts         # User operations hook
├── pages/                 # Page components
│   ├── Admin/             # Admin pages
│   │   ├── BookItems.tsx
│   │   ├── Borrows.tsx
│   │   ├── Catalogs.tsx
│   │   ├── Login.tsx
│   │   ├── Reservations.tsx
│   │   ├── Users.tsx
│   │   ├── Badges/        # Badge management
│   │   ├── Books/         # Book management
│   │   ├── Dashboard/     # Analytics dashboard
│   │   ├── Notifications/ # Notification management
│   │   └── Reviews/       # Review management
│   └── Client/            # Client pages
│       ├── Auth.tsx
│       ├── BookCatalogue.tsx
│       ├── BookDetailed.tsx
│       ├── BorrowedBooks.tsx
│       ├── Chatbot.tsx
│       ├── ClientReservations.tsx
│       ├── Forum.tsx
│       ├── Profile.tsx
│       ├── Search.tsx
│       ├── Wishlist.tsx
│       ├── ClientNotifications/
│       ├── Homepage/
│       └── Leaderboard/
├── types/                 # TypeScript type definitions
│   ├── Badge.ts
│   ├── Book.ts
│   ├── BookItem.ts
│   ├── Borrow.ts
│   ├── Catalog.ts
│   ├── Notification.ts
│   ├── Reservation.ts
│   ├── Review.ts
│   └── User.ts
├── lib/                   # Utilities and configurations
│   └── axios.ts           # HTTP client configuration
├── data/                  # Mock data for development
│   └── mockData.ts
└── services/              # Business logic services
    └── auth.ts
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd quan-li-thu-vien-fe
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:

   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Build for production**

   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## 🎨 Key Features Implementation

### Authentication & Authorization

- **JWT-based Authentication**: Secure token-based authentication system
- **Role-based Access Control**: Separate admin and user interfaces
- **Password Reset**: Email-based password recovery system
- **Session Management**: Automatic token refresh and logout

### Book Management System

- **Comprehensive Catalog**: Complete book information with images
- **Inventory Tracking**: Real-time availability status
- **Category Management**: Dynamic book categorization
- **Search & Filter**: Advanced search with multiple criteria
- **Image-based Search**: AI-powered book search using cover images

### Borrowing & Reservation System

- **Smart Borrowing**: Automated due date calculation
- **Reservation Queue**: Book reservation when unavailable
- **Status Tracking**: Real-time borrowing status updates
- **Overdue Management**: Automatic overdue detection and notifications
- **Fine Calculation**: Automated fine computation for overdue items

### Gamification Elements

- **XP System**: Experience points for reading activities
- **Achievement Badges**: Unlockable badges for milestones
- **Leaderboards**: Competitive reading rankings
- **Progress Tracking**: Visual progress indicators

### Real-time Features

- **Live Chat**: WebSocket-based messaging system
- **Instant Notifications**: Real-time status updates
- **Active User Tracking**: Live user presence indicators
- **Dynamic Updates**: Real-time data synchronization

## 🔌 API Integration

### RESTful API Structure

The frontend communicates with a comprehensive REST API:

```
/auth/*                 # Authentication endpoints
├── /login             # User login
├── /register          # User registration
├── /logout            # User logout
├── /me                # Get current user profile
└── /reset-password    # Password reset

/books/*               # Book management
├── GET /books         # List books with pagination
├── POST /books        # Create new book
├── GET /books/{id}    # Get book details
├── PUT /books/{id}    # Update book
├── DELETE /books/{id} # Delete book
└── POST /books/similar # Image-based search

/users/*               # User management
├── GET /users         # List all users
├── GET /users/{id}    # Get user by ID
├── PUT /users/{id}    # Update user profile
└── GET /users/by-xp-desc # Users by XP ranking

/borrowed-books/*      # Borrowing system
├── GET /borrowed-books    # List all borrows
├── POST /borrowed-books   # Create new borrow
├── PUT /borrowed-books/{id} # Update borrow status
└── DELETE /borrowed-books/{id} # Cancel borrow

/reservations/*        # Reservation system
├── GET /reservations  # List all reservations
├── POST /reservations # Create reservation
├── PUT /reservations/{id} # Update reservation
└── DELETE /reservations/{id} # Cancel reservation

/reviews/*             # Review system
├── GET /reviews       # List reviews
├── POST /reviews      # Create review
├── GET /reviews/book/{id} # Get book reviews
└── DELETE /reviews    # Delete reviews

/wishlist/*            # Wishlist functionality
├── GET /wishlist/user/{id} # Get user wishlist
├── POST /wishlist/{userId}/{bookId} # Add to wishlist
└── DELETE /wishlist/{userId}/{bookId} # Remove from wishlist

/chat/*                # Messaging system
├── GET /chat/messages # Get messages
├── POST /chat/messages # Send message
└── GET /chat/active-users # Get active users

/badges/*              # Badge system
├── GET /badges        # List badges
├── POST /badges       # Create badge
├── GET /badges/user/{id} # Get user badges
└── PUT /badges/{id}   # Update badge
```

### WebSocket Integration

Real-time features powered by STOMP protocol:

- Live chat messaging
- Instant notifications
- Real-time status updates
- User presence tracking

## 🎯 User Experience Features

### Advanced Search & Discovery

- **Multi-criteria Search**: Title, author, ISBN, category filtering
- **AI-powered Image Search**: Upload book cover images to find similar books
- **Smart Filtering**: Availability, rating, category filters
- **Sorting Options**: Multiple sorting criteria (date, popularity, rating)
- **Pagination**: Efficient large dataset handling

### Responsive Design

- **Mobile-first Approach**: Optimized for all screen sizes
- **Dark Mode Support**: Complete dark/light theme switching
- **Accessibility Features**: ARIA labels, keyboard navigation
- **Modern UI**: Glassmorphism design elements
- **Smooth Animations**: Framer Motion powered transitions

### Performance Optimizations

- **Code Splitting**: React.lazy() for optimal loading
- **Image Optimization**: Lazy loading and optimized formats
- **State Management**: Efficient React Query caching
- **Bundle Optimization**: Vite's advanced bundling
- **Memoization**: Expensive computation optimization

## 🔧 Development Features

### TypeScript Integration

- **Strong Typing**: Complete type safety across the application
- **API Type Safety**: Strongly typed API responses
- **Component Props**: Type-safe component interfaces
- **Custom Hooks**: Typed custom hook implementations

### Code Quality

- **ESLint Configuration**: Comprehensive linting rules
- **TypeScript ESLint**: TypeScript-specific rules
- **Code Formatting**: Consistent code style
- **Import Organization**: Structured import statements

### Development Tools

- **Hot Reload**: Instant development feedback
- **Error Boundaries**: Graceful error handling
- **Development Mock Data**: Complete mock data for offline development
- **Environment Configuration**: Flexible environment management

## 🚀 Deployment

### Vercel Configuration

The application includes `vercel.json` for optimized deployment:

- **Build Optimization**: Optimized production builds
- **Environment Variables**: Secure configuration management
- **Edge Functions**: Global CDN distribution
- **Automatic Deployments**: Git-based deployment pipeline

### Build Process

```bash
# Development build
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with proper TypeScript types
4. Run linting and tests (`npm run lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Standards

- Follow TypeScript best practices
- Maintain component modularity
- Write descriptive commit messages
- Include proper error handling
- Add loading states for async operations

## 📄 License

This project is part of an educational library management system implementation.

## 🙏 Acknowledgments

- **React Ecosystem**: Built with modern React 19.1.0
- **UI Components**: Ant Design for consistent UI elements
- **Icons**: Lucide React for beautiful iconography
- **Charts**: Recharts for data visualization
- **Animations**: Framer Motion for smooth transitions
- **Date Handling**: date-fns for reliable date operations
