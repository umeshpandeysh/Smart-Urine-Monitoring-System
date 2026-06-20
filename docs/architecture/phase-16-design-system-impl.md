# UroSense Phase 16 Design System Implementation
*Version 1.0.0 — Production-Ready Design Tokens, Tailwind Config, UI Components & Motion Specs*

This document defines the complete production-grade UI Architecture and Design System for the **UroSense** platform. It aligns with **Next.js 15, TypeScript, TailwindCSS v3.4, ShadCN UI, Framer Motion**, and **Recharts**. The design incorporates the visual polish of Apple, the structural clarity of Stripe, the dark-mode depth of Vercel, and the compliance requirements of a HIPAA-ready healthcare SaaS platform.

---

# 1. Design Tokens

The UroSense UI tokens establish a system of design values that map consistently between light and dark modes, ensuring a unified visual identity and WCAG 2.1 compliance.

### 1.1 Color System (HSL Core)

```
================================================================================
TOKEN GROUP     | SEMANTIC VALUE         | LIGHT MODE             | DARK MODE
================================================================================
Brand Primary   | --primary              | 192 95% 48% (Cyan)     | 192 95% 48% (Cyan)
Brand Deep      | --primary-deep         | 192 95% 35%            | 192 95% 60%
Background      | --background           | 210 40% 98% (Off-white)| 224 71% 4% (Obsidian)
Foreground      | --foreground           | 210 24% 12%            | 210 40% 98%
Card Surface    | --card                 | 0 0% 100%              | 224 25% 12% (Slate)
Card Border     | --border               | 210 30% 90%            | 224 22% 18% (Subtle Slate)
Muted Foreground| --muted-foreground     | 210 16% 50%            | 224 12% 60%
--------------------------------------------------------------------------------
HEALTH STATUSES | SEMANTIC VALUE         | LIGHT MODE             | DARK MODE
--------------------------------------------------------------------------------
Optimal         | --health-optimal       | 142 72% 29% (Green)    | 142 72% 35% (Green)
Caution         | --health-caution       | 38 92% 50% (Amber)     | 38 92% 50% (Amber)
Critical        | --health-critical      | 350 89% 52% (Crimson)  | 350 89% 55% (Crimson)
================================================================================
```

### 1.2 Typography Scale

*   **Primary Display Font**: **Outfit** (Geometric tech-brand aesthetic)
*   **Body & Technical Font**: **Inter** (Neutral, highly legible text and numerals)
*   **Monospace Font**: **JetBrains Mono** or **SF Mono** (High-precision telemetry curves)

```
================================================================================
SIZE TOKEN | FONT SIZE  | LINE HEIGHT | WEIGHTS (Outfit / Inter)  | TRACKING
================================================================================
Hero       | 48px (3rem)| 56px        | Bold (700)                | -0.03em
h1         | 32px (2rem)| 40px        | SemiBold (600)            | -0.02em
h2         | 24px       | 32px        | SemiBold (600)            | -0.015em
h3 / Sub   | 16px (1rem)| 24px        | Medium (500) / Regular    | -0.01em
Body       | 14px       | 20px        | Regular (400)             | 0
Caption    | 12px       | 16px        | Medium (500)              | 0.01em
Data Mono  | 13px       | 18px        | Regular (400)             | 0
================================================================================
```

### 1.3 Spacing Scale
UroSense utilizes a strict **8-pixel grid** for layout margins and **4-pixel steps** for micro-paddings.
*   `space-1` = `4px` (xxs) — Micro inner borders, list spacing.
*   `space-2` = `8px` (xs) — Label-to-input gap, icon-to-text separation.
*   `space-3` = `12px` (sm) — Button padding, avatar grids.
*   `space-4` = `16px` (md) — Standard card padding, gutters.
*   `space-6` = `24px` (lg) — Outer layout margins, desktop card spacing.
*   `space-8` = `32px` (xl) — Section breaks, hero margins.
*   `space-12` = `48px` (xxl) — Layout offsets, header spacing.

### 1.4 Border Radius & Shadows

*   **Subtle / Inputs**: `radius-sm` = `4px` / `0.25rem`
*   **Standard / Buttons**: `radius-md` = `8px` / `0.5rem`
*   **Containers / Cards**: `radius-lg` = `12px` / `0.75rem`
*   **Popover / Modals**: `radius-xl` = `16px` / `1rem`
*   **Shadows**:
    *   `shadow-sm`: `0 1px 2px rgba(0,0,0,0.05)`
    *   `shadow-md`: `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)`
    *   `shadow-lg`: `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)`
    *   `shadow-glow`: `0 0 15px rgba(19, 194, 194, 0.15)` (Primary Cyan aura)

### 1.5 Z-Index Strategy

*   `z-base`: `0`
*   `z-sticky`: `100` (Headers, floating alerts)
*   `z-drawer`: `200` (Mobile navigation sheets)
*   `z-modal`: `300` (EHR dialogs, clinical alert modals)
*   `z-tooltip`: `400` (Chart crosshairs, parameter guides)

---

# 2. Tailwind Theme Architecture

The tailwind theme configuration bridges design tokens directly into React code.

### 2.1 CSS Variables Config (`src/styles/globals.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 210 40% 98%;
    --foreground: 210 24% 12%;
    
    --card: 0 0% 100%;
    --card-foreground: 210 24% 12%;
    
    --popover: 0 0% 100%;
    --popover-foreground: 210 24% 12%;
    
    --primary: 192 95% 48%;
    --primary-foreground: 224 71% 4%;
    
    --muted: 210 30% 95%;
    --muted-foreground: 210 16% 50%;
    
    --accent: 192 95% 95%;
    --accent-foreground: 192 95% 35%;
    
    --border: 210 30% 90%;
    --input: 210 30% 90%;
    --ring: 192 95% 48%;
    
    --radius: 0.5rem;
    
    --health-optimal: 142 72% 29%;
    --health-caution: 38 92% 50%;
    --health-critical: 350 89% 52%;
  }

  .dark {
    --background: 224 71% 4%;
    --foreground: 210 40% 98%;
    
    --card: 224 25% 12%;
    --card-foreground: 210 40% 98%;
    
    --popover: 224 25% 12%;
    --popover-foreground: 210 40% 98%;
    
    --primary: 192 95% 48%;
    --primary-foreground: 224 71% 4%;
    
    --muted: 224 22% 18%;
    --muted-foreground: 224 12% 60%;
    
    --accent: 192 95% 15%;
    --accent-foreground: 192 95% 68%;
    
    --border: 224 22% 18%;
    --input: 224 22% 18%;
    --ring: 192 95% 48%;
    
    --health-optimal: 142 72% 35%;
    --health-caution: 38 92% 50%;
    --health-critical: 350 89% 55%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground font-sans antialiased;
  }
}
```

### 2.2 Tailwind Theme Script (`tailwind.config.ts`)

```typescript
import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/design-system/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        health: {
          optimal: "hsl(var(--health-optimal))",
          caution: "hsl(var(--health-caution))",
          critical: "hsl(var(--health-critical))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
        display: ["var(--font-outfit)", ...fontFamily.sans],
        mono: ["var(--font-mono)", ...fontFamily.mono],
      },
      boxShadow: {
        glow: "0 0 15px rgba(19, 194, 194, 0.15)",
        "glow-lg": "0 0 30px rgba(19, 194, 194, 0.3)",
      },
      transitionTimingFunction: {
        apple: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        "300": "300ms",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

---

# 3. Component Library Structure

UroSense components are separated into distinct logical layers, from raw inputs to specific medical cards, ensuring a high-density, cohesive design library.

## 3.1 Foundation Components

These components are the basic primitives constructed on top of Radix UI primitives and styled via Tailwind.

### Button (`src/components/ui/button.tsx`)
*   **Visual Polish**: Stripe-like subtle gradient highlights and Vercel-like thin boundaries. Renders physical-feedback spring animations.
*   **Accessibility**: Implements keyboard focus rings and `aria-disabled` handling.
*   **Props**:
    ```typescript
    export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
      variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'health-optimal';
      size?: 'sm' | 'md' | 'lg' | 'icon';
      isLoading?: boolean;
    }
    ```

### Input & Textarea (`src/components/ui/input.tsx`)
*   **Visual Polish**: Outfit bold titles, 44px touch-target height. Focus triggers a subtle outer glow shadow (`shadow-glow`).
*   **Accessibility**: Renders screen-reader helper labels and standard input field validation ARIA attributes (`aria-invalid`, `aria-describedby`).

### Dropdown Menu & Select (`src/components/ui/dropdown-menu.tsx`)
*   **Visual Polish**: Glassmorphism panel styling (`backdrop-blur-md bg-card/90`). Spring pop animations.
*   **Accessibility**: Complies with WAI-ARIA Menu/Select specifications, handling keyboard cursor loops and focus preservation.

---

## 3.2 Layout Components

### App Shell (`src/components/layout/app-shell.tsx`)
Provides the desktop left-hand sidebar dashboard layout collapsing to a sliding bottom-sheet on mobile viewports.
*   **Props**:
    ```typescript
    interface AppShellProps {
      children: React.ReactNode;
      sidebarNav: NavItem[];
      userProfile: Profile;
    }
    ```

### Sidebar & Navbar (`src/components/layout/sidebar.tsx`)
*   **Visual Polish**: Minimal borders (`border-r border-border`). Subtle backdrop radial glows.
*   **Components**: Shows organization identifiers, active device connection indicator, and multi-user profile switcher.

---

## 3.3 Data Components

### Metric Card (`src/components/data/metric-card.tsx`)
Used to display primary physiological indicators (e.g. pH, specific gravity, volume) on the dashboard decks.

```typescript
interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  healthLevel: 'optimal' | 'caution' | 'critical';
  trendPercentage?: number;
  isLoading?: boolean;
}
```
*   **Visual Polish**: Apple-inspired circular progress rings mapping the score. Hover changes border color to HSL health state color.
*   **Animations**: Renders layout-transition spring scaling.

### Data Grid & Table (`src/components/data/table.tsx`)
Clinical table structure built for high information density.
*   **Visual Polish**: Thin row dividers, alternating row zebra styling, highlighted rows for anomalous parameters.
*   **Accessibility**: Fully scrollable horizontally with keyboard support, ARIA grid headers, and descriptive navigation cues.

---

## 3.4 Visualization Components

Urinalysis trends use custom styled **Recharts** containers that coordinate with the color tokens.

### Line & Area Charts (`src/components/charts/telemetry-chart.tsx`)
Displays longitudinal patient telemetry parameters.
*   **Visual Polish**: Renders gradient-underlay fills and custom clean HTML tooltips. Uses HSL health state colors for data lines.
*   **Interaction**: Mouse movements trigger a lock vertical crosshair tracking line.

### Heatmap Grid (`src/components/charts/heatmap-grid.tsx`)
Visualizes restroom operations, ensuring coordinates are omitted if a cohort has less than 50 active screenings (Patch 1.1).

---

## 3.5 Healthcare Components

These components are specifically engineered to represent medical indicators.

### Reagent Strip Visualizer (`src/components/diagnostic/reagent-strip.tsx`)
A digital replica of the physical 10-parameter urine chemical reagent strip.

```typescript
interface ReagentPad {
  parameter: string;
  abbreviation: string;
  calibratedColor: string; // Hex or HSL color representing final test
  referenceColorRange: { value: string; color: string }[];
  status: 'optimal' | 'caution' | 'critical';
}

interface ReagentStripVisualizerProps {
  pads: ReagentPad[];
  isScanning?: boolean;
  onPadSelect?: (pad: ReagentPad) => void;
}
```
*   **Animations**: Renders a Vercel-like glowing gradient sweep sweep down the strip during the `isScanning` phase.
*   **Accessibility**: Standard screen readers read the full parameter list sequentially (`aria-live="polite"`).

### Wellness Score Card (`src/components/diagnostic/wellness-score.tsx`)
Displays the overall wellness score (0-100) using a large circular radial gauge showing the target recovery index.

---

# 4. Folder Structure

The Design System follows a modular folder organization inside the Next.js App Router structure:

```
src/
├── styles/
│   ├── globals.css         # Global CSS variables, tailwind directives
│   └── fonts.ts            # Next/Font loader configuration (Outfit, Inter, Mono)
├── lib/
│   └── ui/
│       ├── utils.ts        # Tailwind merge and clsx wrapper (cn function)
│       └── motion.ts       # Reusable Framer Motion variant definitions
├── design-system/
│   ├── tokens.ts           # JS representation of tokens (spacing, z-index, etc.)
│   └── theme-provider.tsx  # Next-Themes dark mode context wrapper
├── components/
│   ├── ui/                 # Primitives (Radix/ShadCN wraps)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── select.tsx
│   ├── layout/             # Shell, Sidebar, Navbar
│   │   ├── app-shell.tsx
│   │   ├── sidebar.tsx
│   │   └── navbar.tsx
│   ├── data/               # Tables, Grid, Metric Cards
│   │   ├── table.tsx
│   │   └── metric-card.tsx
│   ├── charts/             # Recharts wrappers
│   │   ├── telemetry-chart.tsx
│   │   └── heatmap-grid.tsx
│   └── diagnostic/         # Specific healthcare components
│       ├── reagent-strip.tsx
│       ├── wellness-score.tsx
│       └── hydration-card.tsx
```

---

# 5. Motion System

UroSense animations rely on **Framer Motion** configured with precise easing curves.

### 5.1 Easing Curves

*   **Standard Hover / Fast Transitions**: `transition: { duration: 0.2, ease: "easeOut" }`
*   **Apple-like Page / Modal transitions**: Spring physics:
    ```typescript
    export const springTransition = {
      type: "spring",
      stiffness: 170,
      damping: 26,
      mass: 1
    };
    ```

### 5.2 Motion Variants (`src/lib/ui/motion.ts`)

```typescript
// Fade page transition
export const pageTransitionVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }
};

// Card Hover scaling
export const cardHoverVariants = {
  initial: { scale: 1, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" },
  hover: { 
    scale: 1.015, 
    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.08), 0 0 15px rgba(19, 194, 194, 0.1)",
    borderColor: "hsl(var(--primary))",
    transition: { duration: 0.25, ease: "easeOut" }
  },
  tap: { scale: 0.99, transition: { duration: 0.1 } }
};

// Skeleton loading pulse
export const skeletonPulseVariants = {
  animate: {
    opacity: [0.4, 0.8, 0.4],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};
```

---

# 6. Accessibility (a11y) Standards

The design system enforces WCAG 2.1 AA parameters across all components.

1.  **Color Contrast**: Every background/foreground combination is verified to possess a minimum **4.5:1** contrast ratio. Primary interactive buttons use bold weights to ensure legibility.
2.  **Focus Ring Styling**: Focused elements must render a highly visible border glow:
    ```css
    .focus-ring {
      @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background;
    }
    ```
3.  **Keyboard Navigation**: Dialogs and popovers use Radix UI focus traps, restricting navigation loops within open modals.
4.  **ARIA Cues**: Color-changing parameters (e.g. strip pads) must have fallback text descriptions:
    ```html
    <div role="img" aria-label="Protein Pad: caution indicator showing 30mg/dL color deviation"></div>
    ```

---

# 7. Implementation Roadmap

### 7.1 Component Dependency Graph

```
Level 1: Tokens & Fonts (styles/) ──> Level 2: Utilities (lib/ui/utils)
                                            │
                                            v
                                      Level 3: Foundation Primitives (components/ui/*)
                                            │
                    +-----------------------+-----------------------+
                    │                                               │
                    v                                               v
        Level 4: Layout Shells (app-shell)              Level 5: Charts & Diagnostic Elements
                    │                                               │
                    +-----------------------+-----------------------+
                                            │
                                            v
                                      Level 6: Unified Dashboard Assemblies
```

### 7.2 Build & Testing Strategy
*   **Step 1: Token Audit**: Build and deploy `globals.css` and `tailwind.config.ts`. Verify color rendering on light and dark monitors.
*   **Step 2: Unit Testing (Jest & React Testing Library)**: Write assertions verifying foundation components handle states correctly:
    ```typescript
    it('handles button loading states by rendering spinner and setting disabled', () => {
      render(<Button isLoading>Start Scan</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });
    ```
*   **Step 3: Accessibility Test (Jest-Axe)**: Check automated accessibility trees:
    ```typescript
    it('complies with accessibility rules', async () => {
      const { container } = render(<ReagentStripVisualizer pads={mockPads} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
    ```
