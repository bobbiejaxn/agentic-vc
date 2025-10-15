Here is a handbook section, optimized for your agentic VC operating system. This update prioritizes semantic, text-based information architecture, extremely sparse icon and color usage, and strict use of mono font for financial numbers—all within a Scandinavian minimalism framework.[1][2][3][4][5]

---

## Agentic VC OS UI/UX Handbook — Advanced Scandinavian Minimalism

### Quick Start Implementation Guide

**For Immediate Implementation:**

1. **Install Required Fonts** (via Google Fonts or local):
   - Playfair Display (400 weight) - Headings
   - Inter (400, 600 weights) - Body text
   - Space Mono (300, 400 weights) - Financial data

2. **Copy Base CSS** from Section 9.1 into your `globals.css` or `index.css`
   - Includes complete light/dark mode color system
   - HSL-based for production reliability
   - OKLCH variables for optional enhancement

3. **Key CSS Variables to Remember:**

   ```css
   hsl(var(--background))  /* Main background color */
   hsl(var(--foreground))  /* Main text color */
   hsl(var(--card))        /* Card/container background */
   hsl(var(--border))      /* Subtle borders */
   hsl(var(--muted-foreground))  /* Secondary text */
   ```

4. **Component Classes Ready to Use:**
   - `.financial-data` - Apply to all monetary values
   - `.scandinavian-card` - Apply to card containers
   - `.scandinavian-button` - Apply to buttons
   - `.scandinavian-nav` - Apply to navigation items

5. **Key Principles to Follow:**
   - 60/30/10 color distribution (neutral/complementary/accent)
   - 8pt grid spacing (8, 16, 24, 32, 40, 48px)
   - 4 font sizes, 2-3 font weights maximum
   - Rounded corners (8-12px) for organic feel
   - `duration-200` transitions for all hover states

---

### 1. Semantic Text-Driven Interfaces

- Prioritize clear, meaningful text labels and messaging over icons.[2][1]
- Structure navigation and actions using well-chosen, unambiguous words instead of symbol-based cues.
- If icons are unavoidable (e.g., status or quick actions), incorporate them very sparsely—never as a replacement for essential labels.[1]
- All actionable UI controls must describe their function with semantic text; icons are purely supplementary.
- Use uppercase labels with letter-spacing for sophisticated categorization (e.g., "TOTAL PORTFOLIO VALUE").

### 2. Systematic Color Framework with Scandinavian Warmth

- Use an extremely muted, almost monochrome palette—shades of white, grey, and black form the core, evoking Scandinavian calm.[1]
- **60/30/10 Color Distribution** (Scandinavian "Lagom" balance):
  - **60%**: Neutral color (white/light gray) - Primary backgrounds, cards, containers
  - **30%**: Complementary color (dark gray/black) - Text, icons, subtle UI elements
  - **10%**: Minimal accent color - Critical focus states, rare error/success cues only
- **Advanced Principle**: Use warmer, more human grays rather than harsh digital grays for a more approachable feel.
- **Color Format Options**:
  - **OKLCH** (Preferred): Modern color space with better perceptual accuracy and accessibility
  - **HSL** (Production-Proven): Widely supported, reliable fallback for complex applications
- Avoid busy gradients, color backgrounds, or non-functional decoration.
- Implement subtle transparency effects (`bg-white/80 backdrop-blur-sm`) for modern glass aesthetics.
- **Color Restraint**: Never exceed the 10% accent color threshold to maintain visual calm.

**Dark Mode — Warmer Scandinavian Grays:**

Dark mode should feel **warm and human-friendly**, not harsh or overly digital. Key principles:

- **Background**: Use warmer dark gray (`hsl(0 0% 8%)`) instead of pure black
- **Foreground**: Softer white (`hsl(0 0% 92%)`) for better readability than harsh white
- **Cards/Surfaces**: Slightly lighter than background (`hsl(0 0% 10%)`) for subtle contrast
- **Borders**: Warmer gray (`hsl(0 0% 20%)`) instead of cold gray
- **Muted Text**: Softer gray (`hsl(0 0% 65%)`) for comfortable reading

**Light Mode — Maximum Restraint:**

- **Background**: Pure white (`hsl(0 0% 100%)`)
- **Foreground**: Dark gray (`hsl(0 0% 9%)`)
- **Cards/Surfaces**: Pure white with subtle borders
- **Borders**: Light gray (`hsl(0 0% 89%)`)
- **Muted Text**: Medium gray (`hsl(0 0% 45%)`)

**Status Colors (Use Sparingly - 10% Rule):**

- **Success**: Green (`hsl(142 71% 45%)`) - confirmations, completed states
- **Destructive**: Red (`hsl(0 84% 60%)` light, `hsl(0 62.8% 30.6%)` dark) - errors, deletions
- **Warning**: Orange (`hsl(38 92% 50%)`) - cautions, pending states

### 3. Typography Hierarchy — Font Family System

**Font Pairings for Scandinavian Elegance:**

- **Headings**: Playfair Display (serif) - Provides sophisticated, timeless authority
  - Weight: 400 (Regular) for all heading levels
  - Use case: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, brand elements
- **Body Text**: Inter (sans-serif) - Clean, highly legible modern typeface
  - Weights: Regular (400) for body, Semibold (600) for emphasis
  - Use case: Paragraphs, UI labels, navigation, buttons
- **Financial Data**: Space Mono (monospace) - Perfect tabular alignment
  - **Mandatory** for all numerals, especially financials and tabular data[3][4][5]
  - Letter-spacing: `-0.025em` for optimal readability
  - Weight: `font-light` (300) for primary financial figures
  - Use case: Currency amounts, percentages, metrics, data tables

**Implementation Pattern:**

```css
/* Headings - Playfair Display */
h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: var(--font-playfair), serif;
  font-weight: 400;
}

/* Body - Inter */
body {
  font-family: var(--font-inter), system-ui, sans-serif;
}

/* Financial Data - Space Mono */
.financial-data {
  font-family:
    var(--font-space-mono), "SF Mono", "Monaco", "Inconsolata", "Roboto Mono",
    monospace;
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum";
  letter-spacing: -0.025em;
}
```

### 4. Systematic Typography and Layout

- Build hierarchy using type size, weight, and semantic naming—never add typographic flourish or multiple font families.[2][1]
- **4-Size Typography System** (Scandinavian "Lagom" approach):
  - **Size 1**: Large headings (3xl, 2xl) - Primary page titles and major sections
  - **Size 2**: Subheadings (xl, lg) - Section headers and important content
  - **Size 3**: Body text (base, sm) - Standard content and descriptions
  - **Size 4**: Small text/labels (xs) - Captions, metadata, and secondary information
- **2-Weight System**:
  - **Semibold**: For headings, emphasis, and financial data labels
  - **Regular**: For body text and general content
- **Financial Data Typography**:
  - Use `font-light` for primary financial data display
  - Apply `font-normal` for body text (avoid `font-medium` unless necessary)
  - Implement `tracking-tight` for headers
  - Use `uppercase tracking-wide` for labels
- **8pt Grid System** (Scandinavian mathematical harmony):
  - All spacing values must be divisible by 8 or 4 (8, 16, 24, 32, 40, 48px)
  - Use generous padding (`p-8`, `p-10`, `p-12`) for breathing room
  - Apply consistent gaps (`gap-4`, `gap-6`, `gap-8`) for element relationships
  - Create visual rhythm through systematic spacing patterns
- Let negative space define separation—group by whitespace, not lines or colored boxes; this increases legibility and reduces cognitive load.[1]
- Responsive adaptation is achieved through size and semantic scale, not through visual ornamentation.

### 5. Sophisticated Micro-Interactions

- **Gentle Transitions**: All interactions use `duration-200` for smooth, imperceptible changes.
- **Hover States**: Implement subtle background changes with transparency (`hover:bg-gray-50/30`).
- **Card Interactions**: Use border color changes instead of shadows for subtle feedback.
- **Navigation**: Add rounded corners (`rounded-r-md`) for organic, human-friendly feel.

### 6. Scandinavian Design Philosophy

- **"Lagom" (Just Right)**: Perfect balance of elements, not too much, not too little.
- **"Hygge" (Cozy)**: Warm, human-friendly colors and gentle interactions.
- **"Functional Beauty"**: Every element serves a purpose while being beautiful.
- **"Quiet Confidence"**: Sophisticated without being showy.
- **"Human-Centered"**: Designed for comfort and ease of use.

### 7. Component-Specific Patterns

#### 7.1 Card Design Principles

- **Borders Over Shadows**: Use subtle borders (`border-gray-100` light, `border-gray-800` dark) instead of heavy shadows
- **Rounded Corners**: Apply `rounded-xl` (12px) for organic, human-friendly feel
- **Hover States**: Gentle border color changes on hover, not shadow or scale transformations
- **Internal Spacing**: Consistent padding (`p-6` = 24px, divisible by 8)
- **Visual Hierarchy**: Through typography and spacing, not decoration

**Implementation Pattern:**

```css
.scandinavian-card {
  border: 1px solid hsl(var(--border));
  border-radius: 12px; /* Organic, rounded corners */
  background: hsl(var(--card));
  color: hsl(var(--card-foreground));
  transition: all 0.2s ease;
  padding: 1.5rem; /* 24px - divisible by 8 */
}

.scandinavian-card:hover {
  border-color: hsl(var(--border)); /* Subtle change */
}
```

#### 7.2 Navigation and Sidebar Patterns

**Sidebar Color System:**

- Light Mode: Almost white (`hsl(0 0% 98%)`) with dark text
- Dark Mode: Warmer dark gray (`hsl(0 0% 8%)`) with soft white text
- Active States: Subtle background change (`hsl(0 0% 96%)` light, `hsl(0 0% 18%)` dark)
- Borders: Minimal, same as card borders

**Navigation Micro-Interactions:**

- **Rounded Right Corners**: `rounded-r-md` (8px) for organic feel on nav items
- **Gentle Transitions**: `duration-200` for all hover/active states
- **Subtle Background**: Transparent background with slight fill on hover
- **No Heavy Indicators**: Avoid thick left borders or aggressive highlighting

**Sidebar Variables:**

```css
:root {
  /* Light Mode Sidebar */
  --sidebar: hsl(0 0% 98%);
  --sidebar-foreground: hsl(0 0% 9%);
  --sidebar-accent: hsl(0 0% 96%); /* Active/hover state */
  --sidebar-border: hsl(0 0% 89%);
}

.dark {
  /* Dark Mode Sidebar - Warmer grays */
  --sidebar: hsl(0 0% 8%);
  --sidebar-foreground: hsl(0 0% 92%);
  --sidebar-accent: hsl(0 0% 18%); /* Active/hover state */
  --sidebar-border: hsl(0 0% 20%);
}
```

#### 7.3 Button Patterns

**Primary Buttons:**

- Background: Dark gray (`hsl(0 0% 9%)`)
- Text: Almost white (`hsl(0 0% 98%)`)
- Hover: Slightly lighter background with gentle transition
- Rounded: `` (8px)

**Secondary Buttons:**

- Background: Light gray (`hsl(0 0% 96%)`)
- Text: Dark gray (`hsl(0 0% 9%)`)
- Hover: Slightly darker background
- Same rounded corners as primary

**Button Implementation:**

```css
.scandinavian-button {
  transition: all 0.2s ease;
  border-radius: 8px;
  padding: 0.5rem 1rem; /* 8px 16px - divisible by 8 */
}

.scandinavian-button:hover {
  background: oklch(0.98 0 0); /* Subtle change */
  border-color: oklch(0.8 0 0);
}
```

### 8. Modern Component Integration (2025 Best Practices)

#### 8.1 Shadcn/UI Integration

**Why Shadcn/UI for Scandinavian Design:**

- **Accessibility-First**: Built-in ARIA support and keyboard navigation
- **Customizable**: Perfect for Scandinavian minimalism customization
- **Modern**: Aligns with 2025 design trends and React best practices
- **Consistent**: Ensures design system coherence across components

**Essential Shadcn Components for VC Platform:**

```bash
# Core components for financial data
npx shadcn@latest add table
npx shadcn@latest add card
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add select
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add badge
npx shadcn@latest add progress
npx shadcn@latest add separator
npx shadcn@latest add skeleton
npx shadcn@latest add toast
```

**Scandinavian Customization Pattern:**

```tsx
// Custom shadcn components with Scandinavian styling
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Financial data table with Space Mono
<Card className="scandinavian-card">
  <CardHeader>
    <CardTitle className="font-playfair text-lg">
      Portfolio Performance
    </CardTitle>
  </CardHeader>
  <CardContent>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="font-semibold">Fund</TableHead>
          <TableHead className="text-right font-semibold">NAV</TableHead>
          <TableHead className="text-right font-semibold">Return</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Fund I</TableCell>
          <TableCell className="text-right financial-data">€2.45M</TableCell>
          <TableCell className="text-right financial-data text-green-600">
            +18.5%
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </CardContent>
</Card>;
```

#### 8.2 Advanced Data Tables (2025 Standards)

**TanStack Table Integration:**

```tsx
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

// Financial data table with Scandinavian styling
const FinancialDataTable = ({ data }) => {
  const columns = [
    {
      accessorKey: "fundName",
      header: "Fund Name",
      cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
    },
    {
      accessorKey: "nav",
      header: "NAV",
      cell: ({ getValue }) => (
        <span className="financial-data text-right">
          {new Intl.NumberFormat("en-EU", {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 0,
          }).format(getValue())}
        </span>
      ),
    },
    {
      accessorKey: "return",
      header: "Return",
      cell: ({ getValue }) => {
        const value = getValue();
        return (
          <span
            className={`financial-data text-right ${
              value >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {value >= 0 ? "+" : ""}
            {value.toFixed(1)}%
          </span>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="scandinavian-card">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="font-semibold text-muted-foreground"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
```

**Table Features for 2025:**

- **Virtual Scrolling**: For large datasets (react-window integration)
- **Column Resizing**: User-controlled column widths
- **Advanced Filtering**: Multi-column search with debouncing
- **Export Functionality**: CSV/Excel export with proper formatting
- **Responsive Design**: Mobile-first table layouts
- **Accessibility**: Full keyboard navigation and screen reader support

#### 8.3 Modern Chart Integration

**Recharts + Scandinavian Styling:**

```tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const PortfolioChart = ({ data }) => (
  <Card className="scandinavian-card">
    <CardHeader>
      <CardTitle className="font-playfair text-lg">
        Portfolio Performance
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            strokeOpacity={0.3}
          />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            axisLine={{ stroke: "hsl(var(--border))" }}
            tickFormatter={(value) => `€${(value / 1000000).toFixed(1)}M`}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--foreground))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--foreground))", strokeWidth: 2, r: 4 }}
            activeDot={{
              r: 6,
              stroke: "hsl(var(--foreground))",
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);
```

**Chart Libraries for 2025:**

- **Recharts**: React-native charts with excellent TypeScript support
- **Chart.js**: Lightweight with great performance
- **D3.js**: For custom, complex visualizations
- **Observable Plot**: Modern grammar of graphics approach

#### 8.4 Data Visualization and Visual Elements

#### 8.1 Chart Design Principles

- **Monochromatic Charts**: Use only grayscale variations (gray-100 to gray-800) for all data visualizations
- **Minimal Visual Weight**: Avoid heavy borders, shadows, or decorative elements in charts
- **Semantic Data Representation**: Charts should tell a story, not just display numbers
- **Financial Data Priority**: All monetary values must use monospaced fonts (Space Mono) for perfect alignment

#### 8.2 Chart Types and Implementation

- **Bar Charts**: Simple horizontal or vertical bars with subtle gray variations
- **Line Charts**: Clean lines with minimal styling, no decorative markers
- **Pie Charts**: Represented as clean circles with minimal color differentiation
- **Timeline Visualizations**: Simple progress indicators with connected elements
- **Performance Charts**: Monochromatic bar representations for portfolio tracking

#### 8.3 Visual Hierarchy in Data

- **Primary Data**: Use `font-light` weight with Space Mono for financial figures
- **Secondary Labels**: Standard font weight with muted gray colors
- **Chart Titles**: Uppercase labels with letter-spacing for sophisticated categorization
- **Data Context**: Always provide meaningful context, not just raw numbers

#### 8.4 Image and Icon Guidelines

- **Ultra-Sparse Icon Usage**: Icons only when absolutely necessary for quick recognition
- **Semantic Icons**: Use icons that have clear, universal meaning (upload, download, settings)
- **Icon Styling**: Simple, outlined icons with consistent stroke weight
- **No Decorative Images**: Avoid stock photos, illustrations, or decorative graphics
- **Functional Images Only**: Charts, diagrams, and data visualizations serve a purpose

#### 8.5 Visual Data Examples

```
Portfolio Performance Chart:
- Monochromatic bars (gray-300 to gray-800)
- Space Mono font for all financial data
- Clean grid lines with subtle gray-100
- No decorative elements or colors

Sector Allocation:
- Simple circular representation
- Minimal gray dots for legend
- Total value prominently displayed in center
- Percentage breakdown with monospaced fonts

Processing Timeline:
- Connected circular indicators
- Simple icons for each stage
- Subtle connecting lines
- Status text in standard font
```

### 9. Production-Ready CSS Implementation

#### 9.1 Complete Color System (HSL + OKLCH Hybrid)

```css
@tailwind base;
@custom-variant dark (&:is(.dark *));
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Monochromatic Scandinavian Minimalism - Pure Grayscale System */
    /* Light Mode Colors - Maximum restraint and sophistication */
    --background: 0 0% 100%; /* Pure white - 60% */
    --foreground: 0 0% 9%; /* Dark gray - 30% */
    --card: 0 0% 100%;
    --card-foreground: 0 0% 9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 9%;
    --primary: 0 0% 9%; /* Primary actions */
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96%; /* Subtle backgrounds */
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96%; /* Muted backgrounds */
    --muted-foreground: 0 0% 45%; /* Muted text */
    --accent: 0 0% 96%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84% 60%; /* Error red - 10% rule */
    --destructive-foreground: 0 0% 98%;
    --success: 142 71% 45%; /* Success green - 10% rule */
    --success-foreground: 0 0% 98%;
    --warning: 38 92% 50%; /* Warning orange - 10% rule */
    --warning-foreground: 0 0% 9%;
    --border: 0 0% 89%; /* Subtle borders */
    --input: 0 0% 89%;
    --ring: 0 0% 9%; /* Focus rings */
    --radius: 0.5rem; /* 8px - base border radius */
  }

  .dark {
    /* Dark Mode Colors - Warmer Scandinavian grays for human-friendly feel */
    --background: 0 0% 8%; /* Warmer dark gray instead of harsh black */
    --foreground: 0 0% 92%; /* Softer white for better readability */
    --card: 0 0% 10%; /* Slightly lighter than background */
    --card-foreground: 0 0% 92%;
    --popover: 0 0% 10%;
    --popover-foreground: 0 0% 92%;
    --primary: 0 0% 92%; /* Soft white for primary elements */
    --primary-foreground: 0 0% 8%;
    --secondary: 0 0% 18%; /* Warmer gray for secondary elements */
    --secondary-foreground: 0 0% 92%;
    --muted: 0 0% 18%;
    --muted-foreground: 0 0% 65%; /* Softer muted text */
    --accent: 0 0% 18%;
    --accent-foreground: 0 0% 92%;
    --destructive: 0 62.8% 30.6%; /* Darker red for dark mode */
    --destructive-foreground: 0 0% 98%;
    --success: 142 71% 45%;
    --success-foreground: 0 0% 9%;
    --warning: 38 92% 50%;
    --warning-foreground: 0 0% 9%;
    --border: 0 0% 20%; /* Warmer border color */
    --input: 0 0% 20%;
    --ring: 0 0% 75%; /* Softer ring color */
  }
}

@layer base {
  * {
    border-color: hsl(var(--border));
  }
  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    font-family: var(--font-inter), system-ui, sans-serif;
  }

  /* Modern OKLCH Color System for Better Perceptual Accuracy (Optional Enhancement) */
  :root {
    --oklch-background: oklch(1 0 0); /* Pure white */
    --oklch-foreground: oklch(0.145 0 0); /* Dark gray */
    --oklch-card: oklch(1 0 0); /* White cards */
    --oklch-muted: oklch(0.96 0 0); /* Light gray */
    --oklch-border: oklch(0.9 0 0); /* Subtle borders */
    --oklch-accent: oklch(0.4 0.15 0); /* Minimal accent */
  }

  .dark {
    --oklch-background: oklch(0.12 0 0); /* Warmer dark gray */
    --oklch-foreground: oklch(0.92 0 0); /* Softer white */
    --oklch-card: oklch(0.15 0 0); /* Subtle card contrast */
    --oklch-muted: oklch(0.25 0 0); /* Warmer muted background */
    --oklch-border: oklch(0.3 0 0); /* Softer borders */
    --oklch-accent: oklch(0.2 0 0); /* Minimal accent */
  }

  /* Typography System - Playfair for headings, Inter for body */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: var(--font-playfair), serif;
    font-weight: 400;
  }

  /* Financial data monospaced font class - Space Mono for perfect alignment */
  .financial-data {
    font-family:
      var(--font-space-mono), "SF Mono", "Monaco", "Inconsolata", "Roboto Mono",
      monospace;
    font-variant-numeric: tabular-nums;
    font-feature-settings: "tnum";
    letter-spacing: -0.025em;
  }

  /* Tabular numbers utility */
  .tabular-nums {
    font-variant-numeric: tabular-nums;
    font-feature-settings: "tnum";
  }
}

/* Sidebar Colors - No blue tones */
:root {
  --sidebar: 0 0% 98%;
  --sidebar-foreground: 0 0% 9%;
  --sidebar-primary: 0 0% 9%;
  --sidebar-primary-foreground: 0 0% 98%;
  --sidebar-accent: 0 0% 96%;
  --sidebar-accent-foreground: 0 0% 9%;
  --sidebar-border: 0 0% 89%;
  --sidebar-ring: 0 0% 9%;
}

.dark {
  --sidebar: 0 0% 8%;
  --sidebar-foreground: 0 0% 92%;
  --sidebar-primary: 0 0% 92%;
  --sidebar-primary-foreground: 0 0% 8%;
  --sidebar-accent: 0 0% 18%;
  --sidebar-accent-foreground: 0 0% 92%;
  --sidebar-border: 0 0% 20%;
  --sidebar-ring: 0 0% 75%;
}
```

#### 9.2 Light/Dark Mode Implementation

**CSS Variables Usage:**

```css
/* Always use hsl() wrapper when applying colors */
background-color: hsl(var(--background));
color: hsl(var(--foreground));
border: 1px solid hsl(var(--border));
```

**Tailwind Integration:**

```css
/* Add to your tailwind.config.js */
module.exports = {
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        destructive: 'hsl(var(--destructive))',
        'destructive-foreground': 'hsl(var(--destructive-foreground))',
        success: 'hsl(var(--success))',
        'success-foreground': 'hsl(var(--success-foreground))',
        warning: 'hsl(var(--warning))',
        'warning-foreground': 'hsl(var(--warning-foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        sidebar: 'hsl(var(--sidebar))',
        'sidebar-foreground': 'hsl(var(--sidebar-foreground))',
        'sidebar-primary': 'hsl(var(--sidebar-primary))',
        'sidebar-primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
        'sidebar-accent': 'hsl(var(--sidebar-accent))',
        'sidebar-accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
        'sidebar-border': 'hsl(var(--sidebar-border))',
        'sidebar-ring': 'hsl(var(--sidebar-ring))',
      },
    },
  },
}
```

**JavaScript Toggle Implementation:**

```javascript
// Simple dark mode toggle
function toggleDarkMode() {
  document.documentElement.classList.toggle("dark");
  localStorage.setItem(
    "darkMode",
    document.documentElement.classList.contains("dark")
  );
}

// Initialize dark mode from localStorage
if (localStorage.getItem("darkMode") === "true") {
  document.documentElement.classList.add("dark");
}

// System preference detection
if (
  window.matchMedia("(prefers-color-scheme: dark)").matches &&
  !localStorage.getItem("darkMode")
) {
  document.documentElement.classList.add("dark");
}
```

#### 9.3 Component Styling Utilities

```css
/* Scandinavian card styling with rounded corners */
.scandinavian-card {
  border: 1px solid hsl(var(--border));
  border-radius: 12px; /* Rounded corners for organic, human-friendly feel */
  background: hsl(var(--card));
  color: hsl(var(--card-foreground));
  transition: all 0.2s ease; /* Gentle transitions per handbook */
  padding: 1.5rem; /* 24px - divisible by 8 */
}

.scandinavian-card:hover {
  border-color: hsl(var(--border));
}

/* 8pt Grid System Implementation */
.scandinavian-spacing {
  padding: 2rem; /* 32px - divisible by 8 */
  gap: 1.5rem; /* 24px - divisible by 8 */
  margin: 1rem; /* 16px - divisible by 8 */
}

/* Micro-interactions for buttons */
.scandinavian-button {
  transition: all 0.2s ease;
  border-radius: 8px; /* Rounded corners for organic feel */
}

.scandinavian-button:hover {
  background: oklch(0.98 0 0); /* Subtle background change */
  border-color: oklch(0.8 0 0); /* Slightly darker border */
}

/* Navigation micro-interactions */
.scandinavian-nav {
  border-radius: 0 8px 8px 0; /* Rounded right corners */
  transition: all 0.2s ease;
}

.scandinavian-nav:hover {
  background: hsl(var(--sidebar-accent));
}
```

#### 9.4 Chart Component Structure

```tsx
// Portfolio Performance Chart Example
<Card className="scandinavian-card">
  <CardHeader className="pb-3">
    <CardTitle className="text-xs font-normal text-gray-500 uppercase tracking-wide">
      Portfolio Performance
    </CardTitle>
  </CardHeader>
  <CardContent className="pt-0">
    <div className="space-y-4">
      {/* Simple performance visualization */}
      <div className="h-32 bg-gray-50 rounded-md flex items-end justify-between px-4 py-3">
        {/* Chart bars with monochromatic styling */}
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">Portfolio Value</span>
        <span className="financial-data font-medium text-gray-900">
          €2.45M (+18.5% YoY)
        </span>
      </div>
    </div>
  </CardContent>
</Card>
```

#### 9.5 Visual Data Best Practices

- **Data Density**: Keep charts simple with maximum 6-8 data points
- **Color Restraint**: Use only 3-4 gray variations maximum
- **Interactive States**: Subtle hover effects with border color changes
- **Responsive Design**: Charts should scale gracefully on mobile devices
- **Loading States**: Show skeleton placeholders during data fetching

#### 9.6 Specific Chart Type Guidelines

**Portfolio Performance Charts:**

- Use horizontal or vertical bar charts with monochromatic styling
- Show time progression (monthly/quarterly) with subtle gray variations
- Include YoY percentage change prominently displayed
- Maximum 6-8 data points for clarity

**Sector Allocation Visualizations:**

- Simple circular representation with total value in center
- Use minimal gray dots for legend (gray-300 to gray-600)
- Percentage breakdown with monospaced fonts
- Avoid complex pie chart segments

**Fund Performance Comparison:**

- Horizontal bar charts for NAV vs Called capital
- Proportional scaling based on fund values
- Side-by-side comparison with consistent styling
- Clear labels with financial data in Space Mono

**Processing Timeline Visualizations:**

- Connected circular indicators with simple icons
- Subtle connecting lines between stages
- Status text in standard font
- Current progress clearly indicated

**Real-time Metrics Cards:**

- Grid layout with consistent spacing
- Monospaced fonts for all numerical data
- Subtle background colors (gray-50 to gray-100)
- Clear labels with uppercase styling

#### 9.7 Comprehensive Accessibility Standards

**Visual Accessibility:**

- **ARIA Labels**: All charts must have descriptive aria-labels (`aria-label`, `aria-labelledby`)
- **Screen Reader Support**: Provide text alternatives for visual data with `aria-describedby`
- **Color Contrast**: Maintain WCAG AA compliance (4.5:1 ratio) even with grayscale palette
- **Focus Indicators**: Clear focus states for interactive chart elements with visible outlines
- **Keyboard Navigation**: Ensure charts are navigable with keyboard (Tab, Enter, Arrow keys)

**Financial Data Accessibility:**

- **Monospaced Font Support**: Ensure Space Mono renders correctly across all screen readers
- **Data Table Alternatives**: Provide structured data tables for complex financial charts
- **Currency Formatting**: Use proper semantic markup for monetary values
- **Percentage Indicators**: Clear labeling of percentage changes and ratios

**Scandinavian Design Accessibility:**

- **High Contrast Mode**: Ensure design works in high contrast accessibility modes
- **Reduced Motion**: Respect `prefers-reduced-motion` for subtle animations
- **Text Scaling**: Support up to 200% text scaling without horizontal scrolling
- **Touch Targets**: Minimum 44px touch targets for mobile accessibility

### 10. Visual Data Philosophy in Scandinavian Design

#### 10.1 The "Lagom" Principle for Charts

- **Just Enough Information**: Charts should provide exactly the right amount of data—not too much, not too little
- **Purposeful Visualization**: Every chart element must serve a clear purpose in the user's decision-making process
- **Reduced Cognitive Load**: Visual data should make complex information simple to understand at a glance

#### 10.2 "Hygge" in Data Presentation

- **Warm, Human-Friendly**: Use warmer grays rather than harsh digital colors for a more approachable feel
- **Gentle Interactions**: Subtle hover effects and transitions that feel natural and comforting
- **Cozy Information Architecture**: Data should feel organized and comfortable to navigate

#### 10.3 "Functional Beauty" in Visualizations

- **Every Element Serves a Purpose**: No decorative elements that don't contribute to data understanding
- **Beautiful Simplicity**: Charts should be aesthetically pleasing through their clarity, not ornamentation
- **Elegant Data Hierarchy**: Visual weight should guide the eye to the most important information

#### 10.4 "Quiet Confidence" in Financial Data

- **Professional Restraint**: Financial data should feel trustworthy and serious without being intimidating
- **Sophisticated Presentation**: Use typography and spacing to create authority without arrogance
- **Calm Assurance**: Users should feel confident in the data's accuracy and presentation

### 11. Systematic Implementation Checklist

#### 11.1 Core Design Principles Validation

- [ ] **Typography**: Uses only 4 font sizes and 2 font weights (Semibold, Regular)
- [ ] **Spacing**: All spacing values are divisible by 8 or 4 (8, 16, 24, 32, 40, 48px)
- [ ] **Colors**: Follows 60/30/10 color distribution (60% neutral, 30% complementary, 10% accent)
- [ ] **Structure**: Elements are logically grouped with consistent spacing
- [ ] **Financial Data**: Space Mono font for all monetary values with proper alignment

#### 11.2 Technical Implementation Standards

- [ ] **OKLCH Colors**: Uses modern OKLCH color variables for better perceptual accuracy
- [ ] **@theme Directive**: Leverages @theme directive for systematic color management
- [ ] **8pt Grid System**: All spacing follows mathematical harmony (divisible by 8)
- [ ] **Component Architecture**: Proper data-slot attributes for component styling
- [ ] **Accessibility**: WCAG AA compliance with proper ARIA labels and contrast ratios

#### 11.3 Scandinavian Philosophy Adherence

- [ ] **"Lagom" Balance**: Just enough information, not too much or too little
- [ ] **"Hygge" Warmth**: Warmer grays, gentle interactions, cozy information architecture
- [ ] **"Functional Beauty"**: Every element serves a purpose, beautiful simplicity
- [ ] **"Quiet Confidence"**: Professional restraint, sophisticated presentation
- [ ] **"Human-Centered"**: Designed for comfort and ease of use

### 12. Usability, Accessibility, and the Scandinavian Ethos

- Test with real users in realistic workflows—ensure that removing icons never impedes core navigation or task completion.[1]
- Text content should be accessible (clear contrast, no jargon), and layouts should gracefully expand for languages with longer word forms.
- Strive for quiet, unforced beauty—interfaces should feel calm, trustworthy, and effortless.[1]
- **Advanced Principle**: Create interfaces that embody "effortless sophistication"—where users feel confident and comfortable without being overwhelmed by visual noise.
- **Visual Data Accessibility**: Ensure all charts and visualizations are accessible to screen readers with proper ARIA labels and semantic markup.

---

### 13. 2025 UI Best Practices & Modern Patterns

#### 13.1 Advanced Interaction Patterns

**Micro-Interactions for 2025:**

```tsx
// Skeleton loading states
const SkeletonCard = () => (
  <Card className="scandinavian-card">
    <CardHeader>
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-6 w-1/2" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-32 w-full" />
    </CardContent>
  </Card>
);

// Progressive disclosure
const ProgressiveDataTable = ({ data }) => {
  const [expandedRows, setExpandedRows] = useState(new Set());

  return (
    <Table>
      {data.map((row, index) => (
        <TableRow key={index}>
          <TableCell>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setExpandedRows(
                  (prev) => new Set([...prev].filter((i) => i !== index))
                )
              }
            >
              {expandedRows.has(index) ? "−" : "+"}
            </Button>
          </TableCell>
          {/* Row content */}
        </TableRow>
      ))}
    </Table>
  );
};
```

**Smart Loading States:**

- **Skeleton Screens**: Show content structure while loading
- **Progressive Enhancement**: Load critical data first, details second
- **Optimistic Updates**: Update UI immediately, sync with server
- **Error Boundaries**: Graceful error handling with recovery options

#### 13.2 Accessibility Excellence (2025 Standards)

**Advanced ARIA Patterns:**

```tsx
// Financial data table with full accessibility
const AccessibleFinancialTable = ({ data }) => (
  <div role="region" aria-label="Portfolio performance data">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead scope="col" aria-sort="none">
            Fund Name
            <Button variant="ghost" size="sm" aria-label="Sort by fund name">
              ↕
            </Button>
          </TableHead>
          <TableHead scope="col" aria-sort="none">
            NAV (Net Asset Value)
            <Button variant="ghost" size="sm" aria-label="Sort by NAV">
              ↕
            </Button>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index} role="row">
            <TableCell
              role="cell"
              aria-describedby={`fund-${index}-description`}
            >
              {row.fundName}
            </TableCell>
            <TableCell
              role="cell"
              className="financial-data text-right"
              aria-label={`Net Asset Value: ${row.nav} euros`}
            >
              €{row.nav.toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);
```

**Accessibility Checklist for 2025:**

- [ ] **WCAG 2.2 AA Compliance**: Latest accessibility standards
- [ ] **Keyboard Navigation**: Full functionality without mouse
- [ ] **Screen Reader Support**: Proper ARIA labels and descriptions
- [ ] **Color Contrast**: 4.5:1 minimum ratio for all text
- [ ] **Focus Management**: Clear focus indicators and logical tab order
- [ ] **Reduced Motion**: Respect `prefers-reduced-motion` setting
- [ ] **High Contrast Mode**: Support for Windows high contrast
- [ ] **Voice Navigation**: Compatible with voice control software

#### 13.3 Performance Optimization (2025 Standards)

**Modern Performance Patterns:**

```tsx
// Virtual scrolling for large datasets
import { FixedSizeList as List } from "react-window";

const VirtualizedTable = ({ data }) => (
  <List height={400} itemCount={data.length} itemSize={50} itemData={data}>
    {({ index, style, data }) => (
      <div style={style}>
        <TableRow>
          <TableCell>{data[index].fundName}</TableCell>
          <TableCell className="financial-data">
            €{data[index].nav.toLocaleString()}
          </TableCell>
        </TableRow>
      </div>
    )}
  </List>
);

// Lazy loading with intersection observer
const LazyChart = ({ data }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {isVisible ? <PortfolioChart data={data} /> : <SkeletonCard />}
    </div>
  );
};
```

**Performance Best Practices:**

- **Code Splitting**: Lazy load components and routes
- **Bundle Optimization**: Tree shaking and dead code elimination
- **Image Optimization**: WebP format with fallbacks
- **Caching Strategies**: Service workers and intelligent caching
- **Database Optimization**: Efficient queries and indexing

#### 13.4 Mobile-First Design (2025 Standards)

**Responsive Table Patterns:**

```tsx
// Mobile-optimized financial table
const ResponsiveFinancialTable = ({ data }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className="space-y-4">
        {data.map((row, index) => (
          <Card key={index} className="scandinavian-card">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{row.fundName}</span>
                  <span className="financial-data">
                    €{row.nav.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Return</span>
                  <span
                    className={`financial-data ${
                      row.return >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {row.return >= 0 ? "+" : ""}
                    {row.return}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return <DesktopTable data={data} />;
};
```

**Mobile-First Checklist:**

- [ ] **Touch Targets**: Minimum 44px for all interactive elements
- [ ] **Gesture Support**: Swipe, pinch, and pull-to-refresh
- [ ] **Orientation Support**: Portrait and landscape layouts
- [ ] **Thumb Navigation**: Easy one-handed operation
- [ ] **Progressive Web App**: Offline functionality and app-like experience

#### 13.5 Modern State Management

**Zustand for Lightweight State:**

```tsx
import { create } from "zustand";

interface FinancialStore {
  funds: Fund[];
  selectedFund: string | null;
  filters: FilterState;
  setSelectedFund: (id: string) => void;
  updateFilters: (filters: Partial<FilterState>) => void;
}

const useFinancialStore = create<FinancialStore>((set) => ({
  funds: [],
  selectedFund: null,
  filters: { dateRange: "1Y", sortBy: "nav" },
  setSelectedFund: (id) => set({ selectedFund: id }),
  updateFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),
}));
```

**React Query for Server State:**

```tsx
import { useQuery } from "@tanstack/react-query";

const FinancialDashboard = () => {
  const {
    data: funds,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["funds"],
    queryFn: fetchFunds,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <SkeletonCard />;
  if (error) return <ErrorBoundary error={error} />;

  return <FinancialTable data={funds} />;
};
```

#### 13.6 Modern Development Workflow (2025)

**Essential Development Tools:**

```json
// package.json dependencies for 2025
{
  "dependencies": {
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-select": "^2.0.0",
    "@tanstack/react-query": "^5.0.0",
    "@tanstack/react-table": "^8.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "lucide-react": "^0.300.0",
    "recharts": "^2.8.0",
    "react-window": "^1.8.8",
    "tailwind-merge": "^2.0.0",
    "tailwindcss-animate": "^1.0.7",
    "zustand": "^4.4.0"
  },
  "devDependencies": {
    "@types/react-window": "^1.8.8",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "typescript": "^5.2.2"
  }
}
```

**Modern Build Configuration:**

```typescript
// tailwind.config.js for 2025
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // ... all color variables
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
        serif: ["var(--font-playfair)", ...fontFamily.serif],
        mono: ["var(--font-space-mono)", ...fontFamily.mono],
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-up": "slideUp 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

**Component Architecture Pattern:**

```tsx
// components/ui/financial-table.tsx
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FinancialTableProps {
  data: FinancialData[];
  className?: string;
  onRowClick?: (row: FinancialData) => void;
}

export const FinancialTable = ({
  data,
  className,
  onRowClick,
}: FinancialTableProps) => {
  return (
    <div className={cn("scandinavian-card", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Fund</TableHead>
            <TableHead className="text-right font-semibold">NAV</TableHead>
            <TableHead className="text-right font-semibold">Return</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={index}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onRowClick?.(row)}
            >
              <TableCell className="font-medium">{row.fundName}</TableCell>
              <TableCell className="text-right financial-data">
                €{row.nav.toLocaleString()}
              </TableCell>
              <TableCell
                className={`text-right financial-data ${
                  row.return >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {row.return >= 0 ? "+" : ""}
                {row.return}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
```

#### 13.7 Testing & Quality Assurance (2025)

**Component Testing with Vitest:**

```tsx
// __tests__/financial-table.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { FinancialTable } from "@/components/ui/financial-table";

const mockData = [
  { fundName: "Fund I", nav: 2450000, return: 18.5 },
  { fundName: "Fund II", nav: 1800000, return: -2.3 },
];

describe("FinancialTable", () => {
  it("renders financial data correctly", () => {
    render(<FinancialTable data={mockData} />);

    expect(screen.getByText("Fund I")).toBeInTheDocument();
    expect(screen.getByText("€2,450,000")).toBeInTheDocument();
    expect(screen.getByText("+18.5%")).toBeInTheDocument();
  });

  it("handles row clicks", () => {
    const onRowClick = vi.fn();
    render(<FinancialTable data={mockData} onRowClick={onRowClick} />);

    fireEvent.click(screen.getByText("Fund I"));
    expect(onRowClick).toHaveBeenCalledWith(mockData[0]);
  });

  it("applies correct styling for positive/negative returns", () => {
    render(<FinancialTable data={mockData} />);

    const positiveReturn = screen.getByText("+18.5%");
    const negativeReturn = screen.getByText("-2.3%");

    expect(positiveReturn).toHaveClass("text-green-600");
    expect(negativeReturn).toHaveClass("text-red-600");
  });
});
```

**Accessibility Testing:**

```tsx
// __tests__/accessibility.test.tsx
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { FinancialTable } from "@/components/ui/financial-table";

expect.extend(toHaveNoViolations);

describe("FinancialTable Accessibility", () => {
  it("should not have accessibility violations", async () => {
    const { container } = render(<FinancialTable data={mockData} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### 14. Quick Reference — Implementation Checklist

**Before Building Any Component:**

```markdown
Typography:
[ ] Playfair Display (400) for all headings
[ ] Inter (400/600) for body text and UI
[ ] Space Mono for all financial data (.financial-data class)
[ ] Max 4 font sizes used (xs, sm, base, lg, xl, 2xl)
[ ] Max 2-3 font weights (300, 400, 600)

Colors:
[ ] Using hsl(var(--background/foreground/card/border))
[ ] Following 60/30/10 distribution (neutral/complementary/accent)
[ ] Status colors (red/green/orange) used only when necessary
[ ] Dark mode support with warmer grays (8%, 10%, 18%, 20%)
[ ] No harsh blacks (#000) or whites (#fff) in dark mode

Spacing:
[ ] All padding/margin divisible by 8 or 4 (8, 16, 24, 32, 40, 48px)
[ ] Consistent gaps (gap-4, gap-6, gap-8)
[ ] Generous padding for breathing room (p-6, p-8)

Components:
[ ] Cards use border-gray-100 (not shadows)
[ ] Rounded corners ( = 8px, rounded-xl = 12px)
[ ] Hover transitions use duration-200
[ ] Navigation items have rounded-r-md
[ ] Buttons have

Interactions:
[ ] All transitions are subtle (duration-200)
[ ] Hover states change background/border, not scale/shadow
[ ] Focus states have clear visible rings
[ ] Interactive elements have min 44px touch targets

Accessibility:
[ ] ARIA labels on all charts and data visualizations
[ ] Color contrast meets WCAG AA (4.5:1 ratio)
[ ] Keyboard navigation supported
[ ] Screen reader alternatives for visual data
[ ] Respects prefers-reduced-motion
```

**Financial Data Checklist:**

```markdown
[ ] All monetary amounts use .financial-data class
[ ] Space Mono font with tabular-nums
[ ] Letter-spacing: -0.025em
[ ] Font-weight: 300 (light) for primary figures
[ ] Currency symbols and amounts aligned vertically
[ ] Percentage changes clearly indicated
```

**Card Component Checklist:**

```markdown
[ ] Border: 1px solid hsl(var(--border))
[ ] Background: hsl(var(--card))
[ ] Border-radius: 12px (rounded-xl)
[ ] Padding: 1.5rem (24px, divisible by 8)
[ ] Transition: all 0.2s ease
[ ] Hover: subtle border color change
```

**Navigation/Sidebar Checklist:**

```markdown
[ ] Background: hsl(var(--sidebar))
[ ] Active state: hsl(var(--sidebar-accent))
[ ] Border-radius: 0 8px 8px 0 (rounded right)
[ ] Transition: all 0.2s ease
[ ] Text labels always visible (not icon-only)
[ ] Hover state is subtle and gentle
```

---

This design system ensures your agentic VC platform is text-driven, highly legible, and in optimal harmony with Scandinavian, minimal, and financial-industry standards.[5][3][4][2][1]

[1](https://uxplanet.org/nordic-ux-what-minimalism-looks-like-scandi-style-6eebbce51d74)
[2](https://uxdesign.cc/mastering-typography-in-design-systems-with-semantic-tokens-and-responsive-scaling-6ccd598d9f21)
[3](https://www.telerik.com/blogs/font-strategies-fintech-websites-apps)
[4](https://inforiver.com/blog/general/best-fonts-financial-reporting/)
[5](https://www.reddit.com/r/UI_Design/comments/12x6wpu/using_monospace_fonts_for_numbers/)
[6](https://dribbble.com/tags/scandinavian-design)
[7](https://dribbble.com/search/scandinavian-design)
[8](https://www.designstudiouiux.com/blog/minimalist-website-design-examples/)
[9](https://www.behance.net/search/projects/Scandinavian%20design)
[10](https://www.figma.com/community/file/1416021950894893678/ui-ux-hero-section-design-for-scandinavian-nordic-interior-design-furnitures-website)
[11](https://daily.dev/blog/10-ui-localization-best-practices-for-developers)
[12](https://uxdesign.cc/the-scandinavian-rule-that-designers-need-to-follow-3fbce5e80330)
[13](https://uxdesign.cc/10-principles-for-typography-usage-in-ui-design-a8f038f43ffd)
[14](https://aiopsgroup.com/swedish-retail-accessibility-compliance/)
[15](https://pimpmytype.com/review-tech-blog/)
[16](https://www.linkedin.com/pulse/top-10-uxui-best-practices-your-website-transforms-user-hze8f)
[17](https://forum.zettelkasten.de/discussion/82/why-do-you-not-use-monospace-fonts)
[18](https://semantic-ui.com)
[19](https://blog.prototypr.io/5-monospaced-fonts-with-cool-coding-ligatures-b7ee6da02381)
[20](https://ceur-ws.org/Vol-3508/paper1.pdf)
