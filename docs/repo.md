# Next.js 16 & Tailwind CSS v4 Boilerplate Context

> **Location:** `docs/repo.md` — boilerplate reference used to scaffold this project.

This document provides a concise technical blueprint of the configuration, dependencies, folder structure and utilities used in this project. Use this reference to quickly set up or bootstrap a new repository with the exact same technology stack.

---

## 1. Core Tech Stack & Dependency Matrix

The project uses Next.js 16 (App Router), React 19 and Tailwind CSS v4.0.0.

### `package.json`

```json
{
    "name": "your-project-name",
    "version": "0.1.0",
    "private": true,
    "scripts": {
        "dev": "next dev",
        "build": "next build",
        "start": "next start",
        "lint": "eslint"
    },
    "dependencies": {
        "@next/third-parties": "^16.2.9",
        "@vercel/analytics": "^2.0.1",
        "lucide-react": "^1.18.0",
        "next": "16.2.9",
        "react": "19.2.4",
        "react-dom": "19.2.4"
    },
    "devDependencies": {
        "@tailwindcss/postcss": "^4",
        "@types/node": "^20",
        "@types/react": "^19",
        "@types/react-dom": "^19",
        "eslint": "^9",
        "eslint-config-next": "16.2.9",
        "tailwindcss": "^4",
        "typescript": "^5"
    }
}
```

---

## 2. Configuration Files

### Next.js Configuration (`next.config.ts`)

Configured for TypeScript and static HTML exports (`output: "export"`).

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "export",
    trailingSlash: false,
    images: {
        unoptimized: true,
    },
    reactStrictMode: true,
    poweredByHeader: false,
};

export default nextConfig;
```

### PostCSS Configuration (`postcss.config.mjs`)

Tailwind CSS v4 integrates natively with PostCSS via the new `@tailwindcss/postcss` package.

```javascript
const config = {
    plugins: {
        "@tailwindcss/postcss": {},
    },
};

export default config;
```

### TypeScript Configuration (`tsconfig.json`)

Includes absolute path mapping using `@/*` referencing the root directory.

```json
{
    "compilerOptions": {
        "target": "ES2017",
        "lib": ["dom", "dom.iterable", "esnext"],
        "allowJs": true,
        "skipLibCheck": true,
        "strict": true,
        "noEmit": true,
        "esModuleInterop": true,
        "module": "esnext",
        "moduleResolution": "bundler",
        "resolveJsonModule": true,
        "isolatedModules": true,
        "jsx": "react-jsx",
        "incremental": true,
        "plugins": [
            {
                "name": "next"
            }
        ],
        "paths": {
            "@/*": ["./*"]
        }
    },
    "include": [
        "next-env.d.ts",
        "**/*.ts",
        "**/*.tsx",
        ".next/types/**/*.ts",
        ".next/dev/types/**/*.ts",
        "**/*.mts"
    ],
    "exclude": ["node_modules"]
}
```

---

## 3. Directory Layout

The workspace follows a clean, modular structure centered around the Next.js App Router:

```
├── app/                  # Routing & page-level components
│   ├── favicon.ico       # Website favicon
│   ├── globals.css      # Core styles & Tailwind imports
│   ├── layout.tsx       # Root HTML wrap & global components
│   ├── page.tsx         # Home/landing page
│   ├── sitemap.ts       # Dynamic sitemap generator
│   └── [routes]/        # Folder-based pages (e.g. contact/page.tsx)
├── components/          # Reusable UI component library
│   ├── layout/          # Layout pieces (Header, Footer, Navbar)
│   ├── sections/        # Section blocks (Hero, Features, ContactForm)
│   └── ui/              # Atom components (Button, Card, FloatButton)
├── lib/                  # Shared business logic and utilities
│   ├── utils.ts         # Utility helpers (e.g., class names merger)
│   └── schema.ts        # SEO/Structured Data JSON-LD generators
├── types/                # Shared TypeScript models and definitions
├── public/              # Static file hosting (images, icons, etc.)
├── package.json
├── next.config.ts
├── postcss.config.mjs
└── tsconfig.json
```

---

## 4. CSS & Tailwind v4 Integration

Tailwind v4 deprecates `tailwind.config.js` in favor of a CSS-first approach. Everything is loaded in the CSS entry point.

### Global Styles (`app/globals.css`)

```css
@import "tailwindcss";

/* 
  To add custom colors, themes or utilities in Tailwind CSS v4,
  define them directly inside the @theme block here:
  
  @theme {
    --color-primary: #0f172a;
    --font-sans: 'Inter', sans-serif;
  }
*/
```

---

## 5. Boilerplate Layout & Utilities

### Utility class helper (`lib/utils.ts`)

A simple function to conditionally join classes without cluttering components.

```typescript
export function cn(...classes: (string | false | null | undefined)[]): string {
    return classes.filter(Boolean).join(" ");
}
```

### Basic App Shell (`app/layout.tsx` - Scaffold)

Includes standard SEO optimization, metadata base and layout structure.

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yourdomain.com"),
  title: {
    default: "Your Site Name",
    template: "%s | Your Site Name",
  },
  description: "Bootstrap project template description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col antialiased bg-white text-gray-800`}>
        {/* Header / Navigation goes here */}
        <main className="flex-1 w-full">
          {children}
        </main>
        {/* Footer goes here */}
      </body>
    </html>
  );
}
```

---

## 6. Installation & Execution Reference

```bash
# 1. Install all dependencies
npm install

# 2. Run the development server locally (runs on http://localhost:3000)
npm run dev

# 3. Build the production application and export it statically (creates a build in /out directory)
npm run build
```
