# Development Authentication Guide

This guide explains how to use the development authentication system to solve common development pain points when working with authenticated Convex functions.

## Problem Statement

When developing with Convex Auth, you often encounter these issues:

1. **Functions requiring authentication block development** - Every function call requires real authentication
2. **AI assistants can't see what you see** - They can't access authenticated functions to understand the current state
3. **Testing different user roles is cumbersome** - You need to create real users for each role
4. **Development workflow is slow** - Constant authentication barriers slow down development

## Solution: Development Authentication Bypass

The development authentication system provides:

- **Dev user switching** - Instantly switch between different user roles and subscription tiers
- **Authentication bypass** - Functions work without real authentication in development
- **AI assistant visibility** - AI can see and interact with the app as different users
- **Role-based testing** - Test admin, LP, GP, and analyst roles easily

## Quick Start

### 1. Development Panel

In development mode, you'll see a floating "Dev Auth Panel" in the bottom-right corner:

- **Switch Users**: Instantly switch between different dev users
- **Current User**: See which dev user is currently active
- **Role Testing**: Test different roles (admin, LP, GP, analyst)
- **Subscription Testing**: Test different subscription tiers

### 2. Using Dev Users

The system provides pre-configured dev users:

- **Admin** (`admin@dev.local`) - Full access, institutional tier
- **LP** (`lp@dev.local`) - Limited partner, institutional tier
- **GP** (`gp@dev.local`) - General partner, professional tier
- **Analyst** (`analyst@dev.local`) - Analyst role, free tier

### 3. Function Integration

Update your Convex functions to use the development authentication wrapper:

```typescript
import { withDevAuth } from "../lib/withDevAuth";

export const myFunction = query({
  args: {},
  handler: withDevAuth(async (ctx) => {
    // This function now works in both dev and production
    const userId = await ctx.auth.getUserIdentity()?.subject;
    // ... rest of your function logic
  }),
});
```

## Detailed Usage

### Development Authentication Wrappers

#### Basic Wrapper: `withDevAuth`

```typescript
import { withDevAuth } from "../lib/withDevAuth";

export const getData = query({
  args: {},
  handler: withDevAuth(async (ctx) => {
    // Works in both development and production
    const userId = await ctx.auth.getUserIdentity()?.subject;
    // ... your logic
  }),
});
```

#### Role-Based Wrapper: `withRoleAuth`

```typescript
import { withRoleAuth } from "../lib/withDevAuth";

export const adminOnlyFunction = query({
  args: {},
  handler: withRoleAuth("admin", async (ctx) => {
    // Only works for admin users (dev or real)
    // ... admin-only logic
  }),
});
```

#### Subscription Tier Wrapper: `withTierAuth`

```typescript
import { withTierAuth } from "../lib/withDevAuth";

export const institutionalFunction = query({
  args: {},
  handler: withTierAuth("institutional", async (ctx) => {
    // Only works for institutional tier users
    // ... institutional-only logic
  }),
});
```

### Frontend Integration

#### Development Context

```typescript
import { useDevAuth } from "../contexts/DevAuthContext";

function MyComponent() {
  const { currentDevUser, isDevMode, switchToDevUser } = useDevAuth();

  if (isDevMode) {
    return (
      <div>
        <p>Current dev user: {currentDevUser?.name}</p>
        <button onClick={() => switchToDevUser("admin")}>
          Switch to Admin
        </button>
      </div>
    );
  }

  // Normal component logic
}
```

#### Development Guards

```typescript
import { DevAuthGuard, AdminOnly, LPOnly } from "../components/dev/DevAuthGuard";

function AdminPanel() {
  return (
    <AdminOnly fallback={<div>Admin access required</div>}>
      <div>Admin-only content</div>
    </AdminOnly>
  );
}

function LPDashboard() {
  return (
    <LPOnly>
      <div>LP dashboard content</div>
    </LPOnly>
  );
}
```

#### Development Indicators

```typescript
import { DevAuthIndicator } from "../components/dev/DevAuthIndicator";

function Header() {
  return (
    <div className="flex items-center gap-4">
      <h1>My App</h1>
      <DevAuthIndicator showDetails={true} />
    </div>
  );
}
```

## Development Workflow

### 1. Start Development

1. Run your development server
2. The dev auth panel appears automatically
3. Select a dev user to start testing

### 2. Test Different Roles

1. **Admin Testing**: Switch to admin user to test admin-only features
2. **LP Testing**: Switch to LP user to test limited partner features
3. **GP Testing**: Switch to GP user to test general partner features
4. **Analyst Testing**: Switch to analyst user to test basic features

### 3. Test Subscription Tiers

1. **Institutional**: Full access to all features
2. **Professional**: Enhanced features, limited access
3. **Free**: Basic features only

### 4. AI Assistant Integration

When working with AI assistants:

1. **Set a dev user** before asking the AI to help
2. **AI can see the app state** as that user
3. **AI can test functions** with that user's permissions
4. **Switch users** to test different scenarios

## Advanced Features

### Custom Dev Users

Add custom dev users in `convex/lib/devAuth.ts`:

```typescript
export const DEV_USERS: Record<string, DevUser> = {
  // ... existing users
  customUser: {
    id: "dev_custom_001",
    email: "custom@dev.local",
    name: "Custom User",
    role: "gp",
    subscriptionTier: "professional",
    isDevUser: true,
  },
};
```

### Development-Only Functions

Create functions that only work in development:

```typescript
import { withDevOnlyAuth } from "../lib/withDevAuth";

export const devOnlyFunction = query({
  args: {},
  handler: withDevOnlyAuth(async (ctx) => {
    // This function only works in development
    // Useful for debugging, testing, or AI assistance
  }),
});
```

### Context-Aware Development

Functions can behave differently in development:

```typescript
export const getUserData = query({
  args: {},
  handler: withDevAuth(async (ctx) => {
    const userId = await ctx.auth.getUserIdentity()?.subject;
    const user = await ctx.db.get(userId);

    // In development, include additional debug info
    if (ctx.devUser) {
      return {
        ...user,
        isDevUser: true,
        devUserInfo: {
          role: ctx.devUser.role,
          subscriptionTier: ctx.devUser.subscriptionTier,
        },
      };
    }

    // In production, return normal user data
    return user;
  }),
});
```

## Best Practices

### 1. Function Design

- **Always use `withDevAuth`** for new functions
- **Update existing functions** to use dev auth wrappers
- **Test with different roles** during development
- **Use role-based wrappers** for permission-sensitive functions

### 2. Development Workflow

- **Start with a dev user** before coding
- **Switch users frequently** to test different scenarios
- **Use the dev panel** to quickly change contexts
- **Test edge cases** with different user types

### 3. AI Assistant Usage

- **Set a dev user** before asking AI for help
- **Explain the current user context** to the AI
- **Switch users** to test AI suggestions
- **Use AI to test different user scenarios**

### 4. Production Safety

- **Dev auth only works in development** - automatically disabled in production
- **No security concerns** - production uses real authentication
- **Easy to remove** - dev auth wrappers are transparent in production

## Troubleshooting

### Common Issues

1. **Dev panel not showing**: Check that you're in development mode
2. **Functions still require auth**: Make sure you're using `withDevAuth`
3. **AI can't see app state**: Set a dev user before asking AI for help
4. **Role restrictions not working**: Check that you're using the correct role wrapper

### Debug Tips

1. **Check current dev user** in the dev panel
2. **Verify function wrappers** are using `withDevAuth`
3. **Test with different users** to isolate issues
4. **Use browser dev tools** to inspect the dev user context

## Migration Guide

### Updating Existing Functions

1. **Import the wrapper**:

   ```typescript
   import { withDevAuth } from "../lib/withDevAuth";
   ```

2. **Wrap your handler**:

   ```typescript
   // Before
   handler: async (ctx) => {
     const userId = await getAuthUserId(ctx);
     // ... logic
   };

   // After
   handler: withDevAuth(async (ctx) => {
     const userId = await ctx.auth.getUserIdentity()?.subject;
     // ... logic
   });
   ```

3. **Test in development** with different dev users

### Adding to Frontend

1. **Wrap your app** with `DevAuthProvider`
2. **Add dev components** where needed
3. **Use dev hooks** for user context
4. **Test with different users**

## Security Notes

- **Development only** - Dev auth is automatically disabled in production
- **No real authentication** - Dev users are not real users
- **Local storage** - Dev user state is stored locally
- **Easy cleanup** - Clear dev user state when needed

This development authentication system solves the core pain points of developing with authenticated Convex functions while maintaining security and production readiness.
