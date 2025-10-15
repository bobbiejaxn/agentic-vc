# Task: Routing and Navigation Updates Implementation

## 1. Strategic Analysis & Solution Options

### 1.1 Problem Definition

**Current State**: The VC Portfolio OS has basic React Router setup with simple navigation, but as the application grows with new features (enhanced dashboard, company profiles, network intelligence, AI chat, market research), the current routing structure is becoming inadequate. Navigation lacks context awareness, searchability, and the user experience is not optimized for the complex, multi-feature application.

**Desired State**: Implement a sophisticated routing and navigation system that provides intuitive access to all features, context-aware navigation, search functionality, breadcrumbs, and a seamless user experience that scales with the growing application complexity.

### 1.2 Solution Options Analysis

#### Option 1: Enhanced React Router with Basic Navigation

**Approach**: Enhance the existing React Router setup with better route organization, nested routes, and improved navigation components.

**Pros**:

- Minimal changes to existing architecture
- Lower implementation complexity
- Familiar technology stack
- Faster implementation time
- Lower maintenance overhead

**Cons**:

- Limited advanced features
- No intelligent navigation
- Basic breadcrumb support
- Limited search integration
- No context awareness

**Technical Requirements**:

- React Router v6 with nested routes
- Enhanced navigation components
- Basic breadcrumb implementation
- Route-based code splitting
- Simple navigation state management

#### Option 2: Advanced Routing with State Management and Search

**Approach**: Implement a comprehensive routing system with integrated state management, intelligent navigation suggestions, search functionality, and advanced user experience features.

**Pros**:

- Intelligent navigation suggestions
- Integrated search functionality
- Context-aware routing
- Advanced breadcrumb system
- Better user experience

**Cons**:

- Higher implementation complexity
- More state management overhead
- Longer development time
- Higher maintenance requirements
- More complex testing

**Technical Requirements**:

- React Router v6 with advanced configuration
- State management integration (Zustand/Redux)
- Search functionality and indexing
- Advanced breadcrumb system
- Navigation analytics and tracking

#### Option 3: Comprehensive Navigation Ecosystem with AI-Enhanced Features (RECOMMENDED)

**Approach**: Create a sophisticated navigation ecosystem that combines advanced routing, intelligent search, AI-powered navigation suggestions, user behavior tracking, and personalized navigation experiences.

**Pros**:

- AI-powered navigation suggestions
- Personalized user experience
- Advanced search and discovery
- Comprehensive navigation analytics
- Future-proof and scalable

**Cons**:

- Highest implementation complexity
- Significant development effort
- Advanced AI integration required
- Higher maintenance overhead
- Complex testing requirements

**Technical Requirements**:

- React Router v6 with advanced configuration
- AI-powered search and recommendations
- User behavior tracking and analysis
- Personalized navigation experiences
- Advanced state management and caching

### 1.3 Recommended Solution

**Selected Approach**: Option 3 - Comprehensive Navigation Ecosystem with AI-Enhanced Features

**Rationale**:

- Provides the best user experience for a complex application
- Scales with growing feature set and user base
- Creates competitive differentiation through AI-enhanced navigation
- Supports advanced use cases like cross-feature workflows
- Future-proof architecture for continued growth

**Implementation Strategy**:

- Start with enhanced React Router foundation
- Add intelligent search and discovery features
- Implement AI-powered navigation suggestions
- Add user behavior tracking and personalization
- Create comprehensive navigation analytics

## 2. Project Analysis & Current State

### 2.1 Current Application State

#### Existing Routing Analysis

```typescript
// Current App.tsx routing structure
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/documents" element={<DocumentManagement />} />
        <Route path="/fund/:fundId" element={<FundDashboard />} />
        <Route path="/company/:companyId" element={<CompanyProfilePage />} />
        <Route path="/companies" element={<CompanyListPage />} />
        <Route path="/network" element={<NetworkIntelligencePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:conversationId" element={<ChatPage />} />
        <Route path="/market-research" element={<MarketResearchPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

#### Current Navigation Components

```typescript
// Current navigation structure (simplified)
const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Companies", href: "/companies" },
  { name: "Network", href: "/network" },
  { name: "AI Assistant", href: "/chat" },
  { name: "Market Research", href: "/market-research" },
  { name: "Documents", href: "/documents" },
];
```

#### Current Navigation Issues

- **Flat Structure**: No hierarchical organization of routes
- **No Context Awareness**: Navigation doesn't adapt to user context
- **Limited Search**: No global search functionality
- **No Breadcrumbs**: Users can't track their navigation path
- **No Personalization**: Same navigation for all users
- **No Analytics**: No tracking of navigation patterns

### 2.2 Technical Requirements Analysis

#### Required Navigation Features

1. **Hierarchical Navigation**
   - Multi-level navigation structure
   - Collapsible menu sections
   - Context-aware menu expansion
   - Quick access to frequently used features

2. **Intelligent Search**
   - Global search across all features
   - AI-powered search suggestions
   - Recent searches and favorites
   - Search result categorization

3. **Advanced Breadcrumbs**
   - Dynamic breadcrumb generation
   - Interactive breadcrumb navigation
   - Context-aware breadcrumb shortcuts
   - Search integration in breadcrumbs

4. **User Personalization**
   - Personalized navigation suggestions
   - Favorite routes and quick access
   - User behavior-based optimization
   - Role-based navigation customization

5. **Navigation Analytics**
   - User navigation pattern tracking
   - Feature usage analytics
   - Navigation optimization insights
   - User journey analysis

#### Required Technical Components

- **Advanced Router Configuration**: Nested routes, lazy loading, route guards
- **State Management**: Navigation state, user preferences, search state
- **Search Engine**: Feature indexing, search algorithms, result ranking
- **AI Integration**: Navigation suggestions, personalization engine
- **Analytics System**: User tracking, pattern analysis, optimization

### 2.3 Dependencies and Prerequisites

#### Existing Dependencies (from package.json)

```json
{
  "dependencies": {
    "react-router-dom": "^7.9.3",
    "react": "^19.0.0",
    "convex": "^1.24.2"
  }
}
```

#### Additional Dependencies Needed

```json
{
  "dependencies": {
    "@tanstack/react-router": "^1.45.0",
    "fuse.js": "^7.0.0",
    "zustand": "^4.4.7",
    "react-hotkeys-hook": "^4.4.1",
    "react-spring": "^9.7.3",
    "framer-motion": "^10.16.4",
    "react-intersection-observer": "^9.5.2",
    "react-virtualized": "^9.22.5"
  }
}
```

## 3. Technical Requirements & Specifications

### 3.1 Functional Requirements

#### Core Features

1. **Hierarchical Navigation Structure**
   - Multi-level menu with categories and subcategories
   - Collapsible sections with smart expansion
   - Context-aware menu highlighting
   - Keyboard navigation support
   - Mobile-optimized navigation drawer

2. **Intelligent Search System**
   - Global search bar with instant results
   - AI-powered search suggestions
   - Feature and content search across all modules
   - Recent searches and search history
   - Advanced filtering and sorting

3. **Advanced Breadcrumb System**
   - Dynamic breadcrumb generation from route hierarchy
   - Interactive breadcrumb with dropdown shortcuts
   - Smart breadcrumb truncation for deep navigation
   - Search integration in breadcrumb path
   - Quick navigation to parent levels

4. **User Personalization Engine**
   - Learning algorithm for navigation preferences
   - Personalized quick access and favorites
   - Adaptive menu ordering based on usage
   - Role-based navigation customization
   - User behavior tracking and analysis

5. **Navigation Analytics Dashboard**
   - User navigation pattern visualization
   - Feature usage analytics and insights
   - Navigation optimization recommendations
   - A/B testing framework for navigation improvements
   - User journey mapping and analysis

#### Advanced Features

1. **AI-Powered Navigation Assistant**
   - Intelligent next-step suggestions
   - Context-aware feature recommendations
   - Workflow-based navigation guidance
   - Personalized learning path suggestions
   - Proactive navigation optimization

2. **Cross-Feature Workflows**
   - Seamless transitions between related features
   - Smart context preservation across routes
   - Workflow-based navigation paths
   - Multi-step process guidance
   - Contextual quick actions

3. **Accessibility and Performance**
   - Full WCAG 2.1 AA compliance
   - Keyboard navigation and screen reader support
   - Route-based code splitting for performance
   - Preloading of likely next routes
   - Offline navigation capability

### 3.2 Data Model Requirements

#### Navigation Schema Extensions

```typescript
// Navigation structure definition
interface NavigationNode {
  id: string;
  label: string;
  path: string;
  icon?: string;
  children?: NavigationNode[];
  parentId?: string;
  level: number;
  category: NavigationCategory;
  permissions?: string[];
  metadata: {
    description?: string;
    keywords?: string[];
    tags?: string[];
    priority?: number;
    requiresAuth?: boolean;
  };
  analytics: {
    visitCount: number;
    lastVisited?: number;
    averageTimeOnPage?: number;
    bounceRate?: number;
  };
}

// User navigation preferences
interface UserNavigationPreferences {
  userId: string;
  favoriteRoutes: string[];
  recentlyVisited: RecentVisit[];
  searchHistory: SearchQuery[];
  menuOrder: string[];
  collapsedSections: string[];
  customShortcuts: NavigationShortcut[];
  adaptiveSettings: {
    enablePersonalization: boolean;
    learningRate: number;
    suggestionFrequency: string;
    autoExpandSections: string[];
  };
}

// Navigation analytics data
interface NavigationAnalytics {
  userId: string;
  sessionId: string;
  route: string;
  timestamp: number;
  duration?: number;
  referrer?: string;
  userAgent?: string;
  context: {
    searchQuery?: string;
    breadcrumbPath?: string[];
    previousRoute?: string;
  };
  interactions: {
    type: string;
    element: string;
    timestamp: number;
  }[];
}

// Search index for navigation
interface SearchIndex {
  id: string;
  type: "route" | "feature" | "content" | "company" | "document";
  title: string;
  description?: string;
  content?: string;
  url: string;
  keywords: string[];
  category: string;
  priority: number;
  lastIndexed: number;
  accessLevel: string;
  metadata: Record<string, any>;
}

// User navigation patterns
interface NavigationPattern {
  userId: string;
  pattern: string[];
  frequency: number;
  avgDuration: number;
  successRate: number;
  lastUsed: number;
  context: {
    timeOfDay: number;
    dayOfWeek: number;
    sessionDuration: number;
  };
}
```

#### Navigation State Management

```typescript
// Navigation store using Zustand
interface NavigationStore {
  // Current navigation state
  currentRoute: string;
  breadcrumbs: Breadcrumb[];
  navigationHistory: NavigationEntry[];
  isMenuOpen: boolean;
  activeCategory?: string;

  // Search state
  searchQuery: string;
  searchResults: SearchResult[];
  isSearching: boolean;
  searchHistory: SearchQuery[];

  // User preferences
  favorites: string[];
  recentlyVisited: RecentVisit[];
  customShortcuts: NavigationShortcut[];

  // Analytics
  navigationPatterns: NavigationPattern[];
  featureUsage: Record<string, number>;

  // Actions
  navigate: (path: string, options?: NavigationOptions) => void;
  goBack: () => void;
  goForward: () => void;
  setSearchQuery: (query: string) => void;
  performSearch: (query: string) => Promise<SearchResult[]>;
  addToFavorites: (route: string) => void;
  removeFromFavorites: (route: string) => void;
  toggleMenu: () => void;
  setActiveCategory: (category: string) => void;
  recordNavigation: (data: NavigationData) => void;
  updateAnalytics: (data: AnalyticsData) => void;
}
```

### 3.3 API Specifications

#### Required Navigation Functions

```typescript
// Navigation routing functions
export const getNavigationStructure = query({
  args: {
    userId: v.optional(v.id("users")),
    role: v.optional(v.string()),
    depth: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Get navigation structure based on user role and permissions
    // Include user-specific customizations
    // Return hierarchical navigation tree
  },
});

export const searchNavigation = query({
  args: {
    query: v.string(),
    userId: v.id("users"),
    filters: v.optional(
      v.object({
        type: v.optional(v.array(v.string())),
        category: v.optional(v.string()),
        dateRange: v.optional(
          v.object({
            start: v.number(),
            end: v.number(),
          })
        ),
      })
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Search across navigation index
    // Apply personalization and relevance scoring
    // Return categorized search results
  },
});

export const getNavigationSuggestions = query({
  args: {
    userId: v.id("users"),
    currentRoute: v.string(),
    context: v.optional(v.record(v.string(), v.any())),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Generate AI-powered navigation suggestions
    // Consider user patterns and current context
    // Return personalized next-step recommendations
  },
});

// User preference management
export const getUserNavigationPreferences = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Get user's navigation preferences and settings
    // Include favorites, history, customizations
    // Return complete preference profile
  },
});

export const updateUserNavigationPreferences = mutation({
  args: {
    userId: v.id("users"),
    preferences: v.object({
      favoriteRoutes: v.optional(v.array(v.string())),
      menuOrder: v.optional(v.array(v.string())),
      collapsedSections: v.optional(v.array(v.string())),
      customShortcuts: v.optional(v.array(v.any())),
      adaptiveSettings: v.optional(v.any()),
    }),
  },
  handler: async (ctx, args) => {
    // Update user navigation preferences
    // Validate changes and apply defaults
    // Return updated preferences
  },
});

// Analytics and tracking
export const recordNavigationEvent = mutation({
  args: {
    userId: v.id("users"),
    event: v.object({
      type: v.string(),
      route: v.string(),
      timestamp: v.number(),
      context: v.optional(v.record(v.string(), v.any())),
      metadata: v.optional(v.record(v.string(), v.any())),
    }),
  },
  handler: async (ctx, args) => {
    // Record navigation event for analytics
    // Update user patterns and preferences
    // Trigger AI learning if applicable
  },
});

export const getNavigationAnalytics = query({
  args: {
    userId: v.id("users"),
    timeframe: v.optional(v.string()),
    metrics: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // Get navigation analytics for user
    // Include patterns, usage, and insights
    // Return analytics data and recommendations
  },
});

// Search and discovery
export const buildSearchIndex = action({
  args: {
    fullRebuild: v.optional(v.boolean()),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    // Build or update search index
    // Index all navigation content and features
    // Update AI models for recommendations
  },
});

export const updateSearchIndex = mutation({
  args: {
    items: v.array(
      v.object({
        id: v.string(),
        type: v.string(),
        title: v.string(),
        content: v.optional(v.string()),
        url: v.string(),
        keywords: v.array(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Update search index with new or modified items
    // Remove outdated items
    // Reindex if necessary
  },
});
```

## 4. Implementation Plan

### 4.1 Phase 1: Enhanced Router Foundation (Week 1-2)

#### 4.1.1 File Structure Setup

```
src/
├── router/
│   ├── index.tsx
│   ├── routes.tsx
│   ├── routeComponents.tsx
│   ├── routeGuards.tsx
│   └── lazyLoading.tsx
├── components/
│   ├── navigation/
│   │   ├── NavigationProvider.tsx
│   │   ├── NavigationSidebar.tsx
│   │   ├── NavigationHeader.tsx
│   │   ├── BreadcrumbTrail.tsx
│   │   └── MobileNavigation.tsx
│   ├── search/
│   │   ├── GlobalSearch.tsx
│   │   ├── SearchResults.tsx
│   │   ├── SearchSuggestions.tsx
│   │   └── RecentSearches.tsx
│   └── breadcrumbs/
│       ├── BreadcrumbNav.tsx
│       ├── BreadcrumbItem.tsx
│       └── BreadcrumbDropdown.tsx
├── stores/
│   ├── navigationStore.ts
│   ├── searchStore.ts
│   └── analyticsStore.ts
├── services/
│   ├── navigationService.ts
│   ├── searchService.ts
│   ├── analyticsService.ts
│   └── personalizationService.ts
├── hooks/
│   ├── useNavigation.ts
│   ├── useSearch.ts
│   ├── useBreadcrumbs.ts
│   └── useNavigationAnalytics.ts
├── utils/
│   ├── routeUtils.ts
│   ├── searchUtils.ts
│   ├── navigationUtils.ts
│   └── analyticsUtils.ts
└── types/
    ├── navigation.ts
    ├── search.ts
    ├── breadcrumbs.ts
    └── analytics.ts
```

#### 4.1.2 Enhanced Router Configuration

```typescript
// src/router/index.tsx
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { NavigationProvider } from "@/components/navigation/NavigationProvider";
import { routeComponents } from "./routeComponents";
import { routeGuards } from "./routeGuards";
import { lazyLoading } from "./lazyLoading";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/",
    element: <NavigationProvider />,
    children: [
      {
        path: "dashboard",
        element: lazyLoading(() => import("@/pages/OverviewPage")),
        loader: routeGuards.authRequired,
        meta: {
          title: "Dashboard",
          category: "portfolio",
          icon: "LayoutDashboard",
          keywords: ["overview", "portfolio", "summary"],
          priority: 1
        }
      },
      {
        path: "companies",
        children: [
          {
            index: true,
            element: lazyLoading(() => import("@/pages/CompanyListPage")),
            meta: {
              title: "Companies",
              category: "portfolio",
              icon: "Building2",
              keywords: ["companies", "portfolio", "investments"],
              priority: 2
            }
          },
          {
            path: ":companyId",
            element: lazyLoading(() => import("@/pages/CompanyProfilePage")),
            loader: routeGuards.companyAccess,
            meta: {
              title: "Company Profile",
              category: "portfolio",
              icon: "Building2",
              parent: "/companies",
              keywords: ["company", "profile", "details"],
              priority: 2
            }
          }
        ]
      },
      {
        path: "network",
        element: lazyLoading(() => import("@/pages/NetworkIntelligencePage")),
        meta: {
          title: "Network Intelligence",
          category: "analytics",
          icon: "Network",
          keywords: ["network", "relationships", "connections"],
          priority: 3
        }
      },
      {
        path: "market-research",
        children: [
          {
            index: true,
            element: lazyLoading(() => import("@/pages/MarketResearchPage")),
            meta: {
              title: "Market Research",
              category: "research",
              icon: "TrendingUp",
              keywords: ["market", "research", "analysis"],
              priority: 4
            }
          },
          {
            path: "competitive-intel",
            element: lazyLoading(() => import("@/pages/CompetitiveIntelligencePage")),
            meta: {
              title: "Competitive Intelligence",
              category: "research",
              icon: "Target",
              parent: "/market-research",
              keywords: ["competitive", "intelligence", "competitors"],
              priority: 4
            }
          },
          {
            path: "benchmarks",
            element: lazyLoading(() => import("@/pages/BenchmarksPage")),
            meta: {
              title: "Industry Benchmarks",
              category: "research",
              icon: "BarChart",
              parent: "/market-research",
              keywords: ["benchmarks", "industry", "comparison"],
              priority: 4
            }
          }
        ]
      },
      {
        path: "chat",
        children: [
          {
            index: true,
            element: lazyLoading(() => import("@/pages/ChatPage")),
            meta: {
              title: "AI Assistant",
              category: "ai",
              icon: "MessageSquare",
              keywords: ["chat", "ai", "assistant", "help"],
              priority: 5
            }
          },
          {
            path: ":conversationId",
            element: lazyLoading(() => import("@/pages/ChatPage")),
            meta: {
              title: "AI Chat",
              category: "ai",
              icon: "MessageSquare",
              parent: "/chat",
              keywords: ["chat", "conversation", "ai"],
              priority: 5
            }
          }
        ]
      },
      {
        path: "documents",
        element: lazyLoading(() => import("@/pages/DocumentManagement")),
        meta: {
          title: "Documents",
          category: "resources",
          icon: "FileText",
          keywords: ["documents", "files", "uploads"],
          priority: 6
        }
      },
      {
        path: "analytics",
        element: lazyLoading(() => import("@/pages/AnalyticsPage")),
        meta: {
          title: "Analytics",
          category: "analytics",
          icon: "PieChart",
          keywords: ["analytics", "reports", "insights"],
          priority: 7
        }
      },
      {
        path: "settings",
        children: [
          {
            index: true,
            element: lazyLoading(() => import("@/pages/SettingsPage")),
            meta: {
              title: "Settings",
              category: "system",
              icon: "Settings",
              keywords: ["settings", "preferences", "configuration"],
              priority: 8
            }
          },
          {
            path: "navigation",
            element: lazyLoading(() => import("@/pages/NavigationSettingsPage")),
            meta: {
              title: "Navigation Settings",
              category: "system",
              icon: "Navigation",
              parent: "/settings",
              keywords: ["navigation", "menu", "preferences"],
              priority: 8
            }
          }
        ]
      }
    ]
  },
  {
    path: "/auth",
    children: [
      {
        path: "login",
        element: lazyLoading(() => import("@/pages/LoginPage")),
        meta: {
          title: "Login",
          category: "auth",
          public: true
        }
      }
    ]
  },
  {
    path: "*",
    element: lazyLoading(() => import("@/pages/NotFoundPage")),
    meta: {
      title: "Page Not Found",
      category: "system",
      public: true
    }
  }
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

// src/router/routeComponents.tsx
export const routeComponents = {
  // Lazy loading wrapper for better performance
  OverviewPage: lazy(() => import("@/pages/OverviewPage")),
  CompanyListPage: lazy(() => import("@/pages/CompanyListPage")),
  CompanyProfilePage: lazy(() => import("@/pages/CompanyProfilePage")),
  NetworkIntelligencePage: lazy(() => import("@/pages/NetworkIntelligencePage")),
  MarketResearchPage: lazy(() => import("@/pages/MarketResearchPage")),
  CompetitiveIntelligencePage: lazy(() => import("@/pages/CompetitiveIntelligencePage")),
  BenchmarksPage: lazy(() => import("@/pages/BenchmarksPage")),
  ChatPage: lazy(() => import("@/pages/ChatPage")),
  DocumentManagement: lazy(() => import("@/pages/DocumentManagement")),
  AnalyticsPage: lazy(() => import("@/pages/AnalyticsPage")),
  SettingsPage: lazy(() => import("@/pages/SettingsPage")),
  NavigationSettingsPage: lazy(() => import("@/pages/NavigationSettingsPage")),
};

// src/router/routeGuards.tsx
import { redirect } from "react-router-dom";
import { getAuthUserId } from "@convex-dev/auth/server";

export const routeGuards = {
  authRequired: async () => {
    const userId = await getAuthUserId();
    if (!userId) {
      return redirect("/auth/login");
    }
    return null;
  },

  companyAccess: async ({ params }) => {
    const userId = await getAuthUserId();
    if (!userId) {
      return redirect("/auth/login");
    }

    // Check if user has access to this company
    const hasAccess = await checkCompanyAccess(userId, params.companyId);
    if (!hasAccess) {
      return redirect("/companies");
    }

    return null;
  },

  adminRequired: async () => {
    const userId = await getAuthUserId();
    if (!userId) {
      return redirect("/auth/login");
    }

    const isAdmin = await checkAdminRole(userId);
    if (!isAdmin) {
      return redirect("/dashboard");
    }

    return null;
  }
};

async function checkCompanyAccess(userId: string, companyId: string): Promise<boolean> {
  // Implement company access check logic
  return true; // Placeholder
}

async function checkAdminRole(userId: string): Promise<boolean> {
  // Implement admin role check logic
  return false; // Placeholder
}
```

#### 4.1.3 Navigation Store Implementation

```typescript
// src/stores/navigationStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface NavigationState {
  // Current state
  currentRoute: string;
  previousRoute: string | null;
  navigationHistory: NavigationEntry[];
  historyIndex: number;
  isMenuOpen: boolean;
  activeCategory: string | null;

  // Breadcrumbs
  breadcrumbs: Breadcrumb[];

  // Search
  searchQuery: string;
  searchResults: SearchResult[];
  isSearching: boolean;
  searchHistory: SearchQuery[];

  // User preferences
  favorites: string[];
  recentlyVisited: RecentVisit[];
  customShortcuts: NavigationShortcut[];
  collapsedSections: string[];

  // Analytics
  sessionStart: number;
  navigationPatterns: NavigationPattern[];
  featureUsage: Record<string, number>;

  // Actions
  navigate: (path: string, options?: NavigationOptions) => void;
  goBack: () => void;
  goForward: () => void;
  setActiveCategory: (category: string | null) => void;
  toggleMenu: () => void;
  setSearchQuery: (query: string) => void;
  performSearch: (query: string) => Promise<void>;
  addToFavorites: (route: string) => void;
  removeFromFavorites: (route: string) => void;
  addToHistory: (entry: NavigationEntry) => void;
  updateBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
  recordNavigationEvent: (event: NavigationEvent) => void;
  updateFeatureUsage: (feature: string) => void;
  clearHistory: () => void;
  reset: () => void;
}

export const useNavigationStore = create<NavigationState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        currentRoute: "/",
        previousRoute: null,
        navigationHistory: [],
        historyIndex: -1,
        isMenuOpen: false,
        activeCategory: null,
        breadcrumbs: [],
        searchQuery: "",
        searchResults: [],
        isSearching: false,
        searchHistory: [],
        favorites: [],
        recentlyVisited: [],
        customShortcuts: [],
        collapsedSections: [],
        sessionStart: Date.now(),
        navigationPatterns: [],
        featureUsage: {},

        // Navigation actions
        navigate: (path: string, options: NavigationOptions = {}) => {
          set((state) => {
            const previousRoute = state.currentRoute;

            // Update history
            if (options.replaceState) {
              state.navigationHistory[state.historyIndex] = {
                path,
                timestamp: Date.now(),
                title: options.title || "",
                metadata: options.metadata || {},
              };
            } else {
              // Remove any forward history entries
              state.navigationHistory = state.navigationHistory.slice(
                0,
                state.historyIndex + 1
              );
              state.navigationHistory.push({
                path,
                timestamp: Date.now(),
                title: options.title || "",
                metadata: options.metadata || {},
              });
              state.historyIndex = state.navigationHistory.length - 1;
            }

            // Update current route
            state.previousRoute = previousRoute;
            state.currentRoute = path;

            // Update recently visited
            const existingIndex = state.recentlyVisited.findIndex(
              (visit) => visit.path === path
            );
            if (existingIndex > -1) {
              state.recentlyVisited.splice(existingIndex, 1);
            }
            state.recentlyVisited.unshift({
              path,
              title: options.title || "",
              timestamp: Date.now(),
            });
            state.recentlyVisited = state.recentlyVisited.slice(0, 20); // Keep last 20

            // Record navigation event
            recordNavigationEvent({
              type: "navigation",
              route: path,
              fromRoute: previousRoute,
              timestamp: Date.now(),
              options,
            });
          });
        },

        goBack: () => {
          set((state) => {
            if (state.historyIndex > 0) {
              state.historyIndex -= 1;
              const entry = state.navigationHistory[state.historyIndex];
              state.currentRoute = entry.path;
              state.previousRoute = entry.path;
            }
          });
        },

        goForward: () => {
          set((state) => {
            if (state.historyIndex < state.navigationHistory.length - 1) {
              state.historyIndex += 1;
              const entry = state.navigationHistory[state.historyIndex];
              state.currentRoute = entry.path;
              state.previousRoute = entry.path;
            }
          });
        },

        setActiveCategory: (category: string | null) => {
          set((state) => {
            state.activeCategory = category;
          });
        },

        toggleMenu: () => {
          set((state) => {
            state.isMenuOpen = !state.isMenuOpen;
          });
        },

        // Search actions
        setSearchQuery: (query: string) => {
          set((state) => {
            state.searchQuery = query;
          });
        },

        performSearch: async (query: string) => {
          set((state) => {
            state.isSearching = true;
            state.searchQuery = query;
          });

          try {
            const results = await searchNavigationItems(query);
            set((state) => {
              state.searchResults = results;
              state.isSearching = false;

              // Add to search history
              const historyEntry: SearchQuery = {
                query,
                timestamp: Date.now(),
                resultsCount: results.length,
              };

              const existingIndex = state.searchHistory.findIndex(
                (entry) => entry.query.toLowerCase() === query.toLowerCase()
              );

              if (existingIndex > -1) {
                state.searchHistory.splice(existingIndex, 1);
              }

              state.searchHistory.unshift(historyEntry);
              state.searchHistory = state.searchHistory.slice(0, 50); // Keep last 50
            });
          } catch (error) {
            set((state) => {
              state.isSearching = false;
              state.searchResults = [];
            });
          }
        },

        // Favorites actions
        addToFavorites: (route: string) => {
          set((state) => {
            if (!state.favorites.includes(route)) {
              state.favorites.push(route);
            }
          });
        },

        removeFromFavorites: (route: string) => {
          set((state) => {
            state.favorites = state.favorites.filter((fav) => fav !== route);
          });
        },

        // History actions
        addToHistory: (entry: NavigationEntry) => {
          set((state) => {
            state.navigationHistory.push(entry);
            state.historyIndex = state.navigationHistory.length - 1;
          });
        },

        updateBreadcrumbs: (breadcrumbs: Breadcrumb[]) => {
          set((state) => {
            state.breadcrumbs = breadcrumbs;
          });
        },

        // Analytics actions
        recordNavigationEvent: (event: NavigationEvent) => {
          // This would typically send analytics to a service
          console.log("Navigation event:", event);

          set((state) => {
            // Update feature usage
            if (event.route) {
              state.featureUsage[event.route] =
                (state.featureUsage[event.route] || 0) + 1;
            }
          });
        },

        updateFeatureUsage: (feature: string) => {
          set((state) => {
            state.featureUsage[feature] =
              (state.featureUsage[feature] || 0) + 1;
          });
        },

        clearHistory: () => {
          set((state) => {
            state.navigationHistory = [];
            state.historyIndex = -1;
            state.recentlyVisited = [];
            state.searchHistory = [];
          });
        },

        reset: () => {
          set((state) => {
            // Reset all state to initial values
            state.currentRoute = "/";
            state.previousRoute = null;
            state.navigationHistory = [];
            state.historyIndex = -1;
            state.breadcrumbs = [];
            state.searchQuery = "";
            state.searchResults = [];
            state.isSearching = false;
            state.sessionStart = Date.now();
          });
        },
      })),
      {
        name: "navigation-store",
        partialize: (state) => ({
          favorites: state.favorites,
          recentlyVisited: state.recentlyVisited.slice(0, 10),
          customShortcuts: state.customShortcuts,
          collapsedSections: state.collapsedSections,
          searchHistory: state.searchHistory.slice(0, 20),
        }),
      }
    ),
    {
      name: "navigation-store",
    }
  )
);

// Helper functions
async function searchNavigationItems(query: string): Promise<SearchResult[]> {
  // This would call the search service
  return [];
}

function recordNavigationEvent(event: NavigationEvent) {
  // This would send analytics data
  console.log("Recording navigation event:", event);
}
```

### 4.2 Phase 2: Intelligent Search Implementation (Week 3-4)

#### 4.2.1 Search Service Implementation

```typescript
// src/services/searchService.ts
import Fuse from "fuse.js";

export class SearchService {
  private searchIndex: Fuse<SearchIndexItem>;
  private searchHistory: SearchQuery[] = [];
  private userPreferences: UserSearchPreferences;

  constructor() {
    this.initializeSearchIndex();
  }

  private async initializeSearchIndex() {
    // Load search index from various sources
    const navigationItems = await this.getNavigationItems();
    const contentItems = await this.getContentItems();
    const companyItems = await this.getCompanyItems();
    const documentItems = await this.getDocumentItems();

    const allItems = [
      ...navigationItems,
      ...contentItems,
      ...companyItems,
      ...documentItems,
    ];

    this.searchIndex = new Fuse(allItems, {
      keys: ["title", "description", "content", "keywords", "tags"],
      threshold: 0.3,
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 2,
      useExtendedSearch: true,
    });
  }

  async performSearch(
    query: string,
    options: SearchOptions = {}
  ): Promise<SearchResult[]> {
    const {
      userId,
      filters = {},
      limit = 20,
      includePersonalization = true,
    } = options;

    // Perform fuzzy search
    const fuseResults = this.searchIndex.search(query, {
      limit: limit * 2, // Get more results for ranking
    });

    // Convert to search results
    let results: SearchResult[] = fuseResults.map((result) => ({
      id: result.item.id,
      type: result.item.type,
      title: result.item.title,
      description: result.item.description,
      url: result.item.url,
      category: result.item.category,
      relevanceScore: 1 - (result.score || 0),
      matches: result.matches || [],
      metadata: result.item.metadata,
    }));

    // Apply filters
    if (filters.type) {
      results = results.filter((result) => filters.type?.includes(result.type));
    }
    if (filters.category) {
      results = results.filter(
        (result) => result.category === filters.category
      );
    }

    // Apply personalization
    if (includePersonalization && userId) {
      results = await this.applyPersonalization(results, userId, query);
    }

    // Boost recent items
    results = this.boostRecentItems(results);

    // Sort and limit
    results = results
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);

    // Record search query
    this.recordSearchQuery(query, results.length, userId);

    return results;
  }

  async getSuggestions(
    query: string,
    userId?: string
  ): Promise<SearchSuggestion[]> {
    if (query.length < 2) return [];

    // Get recent searches
    const recentSuggestions = this.getRecentSearchSuggestions(query, userId);

    // Get popular searches
    const popularSuggestions = this.getPopularSearchSuggestions(query);

    // Get AI-powered suggestions
    const aiSuggestions = await this.getAISuggestions(query, userId);

    // Combine and deduplicate
    const allSuggestions = [
      ...recentSuggestions,
      ...popularSuggestions,
      ...aiSuggestions,
    ];

    return this.deduplicateSuggestions(allSuggestions).slice(0, 8);
  }

  async updateSearchIndex(items: SearchIndexItem[]): Promise<void> {
    // Update the search index with new or modified items
    // This would be called when content is added or modified
    const currentItems = this.searchIndex.getIndex();
    const updatedItems = [...currentItems, ...items];

    this.searchIndex = new Fuse(updatedItems, {
      keys: ["title", "description", "content", "keywords", "tags"],
      threshold: 0.3,
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 2,
      useExtendedSearch: true,
    });
  }

  private async getNavigationItems(): Promise<SearchIndexItem[]> {
    // Get navigation items from router configuration
    return [
      {
        id: "nav-dashboard",
        type: "route",
        title: "Dashboard",
        description: "Portfolio overview and summary",
        url: "/dashboard",
        keywords: ["dashboard", "overview", "portfolio", "summary"],
        tags: ["main", "portfolio"],
        category: "portfolio",
        priority: 1,
        lastIndexed: Date.now(),
        accessLevel: "user",
        metadata: { icon: "LayoutDashboard" },
      },
      {
        id: "nav-companies",
        type: "route",
        title: "Companies",
        description: "Portfolio companies and investments",
        url: "/companies",
        keywords: ["companies", "portfolio", "investments", "startups"],
        tags: ["main", "portfolio"],
        category: "portfolio",
        priority: 2,
        lastIndexed: Date.now(),
        accessLevel: "user",
        metadata: { icon: "Building2" },
      },
      // Add more navigation items...
    ];
  }

  private async applyPersonalization(
    results: SearchResult[],
    userId: string,
    query: string
  ): Promise<SearchResult[]> {
    // Get user's navigation patterns and preferences
    const userPatterns = await this.getUserNavigationPatterns(userId);
    const userFavorites = await this.getUserFavorites(userId);
    const recentVisits = await this.getRecentVisits(userId);

    return results.map((result) => {
      let personalizedScore = result.relevanceScore;

      // Boost if user has favorited this item
      if (userFavorites.includes(result.id)) {
        personalizedScore += 0.2;
      }

      // Boost if user has recently visited this item
      if (recentVisits.some((visit) => visit.id === result.id)) {
        personalizedScore += 0.15;
      }

      // Boost if this matches user's navigation patterns
      if (
        userPatterns.some((pattern) => pattern.category === result.category)
      ) {
        personalizedScore += 0.1;
      }

      // Boost if this matches user's search history
      const previousSearches = await this.getUserSearchHistory(userId);
      if (
        previousSearches.some(
          (search) => this.querySimilarity(search.query, query) > 0.7
        )
      ) {
        personalizedScore += 0.05;
      }

      return {
        ...result,
        relevanceScore: Math.min(personalizedScore, 1.0),
        personalized: true,
      };
    });
  }

  private boostRecentItems(results: SearchResult[]): SearchResult[] {
    const now = Date.now();
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

    return results.map((result) => {
      const lastIndexed = result.metadata?.lastIndexed || 0;
      if (lastIndexed > oneWeekAgo) {
        const recencyBoost =
          ((lastIndexed - oneWeekAgo) / (now - oneWeekAgo)) * 0.1;
        return {
          ...result,
          relevanceScore: Math.min(result.relevanceScore + recencyBoost, 1.0),
        };
      }
      return result;
    });
  }

  private getRecentSearchSuggestions(
    query: string,
    userId?: string
  ): SearchSuggestion[] {
    const history = userId
      ? this.getUserSearchHistory(userId)
      : this.searchHistory;

    return history
      .filter((item) => item.query.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 3)
      .map((item) => ({
        id: `recent-${item.query}`,
        text: item.query,
        type: "recent",
        category: "history",
        metadata: { lastSearched: item.timestamp },
      }));
  }

  private getPopularSearchSuggestions(query: string): SearchSuggestion[] {
    // This would get popular searches from analytics
    const popularSearches = [
      "portfolio performance",
      "company valuation",
      "market trends",
      "competitor analysis",
      "investment opportunities",
    ];

    return popularSearches
      .filter((search) => search.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 3)
      .map((search) => ({
        id: `popular-${search}`,
        text: search,
        type: "popular",
        category: "trending",
        metadata: {},
      }));
  }

  private async getAISuggestions(
    query: string,
    userId?: string
  ): Promise<SearchSuggestion[]> {
    // This would use AI to generate intelligent suggestions
    // For now, return basic keyword-based suggestions

    const suggestions: SearchSuggestion[] = [];

    // Add keyword completions
    if (query.startsWith("port")) {
      suggestions.push({
        id: "ai-portfolio",
        text: "portfolio performance",
        type: "completion",
        category: "suggestion",
        metadata: {},
      });
    }

    if (query.startsWith("comp")) {
      suggestions.push({
        id: "ai-company",
        text: "company analysis",
        type: "completion",
        category: "suggestion",
        metadata: {},
      });
    }

    return suggestions;
  }

  private querySimilarity(query1: string, query2: string): number {
    // Simple similarity calculation
    const words1 = query1.toLowerCase().split(" ");
    const words2 = query2.toLowerCase().split(" ");

    const intersection = words1.filter((word) => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];

    return intersection.length / union.length;
  }

  private deduplicateSuggestions(
    suggestions: SearchSuggestion[]
  ): SearchSuggestion[] {
    const seen = new Set<string>();
    return suggestions.filter((suggestion) => {
      const key = suggestion.text.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private recordSearchQuery(
    query: string,
    resultCount: number,
    userId?: string
  ): void {
    const searchEntry: SearchQuery = {
      query,
      resultCount,
      timestamp: Date.now(),
      userId: userId || "anonymous",
    };

    this.searchHistory.unshift(searchEntry);
    this.searchHistory = this.searchHistory.slice(0, 100); // Keep last 100
  }

  // Helper methods (would be implemented with actual data fetching)
  private async getNavigationItems(): Promise<SearchIndexItem[]> {
    return [];
  }
  private async getContentItems(): Promise<SearchIndexItem[]> {
    return [];
  }
  private async getCompanyItems(): Promise<SearchIndexItem[]> {
    return [];
  }
  private async getDocumentItems(): Promise<SearchIndexItem[]> {
    return [];
  }
  private async getUserNavigationPatterns(userId: string): Promise<any[]> {
    return [];
  }
  private async getUserFavorites(userId: string): Promise<string[]> {
    return [];
  }
  private async getRecentVisits(userId: string): Promise<any[]> {
    return [];
  }
  private async getUserSearchHistory(userId: string): Promise<SearchQuery[]> {
    return [];
  }
}

// Type definitions
interface SearchOptions {
  userId?: string;
  filters?: {
    type?: string[];
    category?: string;
    dateRange?: { start: number; end: number };
  };
  limit?: number;
  includePersonalization?: boolean;
}

interface SearchResult {
  id: string;
  type: string;
  title: string;
  description?: string;
  url: string;
  category: string;
  relevanceScore: number;
  matches?: any[];
  metadata?: Record<string, any>;
  personalized?: boolean;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: "recent" | "popular" | "completion" | "ai";
  category: string;
  metadata: Record<string, any>;
}

interface SearchIndexItem {
  id: string;
  type: string;
  title: string;
  description?: string;
  content?: string;
  url: string;
  keywords: string[];
  tags: string[];
  category: string;
  priority: number;
  lastIndexed: number;
  accessLevel: string;
  metadata: Record<string, any>;
}
```

#### 4.2.2 Global Search Component

```typescript
// src/components/search/GlobalSearch.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigationStore } from "@/stores/navigationStore";
import { SearchService } from "@/services/searchService";
import { SearchResults } from "./SearchResults";
import { SearchSuggestions } from "./SearchSuggestions";
import { RecentSearches } from "./RecentSearches";
import { Search, Command, Loader } from "lucide-react";

interface GlobalSearchProps {
  className?: string;
  placeholder?: string;
  showShortcuts?: boolean;
}

export function GlobalSearch({
  className,
  placeholder = "Search features, companies, documents...",
  showShortcuts = true
}: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [searchService] = useState(() => new SearchService());

  const {
    searchQuery,
    searchResults,
    isSearching,
    performSearch,
    setSearchQuery
  } = useNavigationStore();

  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (event.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (inputValue.length >= 2) {
      searchService.getSuggestions(inputValue).then(setSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [inputValue]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setSearchQuery(value);

    if (value.length >= 2) {
      performSearch(value);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setInputValue(suggestion.text);
    setSearchQuery(suggestion.text);
    performSearch(suggestion.text);
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      performSearch(inputValue.trim());
      setIsOpen(false);
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className={`
              w-full pl-10 pr-10 py-2 border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${isOpen ? 'ring-2 ring-blue-500 border-transparent' : ''}
            `}
          />
          {isSearching && (
            <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
          )}
          {!isSearching && inputValue && (
            <button
              type="button"
              onClick={() => {
                setInputValue('');
                setSearchQuery('');
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>

        {showShortcuts && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-xs font-mono text-gray-500 bg-gray-100 rounded">
              ⌘K
            </kbd>
          </div>
        )}
      </form>

      {/* Search dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200  shadow-lg z-50 max-h-96 overflow-hidden">
          {inputValue.length < 2 ? (
            <div className="p-4">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Recent Searches</h3>
                <RecentSearches onSelect={handleSuggestionClick} />
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Popular Searches</h3>
                <div className="space-y-1">
                  <div className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded cursor-pointer">
                    Portfolio performance
                  </div>
                  <div className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded cursor-pointer">
                    Company valuation
                  </div>
                  <div className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded cursor-pointer">
                    Market trends
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {suggestions.length > 0 && (
                <div className="p-2 border-b border-gray-200">
                  <h3 className="text-xs font-medium text-gray-500 mb-2">Suggestions</h3>
                  <SearchSuggestions
                    suggestions={suggestions}
                    onSelect={handleSuggestionClick}
                  />
                </div>
              )}

              <div className="max-h-64 overflow-y-auto">
                {isSearching ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="h-6 w-6 animate-spin text-gray-400 mr-2" />
                    <span className="text-gray-500">Searching...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <SearchResults
                    results={searchResults}
                    onSelect={(result) => {
                      // Navigate to the selected result
                      window.location.href = result.url;
                      setIsOpen(false);
                    }}
                  />
                ) : inputValue.length >= 2 ? (
                  <div className="p-4 text-center text-gray-500">
                    <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>No results found for "{inputValue}"</p>
                    <p className="text-sm mt-1">Try different keywords or check spelling</p>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

### 4.3 Phase 3: Advanced Breadcrumbs and Navigation UI (Week 5-6)

#### 4.3.1 Advanced Breadcrumb System

```typescript
// src/components/breadcrumbs/BreadcrumbNav.tsx
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useNavigationStore } from "@/stores/navigationStore";
import { ChevronRight, Home, MoreHorizontal } from "lucide-react";
import { BreadcrumbItem } from "./BreadcrumbItem";
import { BreadcrumbDropdown } from "./BreadcrumbDropdown";

interface BreadcrumbNavProps {
  className?: string;
  maxItems?: number;
  showHome?: boolean;
  interactive?: boolean;
}

export function BreadcrumbNav({
  className,
  maxItems = 5,
  showHome = true,
  interactive = true
}: BreadcrumbNavProps) {
  const location = useLocation();
  const { breadcrumbs, updateBreadcrumbs } = useNavigationStore();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Generate breadcrumbs from current route
  useEffect(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const generatedBreadcrumbs = generateBreadcrumbs(pathSegments, location.pathname);
    updateBreadcrumbs(generatedBreadcrumbs);
  }, [location.pathname]);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const displayBreadcrumbs = getDisplayBreadcrumbs(breadcrumbs, maxItems);

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`}>
      {showHome && (
        <>
          <Link
            to="/dashboard"
            className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </>
      )}

      {displayBreadcrumbs.map((breadcrumb, index) => {
        const isLast = index === displayBreadcrumbs.length - 1;
        const isCollapsed = breadcrumb.collapsed;

        if (isCollapsed) {
          return (
            <BreadcrumbDropdown
              key="collapsed"
              items={breadcrumbs}
              onSelect={(item) => {
                // Navigate to selected breadcrumb
                window.location.href = item.url;
              }}
            />
          );
        }

        return (
          <BreadcrumbItem
            key={breadcrumb.id}
            breadcrumb={breadcrumb}
            isLast={isLast}
            interactive={interactive && !isLast}
            expanded={expandedItems.has(breadcrumb.id)}
            onToggleExpand={() => toggleExpanded(breadcrumb.id)}
          />
        );
      })}
    </nav>
  );
}

function generateBreadcrumbs(pathSegments: string[], currentPath: string): Breadcrumb[] {
  const breadcrumbs: Breadcrumb[] = [];
  let currentPathBuilder = '';

  // Define route metadata
  const routeMetadata: Record<string, Partial<Breadcrumb>> = {
    'dashboard': { title: 'Dashboard', icon: 'LayoutDashboard' },
    'companies': { title: 'Companies', icon: 'Building2' },
    'market-research': { title: 'Market Research', icon: 'TrendingUp' },
    'competitive-intel': { title: 'Competitive Intelligence', icon: 'Target' },
    'benchmarks': { title: 'Benchmarks', icon: 'BarChart' },
    'chat': { title: 'AI Assistant', icon: 'MessageSquare' },
    'network': { title: 'Network Intelligence', icon: 'Network' },
    'documents': { title: 'Documents', icon: 'FileText' },
    'analytics': { title: 'Analytics', icon: 'PieChart' },
    'settings': { title: 'Settings', icon: 'Settings' }
  };

  pathSegments.forEach((segment, index) => {
    currentPathBuilder += `/${segment}`;

    const metadata = routeMetadata[segment] || {};
    const isDynamic = segment.startsWith(':') || /^\d+$/.test(segment);

    breadcrumbs.push({
      id: `breadcrumb-${index}`,
      label: metadata.title || formatSegmentLabel(segment),
      url: currentPathBuilder,
      path: segment,
      level: index + 1,
      isDynamic,
      icon: metadata.icon,
      collapsed: false,
      children: isDynamic ? [] : getChildrenBreadcrumbs(segment, pathSegments.slice(index + 1))
    });
  });

  return breadcrumbs;
}

function formatSegmentLabel(segment: string): string {
  // Convert kebab-case or snake_case to Title Case
  return segment
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
    .replace(/^\d+/, 'Item $&'); // Handle numeric segments
}

function getChildrenBreadcrumbs(parentSegment: string, remainingSegments: string[]): Breadcrumb[] {
  // This would generate child breadcrumbs for dropdown menus
  // For now, return empty array
  return [];
}

function getDisplayBreadcrumbs(breadcrumbs: Breadcrumb[], maxItems: number): Breadcrumb[] {
  if (breadcrumbs.length <= maxItems) {
    return breadcrumbs;
  }

  const firstItem = breadcrumbs[0];
  const lastItems = breadcrumbs.slice(-2);
  const collapsedCount = breadcrumbs.length - lastItems.length - 1;

  return [
    firstItem,
    {
      id: 'collapsed-breadcrumb',
      label: `${collapsedCount} more`,
      url: '',
      path: '',
      level: 2,
      isDynamic: false,
      collapsed: true,
      children: breadcrumbs.slice(1, -2)
    },
    ...lastItems
  ];
}

// src/components/breadcrumbs/BreadcrumbItem.tsx
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

interface BreadcrumbItemProps {
  breadcrumb: Breadcrumb;
  isLast: boolean;
  interactive: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
}

export function BreadcrumbItem({
  breadcrumb,
  isLast,
  interactive,
  expanded,
  onToggleExpand
}: BreadcrumbItemProps) {
  const Component = interactive && !isLast ? Link : 'span';
  const linkProps = interactive && !isLast
    ? { to: breadcrumb.url, className: "text-blue-600 hover:text-blue-800" }
    : { className: "text-gray-500" };

  return (
    <>
      <Component {...linkProps}>
        <div className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-100 transition-colors">
          {breadcrumb.icon && (
            <span className="text-gray-400">
              {/* Render icon component based on name */}
              {getIconComponent(breadcrumb.icon)}
            </span>
          )}
          <span className={isLast ? "font-medium text-gray-900" : ""}>
            {breadcrumb.label}
          </span>
          {breadcrumb.children && breadcrumb.children.length > 0 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onToggleExpand();
              }}
              className="ml-1 text-gray-400 hover:text-gray-600"
            >
              <ChevronDown
                className={`h-3 w-3 transform transition-transform ${
                  expanded ? 'rotate-180' : ''
                }`}
              />
            </button>
          )}
        </div>
      </Component>

      {!isLast && (
        <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
      )}

      {/* Dropdown for children */}
      {expanded && breadcrumb.children && breadcrumb.children.length > 0 && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200  shadow-lg z-10 min-w-48">
          {breadcrumb.children.map((child) => (
            <Link
              key={child.id}
              to={child.url}
              className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

function getIconComponent(iconName: string): React.ReactNode {
  // This would return the appropriate Lucide icon component
  // For now, return a placeholder
  return <span className="text-xs">[{iconName}]</span>;
}
```

### 4.4 Phase 4: AI-Enhanced Navigation and Analytics (Week 7-8)

#### 4.4.1 AI Navigation Assistant

```typescript
// src/services/navigationAIService.ts
export class NavigationAIService {
  private userPatterns: Map<string, NavigationPattern[]> = new Map();
  private featureUsage: Map<string, FeatureUsage[]> = new Map();

  async generateNavigationSuggestions(
    userId: string,
    currentContext: NavigationContext
  ): Promise<NavigationSuggestion[]> {
    const suggestions: NavigationSuggestion[] = [];

    // Get user's navigation patterns
    const patterns = this.getUserPatterns(userId);

    // Get current context and time-based patterns
    const timeBasedSuggestions = this.getTimeBasedSuggestions(currentContext, patterns);
    suggestions.push(...timeBasedSuggestions);

    // Get workflow-based suggestions
    const workflowSuggestions = this.getWorkflowBasedSuggestions(currentContext, patterns);
    suggestions.push(...workflowSuggestions);

    // Get collaborative suggestions (what similar users do next)
    const collaborativeSuggestions = await this.getCollaborativeSuggestions(userId, currentContext);
    suggestions.push(...collaborativeSuggestions);

    // Get content-based suggestions (based on current page content)
    const contentSuggestions = this.getContentBasedSuggestions(currentContext);
    suggestions.push(...contentSuggestions);

    // Rank and filter suggestions
    return this.rankSuggestions(suggestions, userId, currentContext);
  }

  async analyzeUserNavigation(userId: string, timeframe: string): Promise<NavigationAnalysis> {
    const navigationData = await this.getUserNavigationData(userId, timeframe);

    return {
      userId,
      timeframe,
      patterns: this.identifyNavigationPatterns(navigationData),
      efficiency: this.calculateNavigationEfficiency(navigationData),
      recommendations: this.generateNavigationRecommendations(navigationData),
      insights: this.generateNavigationInsights(navigationData)
    };
  }

  async optimizeNavigationLayout(userId: string): Promise<NavigationLayoutOptimization> {
    const userPreferences = await this.getUserPreferences(userId);
    const usagePatterns = await this.getUserUsagePatterns(userId);
    const collaborativeData = await this.getCollaborativeNavigationData();

    return {
      personalizedLayout: this.generatePersonalizedLayout(userPreferences, usagePatterns),
      recommendedChanges: this.getRecommendedLayoutChanges(usagePatterns, collaborativeData),
      a/bTestSuggestions: this.generateABTestSuggestions(usagePatterns),
      predictedImprovement: this.predictLayoutImprovement(userPreferences, usagePatterns)
    };
  }

  private getTimeBasedSuggestions(
    context: NavigationContext,
    patterns: NavigationPattern[]
  ): NavigationSuggestion[] {
    const suggestions: NavigationSuggestion[] = [];
    const currentTime = new Date();
    const hour = currentTime.getHours();
    const dayOfWeek = currentTime.getDay();

    // Analyze time-based patterns
    const timePatterns = patterns.filter(pattern => {
      return pattern.timeOfDay === hour || pattern.dayOfWeek === dayOfWeek;
    });

    timePatterns.forEach(pattern => {
      if (pattern.frequency > 0.7) { // High confidence pattern
        suggestions.push({
          id: `time-${pattern.pattern.join('-')}`,
          type: 'time-based',
          title: `Continue ${pattern.pattern[0]} workflow`,
          description: `You often ${pattern.description} at this time`,
          nextSteps: pattern.pattern.slice(1),
          confidence: pattern.frequency,
          priority: this.calculatePriority(pattern, context)
        });
      }
    });

    return suggestions;
  }

  private getWorkflowBasedSuggestions(
    context: NavigationContext,
    patterns: NavigationPattern[]
  ): NavigationSuggestion[] {
    const suggestions: NavigationSuggestion[] = [];

    // Find patterns that start with the current route
    const relevantPatterns = patterns.filter(pattern =>
      pattern.pattern[0] === context.currentRoute
    );

    relevantPatterns.forEach(pattern => {
      if (pattern.successRate > 0.8 && pattern.pattern.length > 1) {
        suggestions.push({
          id: `workflow-${pattern.pattern.join('-')}`,
          type: 'workflow-based',
          title: `Continue ${this.getWorkflowName(pattern.pattern)} workflow`,
          description: this.getWorkflowDescription(pattern),
          nextSteps: pattern.pattern.slice(1),
          confidence: pattern.successRate,
          priority: this.calculatePriority(pattern, context)
        });
      }
    });

    return suggestions;
  }

  private async getCollaborativeSuggestions(
    userId: string,
    context: NavigationContext
  ): Promise<NavigationSuggestion[]> {
    // Get users with similar profiles
    const similarUsers = await this.findSimilarUsers(userId);

    // Get what similar users do after visiting the current route
    const collaborativePatterns = await this.getCollaborativePatterns(similarUsers, context.currentRoute);

    return collaborativePatterns.map(pattern => ({
      id: `collaborative-${pattern.id}`,
      type: 'collaborative',
      title: `${pattern.title} (popular)`,
      description: `${pattern.userCount} users found this helpful`,
      nextSteps: pattern.nextSteps,
      confidence: pattern.confidence,
      priority: this.calculatePriority(pattern, context)
    }));
  }

  private getContentBasedSuggestions(context: NavigationContext): NavigationSuggestion[] {
    const suggestions: NavigationSuggestion[] = [];

    // Analyze current page content and suggest related features
    const currentFeatures = this.extractFeaturesFromRoute(context.currentRoute);
    const relatedFeatures = this.findRelatedFeatures(currentFeatures);

    relatedFeatures.forEach(feature => {
      suggestions.push({
        id: `content-${feature.id}`,
        type: 'content-based',
        title: feature.title,
        description: feature.description,
        nextSteps: [feature.route],
        confidence: feature.relevanceScore,
        priority: this.calculatePriority(feature, context)
      });
    });

    return suggestions;
  }

  private rankSuggestions(
    suggestions: NavigationSuggestion[],
    userId: string,
    context: NavigationContext
  ): NavigationSuggestion[] {
    return suggestions
      .sort((a, b) => {
        // Sort by priority first, then confidence
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }
        return b.confidence - a.confidence;
      })
      .slice(0, 5); // Top 5 suggestions
  }

  private calculatePriority(pattern: any, context: NavigationContext): number {
    let priority = 0.5; // Base priority

    // Boost for recent success
    if (pattern.lastUsed && (Date.now() - pattern.lastUsed) < 7 * 24 * 60 * 60 * 1000) {
      priority += 0.2;
    }

    // Boost for high frequency
    if (pattern.frequency > 0.8) {
      priority += 0.2;
    }

    // Boost for contextual relevance
    if (this.isContextuallyRelevant(pattern, context)) {
      priority += 0.1;
    }

    return Math.min(priority, 1.0);
  }

  private isContextuallyRelevant(pattern: any, context: NavigationContext): boolean {
    // Check if pattern is relevant to current context
    // This would involve more sophisticated logic
    return true;
  }

  // Helper methods (would be implemented with actual data fetching)
  private getUserPatterns(userId: string): NavigationPattern[] { return []; }
  private async getUserNavigationData(userId: string, timeframe: string): Promise<any[]> { return []; }
  private identifyNavigationPatterns(data: any[]): NavigationPattern[] { return []; }
  private calculateNavigationEfficiency(data: any[]): number { return 0.8; }
  private generateNavigationRecommendations(data: any[]): string[] { return []; }
  private generateNavigationInsights(data: any[]): string[] { return []; }
  private async getUserPreferences(userId: string): Promise<any> { return {}; }
  private async getUserUsagePatterns(userId: string): Promise<any> { return {}; }
  private async getCollaborativeNavigationData(): Promise<any> { return {}; }
  private generatePersonalizedLayout(preferences: any, patterns: any): any { return {}; }
  private getRecommendedLayoutChanges(patterns: any, collaborative: any): any[] { return []; }
  private generateABTestSuggestions(patterns: any): any[] { return []; }
  private predictLayoutImprovement(preferences: any, patterns: any): number { return 0.15; }
  private getWorkflowName(pattern: string[]): string { return pattern.join(' → '); }
  private getWorkflowDescription(pattern: any): string { return ''; }
  private async findSimilarUsers(userId: string): Promise<string[]> { return []; }
  private async getCollaborativePatterns(users: string[], route: string): Promise<any[]> { return []; }
  private extractFeaturesFromRoute(route: string): any[] { return []; }
  private findRelatedFeatures(features: any[]): any[] { return []; }
}

// Type definitions
interface NavigationContext {
  currentRoute: string;
  previousRoute?: string;
  timestamp: number;
  sessionDuration: number;
  metadata?: Record<string, any>;
}

interface NavigationSuggestion {
  id: string;
  type: 'time-based' | 'workflow-based' | 'collaborative' | 'content-based';
  title: string;
  description: string;
  nextSteps: string[];
  confidence: number;
  priority: number;
}

interface NavigationPattern {
  pattern: string[];
  frequency: number;
  successRate: number;
  averageDuration: number;
  lastUsed?: number;
  timeOfDay?: number;
  dayOfWeek?: number;
  description: string;
}

interface NavigationAnalysis {
  userId: string;
  timeframe: string;
  patterns: NavigationPattern[];
  efficiency: number;
  recommendations: string[];
  insights: string[];
}

interface NavigationLayoutOptimization {
  personalizedLayout: any;
  recommendedChanges: any[];
  a/bTestSuggestions: any[];
  predictedImprovement: number;
}
```

## 5. Code Change Overview

### 5.1 New Files to Create

#### Router Configuration

```typescript
// src/router/index.tsx
export function AppRouter() {
  // Main router configuration from Phase 1.1.2
}

// src/router/routes.tsx
export const routes = [
  // Route definitions with metadata
];

// src/router/routeComponents.tsx
export const routeComponents = {
  // Lazy-loaded route components
};

// src/router/routeGuards.tsx
export const routeGuards = {
  // Authentication and authorization guards
};

// src/router/lazyLoading.tsx
export function lazyLoading(importFunc: () => Promise<any>) {
  // Lazy loading wrapper with error handling
}
```

#### Navigation Components

```typescript
// src/components/navigation/NavigationProvider.tsx
export function NavigationProvider({ children }: NavigationProviderProps) {
  // Navigation context provider
}

// src/components/navigation/NavigationSidebar.tsx
export function NavigationSidebar({ className }: NavigationSidebarProps) {
  // Main navigation sidebar with hierarchical structure
}

// src/components/navigation/NavigationHeader.tsx
export function NavigationHeader({ className }: NavigationHeaderProps) {
  // Header with search and user controls
}

// src/components/navigation/MobileNavigation.tsx
export function MobileNavigation({ className }: MobileNavigationProps) {
  // Mobile-optimized navigation drawer
}
```

#### Search Components

```typescript
// src/components/search/GlobalSearch.tsx
export function GlobalSearch({ className, placeholder }: GlobalSearchProps) {
  // Global search component from Phase 2.2.2
}

// src/components/search/SearchResults.tsx
export function SearchResults({ results, onSelect }: SearchResultsProps) {
  // Search results display component
}

// src/components/search/SearchSuggestions.tsx
export function SearchSuggestions({
  suggestions,
  onSelect,
}: SearchSuggestionsProps) {
  // Search suggestions dropdown
}

// src/components/search/RecentSearches.tsx
export function RecentSearches({ onSelect }: RecentSearchesProps) {
  // Recent searches display
}
```

#### Breadcrumb Components

```typescript
// src/components/breadcrumbs/BreadcrumbNav.tsx
export function BreadcrumbNav({ className, maxItems }: BreadcrumbNavProps) {
  // Advanced breadcrumb navigation from Phase 3.3.1
}

// src/components/breadcrumbs/BreadcrumbItem.tsx
export function BreadcrumbItem({
  breadcrumb,
  isLast,
  interactive,
}: BreadcrumbItemProps) {
  // Individual breadcrumb item
}

// src/components/breadcrumbs/BreadcrumbDropdown.tsx
export function BreadcrumbDropdown({
  items,
  onSelect,
}: BreadcrumbDropdownProps) {
  // Dropdown for collapsed breadcrumbs
}
```

#### Services

```typescript
// src/services/navigationService.ts
export class NavigationService {
  // Navigation service for analytics and optimization
}

// src/services/searchService.ts
export class SearchService {
  // Search service implementation from Phase 2.2.1
}

// src/services/analyticsService.ts
export class AnalyticsService {
  // Navigation analytics service
}

// src/services/personalizationService.ts
export class PersonalizationService {
  // User personalization engine
}

// src/services/navigationAIService.ts
export class NavigationAIService {
  // AI-powered navigation assistance from Phase 4.4.1
}
```

#### Stores

```typescript
// src/stores/navigationStore.ts
export const useNavigationStore = create<NavigationState>()(() => ({
  // Navigation state management from Phase 1.1.3
}));

// src/stores/searchStore.ts
export const useSearchStore = create<SearchState>()(() => ({
  // Search state management
}));

// src/stores/analyticsStore.ts
export const useAnalyticsStore = create<AnalyticsState>()(() => ({
  // Analytics state management
}));
```

#### Hooks

```typescript
// src/hooks/useNavigation.ts
export function useNavigation() {
  // Navigation hook with enhanced functionality
}

// src/hooks/useSearch.ts
export function useSearch(options?: SearchOptions) {
  // Search hook with AI-powered suggestions
}

// src/hooks/useBreadcrumbs.ts
export function useBreadcrumbs() {
  // Breadcrumb management hook
}

// src/hooks/useNavigationAnalytics.ts
export function useNavigationAnalytics(userId: string) {
  // Navigation analytics hook
}
```

### 5.2 Existing Files to Modify

#### Main App Component

```typescript
// src/App.tsx (existing file)
// BEFORE:
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* existing routes */}
      </Routes>
    </BrowserRouter>
  );
}

// AFTER:
function App() {
  return <AppRouter />;
}
```

#### Navigation Component Updates

```typescript
// src/components/Navigation.tsx (existing file)
// Replace with new NavigationProvider and enhanced components
import { NavigationProvider } from "@/components/navigation/NavigationProvider";
import { NavigationSidebar } from "@/components/navigation/NavigationSidebar";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { BreadcrumbNav } from "@/components/breadcrumbs/BreadcrumbNav";

export function Navigation() {
  return (
    <NavigationProvider>
      <div className="flex h-full">
        <NavigationSidebar />
        <div className="flex-1 flex flex-col">
          <header className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <BreadcrumbNav />
              <GlobalSearch />
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            {/* Page content */}
          </main>
        </div>
      </div>
    </NavigationProvider>
  );
}
```

#### Package Dependencies Update

```json
// package.json (update dependencies)
{
  "dependencies": {
    // ... existing dependencies
    "react-router-dom": "^7.9.3",
    "@tanstack/react-router": "^1.45.0",
    "fuse.js": "^7.0.0",
    "zustand": "^4.4.7",
    "react-hotkeys-hook": "^4.4.1",
    "react-spring": "^9.7.3",
    "framer-motion": "^10.16.4",
    "react-intersection-observer": "^9.5.2",
    "react-virtualized": "^9.22.5"
  }
}
```

### 5.3 Backend Functions to Add

#### Navigation Analytics Functions

```typescript
// convex/queries.ts (add to existing file)
export const getNavigationStructure = query({
  args: {
    userId: v.optional(v.id("users")),
    role: v.optional(v.string()),
    depth: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Get navigation structure based on user role and permissions
    // Include user-specific customizations
    // Return hierarchical navigation tree
  },
});

export const getUserNavigationPreferences = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Get user's navigation preferences and settings
    // Include favorites, history, customizations
    // Return complete preference profile
  },
});

export const getNavigationAnalytics = query({
  args: {
    userId: v.id("users"),
    timeframe: v.optional(v.string()),
    metrics: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // Get navigation analytics for user
    // Include patterns, usage, and insights
    // Return analytics data and recommendations
  },
});
```

#### Navigation Preference Management

```typescript
// convex/mutations.ts (add to existing file)
export const updateUserNavigationPreferences = mutation({
  args: {
    userId: v.id("users"),
    preferences: v.object({
      favoriteRoutes: v.optional(v.array(v.string())),
      menuOrder: v.optional(v.array(v.string())),
      collapsedSections: v.optional(v.array(v.string())),
      customShortcuts: v.optional(v.array(v.any())),
      adaptiveSettings: v.optional(v.any()),
    }),
  },
  handler: async (ctx, args) => {
    // Update user navigation preferences
    // Validate changes and apply defaults
    // Return updated preferences
  },
});

export const recordNavigationEvent = mutation({
  args: {
    userId: v.id("users"),
    event: v.object({
      type: v.string(),
      route: v.string(),
      timestamp: v.number(),
      context: v.optional(v.record(v.string(), v.any())),
      metadata: v.optional(v.record(v.string(), v.any())),
    }),
  },
  handler: async (ctx, args) => {
    // Record navigation event for analytics
    // Update user patterns and preferences
    // Trigger AI learning if applicable
  },
});
```

#### Search and AI Functions

```typescript
// convex/actions.ts (add to existing file)
export const generateNavigationSuggestions = action({
  args: {
    userId: v.id("users"),
    currentContext: v.record(v.string(), v.any()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Generate AI-powered navigation suggestions
    // Consider user patterns and current context
    // Return personalized next-step recommendations
  },
});

export const optimizeNavigationLayout = action({
  args: {
    userId: v.id("users"),
    optimizationType: v.optional(
      v.union(
        v.literal("personalization"),
        v.literal("performance"),
        v.literal("collaborative")
      )
    ),
  },
  handler: async (ctx, args) => {
    // Analyze user navigation patterns
    // Generate layout optimization recommendations
    // Return personalized layout suggestions
  },
});
```

### 5.4 Schema Extensions

#### Navigation and Analytics Tables

```typescript
// convex/schema.ts (add to existing schema)
// Navigation preferences
navigationPreferences: defineTable({
  userId: v.id("users"),
  favoriteRoutes: v.array(v.string()),
  recentlyVisited: v.array(v.object({
    path: v.string(),
    title: v.string(),
    timestamp: v.number()
  })),
  searchHistory: v.array(v.object({
    query: v.string(),
    timestamp: v.number(),
    resultsCount: v.number()
  })),
  menuOrder: v.array(v.string()),
  collapsedSections: v.array(v.string()),
  customShortcuts: v.array(v.object({
    id: v.string(),
    route: v.string(),
    title: v.string(),
    shortcut: v.string()
  })),
  adaptiveSettings: v.object({
    enablePersonalization: v.boolean(),
    learningRate: v.number(),
    suggestionFrequency: v.string(),
    autoExpandSections: v.array(v.string())
  }),
  createdAt: v.number(),
  updatedAt: v.number()
})
  .index("by_user", ["userId"]),

// Navigation analytics
navigationAnalytics: defineTable({
  userId: v.id("users"),
  sessionId: v.string(),
  route: v.string(),
  timestamp: v.number(),
  duration: v.optional(v.number()),
  referrer: v.optional(v.string()),
  userAgent: v.optional(v.string()),
  context: v.object({
    searchQuery: v.optional(v.string()),
    breadcrumbPath: v.optional(v.array(v.string())),
    previousRoute: v.optional(v.string())
  }),
  interactions: v.array(v.object({
    type: v.string(),
    element: v.string(),
    timestamp: v.number()
  }))
})
  .index("by_user", ["userId"])
  .index("by_session", ["sessionId"])
  .index("by_route", ["route"])
  .index("by_timestamp", ["timestamp"]),

// Navigation patterns
navigationPatterns: defineTable({
  userId: v.id("users"),
  pattern: v.array(v.string()),
  frequency: v.number(),
  avgDuration: v.number(),
  successRate: v.number(),
  lastUsed: v.number(),
  context: v.object({
    timeOfDay: v.number(),
    dayOfWeek: v.number(),
    sessionDuration: v.number()
  }),
  createdAt: v.number(),
  updatedAt: v.number()
})
  .index("by_user", ["userId"])
  .index("by_frequency", ["frequency"])
  .index("by_lastUsed", ["lastUsed"]),

// Search analytics
searchAnalytics: defineTable({
  userId: v.id("users"),
  query: v.string(),
  timestamp: v.number(),
  resultsCount: v.number(),
  clickedResults: v.array(v.object({
    id: v.string(),
    type: v.string(),
    position: v.number(),
    timestamp: v.number()
  })),
  searchDuration: v.number(),
  context: v.object({
    route: v.string(),
    source: v.string()
  })
})
  .index("by_user", ["userId"])
  .index("by_query", ["query"])
  .index("by_timestamp", ["timestamp"]),
```

## 6. Task Completion Tracking

### 6.1 Implementation Timeline

| Phase   | Tasks                                        | Duration | Status     |
| ------- | -------------------------------------------- | -------- | ---------- |
| Phase 1 | Enhanced router foundation, navigation store | 2 weeks  | ⏳ Pending |
| Phase 2 | Intelligent search implementation            | 2 weeks  | ⏳ Pending |
| Phase 3 | Advanced breadcrumbs and navigation UI       | 2 weeks  | ⏳ Pending |
| Phase 4 | AI-enhanced navigation and analytics         | 2 weeks  | ⏳ Pending |

### 6.2 Mandatory Workflows

#### Testing Strategy

- **Unit Tests**: Navigation store testing, search service testing
- **Integration Tests**: Router configuration testing, search integration testing
- **E2E Tests**: Complete navigation workflow testing
- **Performance Tests**: Navigation performance and loading time testing
- **Usability Tests**: Navigation usability and accessibility testing

#### Quality Assurance

- **Route Testing**: Test all routes and navigation flows
- **Search Accuracy**: Verify search result accuracy and relevance
- **Breadcrumb Testing**: Test breadcrumb generation and interaction
- **Mobile Testing**: Test mobile navigation and responsiveness
- **Accessibility Testing**: Ensure WCAG 2.1 AA compliance

#### Documentation Requirements

- **Navigation Guide**: Complete navigation usage guide
- **Search Documentation**: Search feature documentation
- **API Documentation**: Navigation and search API documentation
- **Customization Guide**: Navigation customization guide
- **Developer Documentation**: Navigation development guide

### 6.3 Success Metrics

#### Technical Metrics

- **Navigation Speed**: < 100ms for route transitions
- **Search Performance**: < 300ms for search results
- **Page Load Time**: < 2 seconds for lazy-loaded routes
- **Mobile Responsiveness**: 100% mobile compatibility
- **Accessibility Score**: > 95 on accessibility audits

#### User Experience Metrics

- **Navigation Efficiency**: 40% reduction in time to find features
- **Search Success Rate**: > 85% successful search outcomes
- **User Satisfaction**: > 4.5/5 on navigation experience
- **Feature Discovery**: 60% increase in feature discovery
- **Task Completion**: > 90% success rate for navigation tasks

#### Business Metrics

- **User Engagement**: 30% increase in feature engagement
- **User Retention**: 20% improvement in user retention
- **Support Reduction**: 25% reduction in navigation-related support tickets
- **Time to Value**: 35% reduction in time to first value
- **Feature Adoption**: 50% increase in feature adoption rates

### 6.4 Risk Assessment and Mitigation

#### Technical Risks

- **Route Complexity**: Implement clear route organization and documentation
- **Search Performance**: Implement intelligent caching and optimization
- **State Management**: Use robust state management with proper error handling
- **Mobile Compatibility**: Test thoroughly across mobile devices
- **Browser Compatibility**: Ensure cross-browser compatibility

#### User Experience Risks

- **Navigation Confusion**: Implement clear visual hierarchy and signage
- **Search Frustration**: Provide helpful search suggestions and error handling
- **Learning Curve**: Provide contextual help and onboarding
- **Mobile Usability**: Optimize for touch interactions and small screens
- **Accessibility Barriers**: Ensure full accessibility compliance

#### Business Risks

- **Implementation Complexity**: Manage scope and prioritize features
- **User Adoption**: Provide comprehensive training and support
- **Maintenance Overhead**: Design for maintainability and documentation
- **Performance Impact**: Monitor performance and optimize continuously
- **Resource Requirements**: Plan for adequate development and testing resources

### 6.5 Handover and Deployment

#### Deployment Checklist

- [ ] All routes tested and working correctly
- [ ] Search functionality tested across all content types
- [ ] Navigation analytics implemented and tested
- [ ] Mobile navigation optimized and tested
- [ ] Accessibility compliance verified
- [ ] Performance benchmarks met
- [ ] Error handling implemented
- [ ] Documentation completed
- [ ] User training materials prepared
- [ ] Analytics tracking configured

#### Post-deployment Monitoring

- **Navigation Analytics**: Monitor navigation patterns and user behavior
- **Search Analytics**: Track search usage and success rates
- **Performance Monitoring**: Monitor route loading times and search performance
- **Error Tracking**: Monitor navigation and search errors
- **User Feedback**: Collect and analyze user feedback
- **Business Impact**: Track impact on user engagement and retention

#### Maintenance Plan

- **Regular Updates**: Update navigation structure as features evolve
- **Search Index Updates**: Keep search index current with new content
- **Performance Optimization**: Continuously optimize navigation and search performance
- **User Feedback Analysis**: Regularly analyze and act on user feedback
- **Feature Enhancement**: Add new navigation features based on user needs
- **Documentation Updates**: Keep documentation current with system changes

## 7. AI Agent Instructions

### 7.1 Mandatory AI Agent Workflows

#### Agent Coordinator Instructions

- **Coordinate Navigation Implementation**: Ensure all navigation components work together
- **Search Integration**: Verify search functionality across all content types
- **User Experience Testing**: Test complete navigation workflows
- **Performance Monitoring**: Monitor navigation system performance
- **Documentation**: Ensure comprehensive navigation documentation

#### TypeScript Specialist Instructions

- **Type Safety**: Ensure strict TypeScript for navigation and search
- **Router Configuration**: Type-safe route configuration and guards
- **State Management**: Proper typing for navigation and search state
- **API Integration**: Type-safe search and analytics integration
- **Error Handling**: Robust error handling with proper types

#### UI/UX Architect Instructions

- **Navigation Design**: Design intuitive and efficient navigation
- **Search Experience**: Optimize search user experience and interface
- **Accessibility**: Ensure WCAG 2.1 AA compliance throughout
- **Responsive Design**: Mobile-first navigation design
- **Information Architecture**: Organize navigation structure logically

#### Security Auditor Instructions

- **Route Security**: Secure route guards and access controls
- **Search Security**: Implement search access controls and data protection
- **User Data Privacy**: Protect navigation analytics and user data
- **Input Validation**: Validate all navigation and search inputs
- **Compliance**: Ensure compliance with data protection regulations

### 7.2 Code Quality Standards

#### Navigation Standards

- **Route Organization**: Clear and logical route structure
- **Performance**: Fast route transitions and loading
- **Consistency**: Consistent navigation patterns across the application
- **Accessibility**: Full accessibility compliance
- **Error Handling**: Graceful error handling and fallbacks

#### Search Standards

- **Relevance**: Accurate and relevant search results
- **Performance**: Fast search response times
- **User Experience**: Intuitive search interface and interactions
- **Comprehensive**: Search across all relevant content types
- **Personalization**: Personalized search results and suggestions

#### Analytics Standards

- **Data Collection**: Comprehensive navigation and search data collection
- **Privacy**: User privacy and data protection
- **Accuracy**: Accurate analytics data and insights
- **Actionability**: Actionable analytics and recommendations
- **Performance**: Efficient analytics processing and reporting

### 7.3 Testing Requirements

#### Navigation Testing

- **Route Testing**: Test all routes and navigation flows
- **Breadcrumb Testing**: Test breadcrumb generation and interaction
- **Mobile Navigation**: Test mobile navigation and responsiveness
- **Accessibility Testing**: Test navigation accessibility
- **Performance Testing**: Test navigation performance

#### Search Testing

- **Search Accuracy**: Test search result accuracy and relevance
- **Search Performance**: Test search response times
- **Search Suggestions**: Test search suggestions and autocomplete
- **Filter Testing**: Test search filtering and sorting
- **Cross-Platform Testing**: Test search across different platforms

#### Integration Testing

- **Component Integration**: Test navigation component integration
- **State Management**: Test navigation state management
- **API Integration**: Test search and analytics API integration
- **Router Integration**: Test router configuration and guards
- **Database Integration**: Test analytics data storage and retrieval

### 7.4 Documentation Requirements

#### Technical Documentation

- **Router Configuration**: Document router setup and configuration
- **Search Integration**: Document search integration and customization
- **API Documentation**: Document navigation and search APIs
- **State Management**: Document navigation state management
- **Troubleshooting Guide**: Document common issues and solutions

#### User Documentation

- **Navigation Guide**: Complete navigation usage guide
- **Search Guide**: Search functionality and tips guide
- **Customization Guide**: Navigation customization guide
- **Accessibility Guide**: Navigation accessibility features
- **Mobile Guide**: Mobile navigation usage guide

#### Developer Documentation

- **Setup Guide**: Navigation system setup guide
- **Extension Guide**: Navigation system extension guide
- **API Reference**: Complete API reference documentation
- **Component Library**: Navigation component library documentation
- **Best Practices**: Navigation development best practices

## 8. Conclusion

### 8.1 Summary

This comprehensive task document outlines the implementation of an advanced routing and navigation system for the VC Portfolio OS. The solution uses a comprehensive navigation ecosystem approach that combines enhanced routing, intelligent search, advanced breadcrumbs, AI-powered suggestions, and comprehensive analytics to provide users with an intuitive and personalized navigation experience.

### 8.2 Key Deliverables

- **Enhanced Router Foundation**: Advanced React Router configuration with lazy loading and route guards
- **Intelligent Search System**: AI-powered search with personalization and suggestions
- **Advanced Breadcrumb System**: Dynamic breadcrumbs with dropdown navigation and context awareness
- **AI-Enhanced Navigation**: Personalized navigation suggestions and workflow optimization
- **Navigation Analytics**: Comprehensive analytics for navigation patterns and optimization

### 8.3 Success Criteria

- **Technical**: Fast navigation performance, accurate search functionality, mobile responsiveness
- **User Experience**: Intuitive navigation, efficient search, high user satisfaction
- **Business**: Improved user engagement, better feature discovery, reduced support overhead
- **Innovation**: AI-powered personalization and intelligent navigation assistance

### 8.4 Next Steps

1. **Review and Approval**: Review this task document and get approval
2. **Phase 1 Implementation**: Begin with enhanced router foundation and navigation store
3. **Search Implementation**: Implement intelligent search with AI-powered suggestions
4. **Navigation UI**: Develop advanced breadcrumbs and navigation components
5. **AI Integration**: Implement AI-enhanced navigation and analytics
6. **Testing and Deployment**: Comprehensive testing and production deployment

This implementation will provide a sophisticated navigation system that transforms how users interact with the VC Portfolio OS, making features more discoverable, reducing time to value, and creating a more personalized and efficient user experience.

---

**Task Document Status**: ✅ Complete
**Version**: 1.0
**Created**: 2025-10-07
**Last Updated**: 2025-10-07
**Next Review**: 2025-10-14
