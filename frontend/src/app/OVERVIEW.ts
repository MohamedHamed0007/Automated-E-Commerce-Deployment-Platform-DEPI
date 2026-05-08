/**
 * ShipFast - Logistics Aggregator Platform
 * A modern, responsive SaaS dashboard for comparing shipping prices
 * 
 * DESIGN SPECIFICATIONS
 * ---------------------
 * Layout Width: 1440px desktop frame
 * Grid System: 12-column
 * Theme: Light mode
 * Primary Color: Blue gradient (#3b82f6 to #2563eb)
 * Accent Color: Teal (#14b8a6)
 * Typography: Inter font family
 * 
 * ARCHITECTURE
 * ------------
 * Framework: React + React Router
 * Styling: Tailwind CSS v4
 * Charts: Recharts
 * Icons: Lucide React
 * 
 * COMPONENT LIBRARY
 * -----------------
 * Core Components:
 * - Button (primary, secondary, ghost, danger, success variants)
 * - Input (with label, error, icon support)
 * - Card (with hover, padding options)
 * - Badge (default, success, warning, danger, info, fastest, cheapest, recommended)
 * - Select (dropdown with label and error)
 * - Textarea (multi-line input)
 * - Modal (with size options)
 * - StepProgress (multi-step form indicator)
 * - Tabs (tabbed navigation)
 * - Drawer (side panel)
 * - Alert (info, success, warning, error)
 * 
 * Layout Components:
 * - Layout (main app wrapper with sidebar and top nav)
 * - Sidebar (left navigation with links)
 * - TopNav (top bar with search, notifications, profile)
 * - Breadcrumb (page navigation trail)
 * 
 * PAGES
 * -----
 * Authentication:
 * ✓ /login - Split layout with illustration
 * ✓ /signup - User registration
 * ✓ /forgot-password - Password reset flow
 * 
 * Dashboard & Overview:
 * ✓ /dashboard - Main overview with stats, charts, recent shipments
 * 
 * Shipment Flow:
 * ✓ /shipment/new - Multi-step shipment creation (4 steps)
 *   - Step 1: Package details (type, weight, dimensions)
 *   - Step 2: Sender & receiver addresses
 *   - Step 3: AI image scan upload (optional)
 *   - Step 4: Confirmation review
 * 
 * ✓ /compare - Courier comparison table
 *   - Price comparison with badges (fastest, cheapest, recommended)
 *   - Courier logos, ratings, delivery times
 *   - Feature highlights
 *   - Interactive selection
 * 
 * Payment:
 * ✓ /payment - Payment method selection
 *   - Wallet balance option
 *   - Credit card options
 *   - Add new card form
 *   - Order summary sidebar
 * ✓ /payment/success - Success confirmation
 * 
 * Tracking:
 * ✓ /tracking - Real-time shipment tracking
 *   - Search by tracking number
 *   - Timeline with status updates
 *   - Progress indicator
 *   - Map placeholder
 *   - Courier details
 * 
 * User Account:
 * ✓ /profile - User profile settings
 *   - Personal information
 *   - Default addresses
 *   - Notification preferences
 * ✓ /history - Shipment history table
 *   - Filterable shipment list
 *   - Export functionality
 *   - Statistics overview
 * ✓ /wallet - Wallet management
 *   - Balance display
 *   - Quick top-up options
 *   - Transaction history
 *   - Auto top-up settings
 * ✓ /subscription - Plan comparison & upgrade
 *   - Free, Pro, Enterprise tiers
 *   - Feature comparison
 *   - Current plan indicator
 * ✓ /billing - Invoice & billing history
 *   - Payment method management
 *   - Invoice downloads
 *   - Spending analytics
 * 
 * Settings & Support:
 * ✓ /settings - Account settings
 *   - Notification preferences
 *   - Security (password, 2FA)
 *   - Payment methods
 *   - Regional preferences
 *   - Danger zone (account deletion)
 * ✓ /help - Help center
 *   - FAQ sections
 *   - Live chat widget
 *   - Contact options
 *   - Support ticket form
 * 
 * Error Pages:
 * ✓ /404 - Not found page
 * 
 * FEATURES
 * --------
 * ✓ Responsive design (optimized for 1440px desktop)
 * ✓ Smooth animations and transitions
 * ✓ Interactive hover states
 * ✓ Loading states
 * ✓ Error states
 * ✓ Empty states
 * ✓ Form validation
 * ✓ Real-time search
 * ✓ Notification system
 * ✓ Profile dropdown
 * ✓ Breadcrumb navigation
 * ✓ Data visualization (charts)
 * ✓ Progress indicators
 * ✓ Badge system for highlighting
 * ✓ Modal dialogs
 * ✓ Tabbed interfaces
 * ✓ Collapsible sections
 * 
 * UX PRINCIPLES
 * -------------
 * ✓ Clear visual hierarchy
 * ✓ Consistent spacing and alignment
 * ✓ Strong contrast for CTAs
 * ✓ Reduced cognitive load
 * ✓ Intuitive navigation
 * ✓ Progressive disclosure
 * ✓ Helpful feedback messages
 * ✓ Secure payment experience
 * ✓ Trust indicators (badges, reviews, guarantees)
 * 
 * INTERACTION STATES
 * ------------------
 * ✓ Hover - Visual feedback on interactive elements
 * ✓ Active - State for selected items
 * ✓ Focus - Keyboard navigation support
 * ✓ Loading - Spinner animations during async operations
 * ✓ Disabled - Visual indicator for unavailable actions
 * ✓ Success - Confirmation states
 * ✓ Error - Error messaging and validation
 * ✓ Empty - Placeholder content for empty states
 */

export {};
