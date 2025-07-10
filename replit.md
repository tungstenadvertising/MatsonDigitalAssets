# Digital Asset Library Application

## Overview

This is a full-stack web application for managing and distributing digital assets, specifically built for Matson Logistics. It's a corporate digital asset library that allows users to browse, preview, and download various logistics-related digital assets like door status indicators, temperature monitors, GPS trackers, and other operational graphics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom corporate branding
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple
- **Development**: Hot module replacement via Vite integration

### Database Schema
- **Users Table**: Basic user authentication with username/password
- **Digital Assets Table**: Stores metadata for downloadable assets including name, description, file format, dimensions, and categorization
- **Database Provider**: Neon Database (serverless PostgreSQL)

## Key Components

### Asset Management
- **Asset Card Component**: Displays individual digital assets with download functionality
- **Asset Categories**: Operational, monitoring, and logistics categories
- **Download System**: Individual asset downloads with mock file serving

### User Interface
- **Header**: Corporate branding with TUNGSTEN logo and user info
- **Footer**: Company information and copyright
- **Responsive Design**: Mobile-friendly layouts with Tailwind breakpoints
- **Toast Notifications**: User feedback for download operations

### Authentication System
- **User Schema**: Username and password-based authentication
- **Session Management**: Server-side sessions with PostgreSQL storage
- **Future-Ready**: Structured for easy addition of authentication middleware

## Data Flow

1. **Asset Retrieval**: Frontend queries `/api/digital-assets` endpoint
2. **Asset Display**: React components render asset cards with metadata
3. **Download Process**: Users click download buttons triggering API calls
4. **File Serving**: Mock file serving system returns placeholder responses
5. **User Feedback**: Toast notifications confirm successful operations

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL for production
- **Drizzle ORM**: Type-safe database operations
- **Migration System**: Drizzle Kit for schema management

### UI/UX Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library for UI elements
- **Embla Carousel**: Responsive carousel components

### Development Tools
- **Vite**: Fast build tool with HMR
- **ESBuild**: JavaScript bundler for production
- **PostCSS**: CSS processing with Autoprefixer

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Assets**: Static files served from build output

### Environment Configuration
- **Database URL**: Required environment variable for PostgreSQL connection
- **Development**: `npm run dev` starts both frontend and backend
- **Production**: `npm run build` followed by `npm start`

### Database Management
- **Schema Updates**: `npm run db:push` applies migrations
- **Connection**: Environment-based database URL configuration
- **Migrations**: Stored in `./migrations` directory

### Key Features
- **Corporate Branding**: Custom CSS variables for Matson Logistics colors
- **Complete Asset Library**: 6 digital asset groups with 3 versions each (18 total assets)
- **Real Image Assets**: All assets use actual provided images instead of placeholders
- **Asset Group Display**: AssetGroupCard component shows all three versions per asset
- **Individual Downloads**: Each asset version can be downloaded separately
- **Bulk Download**: Download all 18 assets at once
- **Responsive Design**: Mobile-first approach with corporate styling
- **Type Safety**: Full TypeScript implementation across frontend and backend
- **Development Experience**: Hot reload, error overlays, and development tooling

### Recent Changes (January 2025)
- **Complete Asset Integration**: Added all 18 real asset images across 6 categories
- **Asset Group System**: Implemented three-version display (Icon Only, With Text Transparent, With Text Solid)
- **Download Mapping**: Updated server routes to serve correct image files for each asset
- **UI Enhancement**: AssetGroupCard component displays actual asset previews
- **Asset Categories**: Door Status, Internal Temperature, GPS Location, Journey & Distance, Cargo Status, Motion Alert
- **Logo Enhancement**: Increased logo size by 40% (h-44) with proper header spacing (h-48)
- **Image Overlay Modal**: Added clickable thumbnails that display full-size asset previews with overlay
- **Download Verification**: Confirmed both individual and bulk download functionality working correctly