# 🚀 Portfolio Website - Senior Frontend Architecture

Modern, performant, and scalable portfolio website built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Performance Optimizations](#performance-optimizations)
- [Admin Dashboard](#admin-dashboard)
- [Development](#development)

## ✨ Features

### Performance
- ✅ Code splitting with dynamic imports
- ✅ Image optimization (Next.js Image)
- ✅ Bundle size optimization
- ✅ Lazy loading for below-the-fold content
- ✅ Scroll-based animations with Framer Motion

### Architecture
- ✅ Centralized API client with error handling
- ✅ Type-safe TypeScript implementation
- ✅ Reusable UI components (Design System)
- ✅ Error boundaries for graceful error handling
- ✅ Consistent folder structure

### Code Quality
- ✅ TypeScript strict mode
- ✅ ESLint configuration
- ✅ Prettier code formatting
- ✅ Comprehensive type definitions

### Scalability
- ✅ Design system with theme tokens
- ✅ Reusable UI components
- ✅ Centralized constants
- ✅ Utility functions library

### Developer Experience
- ✅ Hot module replacement
- ✅ TypeScript IntelliSense
- ✅ Organized project structure
- ✅ Comprehensive documentation

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Fonts:** Inter, JetBrains Mono (Google Fonts)

## 🏗 Architecture

### Folder Structure

```
portfolio-website/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── admin/            # Admin components
│   └── ui/               # Reusable UI components
├── lib/                  # Utilities and helpers
│   ├── api.ts           # API client
│   ├── auth.ts          # Authentication
│   ├── constants.ts     # App constants
│   ├── theme.ts         # Design tokens
│   └── utils.ts         # Utility functions
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── data/                 # JSON data files
```

### Key Architectural Decisions

1. **API Layer:** Centralized API client (`lib/api.ts`) for consistent error handling
2. **Type Safety:** Shared type definitions in `types/index.ts`
3. **Component Organization:** UI components separated from business logic
4. **Performance:** Dynamic imports for code splitting
5. **Error Handling:** Error boundaries at root level

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

Create `.env.local` file:

```env
ADMIN_PASSWORD=your-secure-password
ADMIN_TOKEN=your-secure-token
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 📁 Project Structure

### Components

- **Layout Components:** `Layout.tsx`, `ScrollProgress.tsx`
- **Section Components:** `HeroSection.tsx`, `Stats.tsx`, `Skills.tsx`, `Projects.tsx`, `Certifications.tsx`, `Contact.tsx`
- **UI Components:** `Button.tsx`, `Card.tsx`, `Input.tsx`, `Textarea.tsx`
- **Admin Components:** `CertificateManagement.tsx`, `ProjectManagement.tsx`

### API Routes

- `/api/certificates` - CRUD operations for certificates
- `/api/certificates/upload` - File upload endpoint
- `/api/projects` - CRUD operations for projects
- `/api/admin/login` - Admin authentication
- `/api/admin/verify` - Token verification

## ⚡ Performance Optimizations

1. **Code Splitting:** Dynamic imports for sections below the fold
2. **Image Optimization:** Next.js Image component with AVIF/WebP support
3. **Bundle Optimization:** Webpack code splitting for vendor libraries
4. **Lazy Loading:** Components load only when needed
5. **Scroll Animations:** Optimized with Framer Motion

## 🔒 Admin Dashboard

Access the admin dashboard at `/admin/login`

- Manage certificates
- Manage projects
- Upload images
- Full CRUD operations

See [ADMIN_README.md](./ADMIN_README.md) for detailed documentation.

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run type-check   # TypeScript type checking
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

### Code Quality

- **TypeScript:** Strict mode enabled
- **ESLint:** Next.js + TypeScript rules
- **Prettier:** Consistent code formatting

## 📝 Best Practices

1. **Type Safety:** Always use TypeScript types
2. **Error Handling:** Use error boundaries and try-catch
3. **Performance:** Lazy load heavy components
4. **Accessibility:** Proper ARIA labels and keyboard navigation
5. **SEO:** Meta tags, sitemap, robots.txt

## 🔄 Future Improvements

- [ ] Add unit tests (Jest + React Testing Library)
- [ ] Add E2E tests (Playwright)
- [ ] Implement caching strategy
- [ ] Add analytics
- [ ] Implement dark/light theme toggle
- [ ] Add i18n support

## 📄 License

Private project - All rights reserved

## 👤 Author

**Utku Göçer**
- Portfolio: [Your Portfolio URL]
- Email: [Your Email]
