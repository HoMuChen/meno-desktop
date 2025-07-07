# Tailwind CSS and shadcn/ui Integration Guide

This project is now configured with **Tailwind CSS** and **shadcn/ui** for modern, beautiful UI development.

## 🎨 What's Included

### Tailwind CSS
- Utility-first CSS framework
- Responsive design utilities
- Dark mode support
- Custom color scheme configured

### shadcn/ui Components
The following components are already set up:
- **Button** - Various styles (default, destructive, outline, secondary, ghost, link)
- **Card** - Container with header, content, and footer sections
- **Input** - Styled form inputs
- **Alert** - For displaying messages and notifications

### Utilities
- `cn()` function for combining class names (located in `src/lib/utils.ts`)

## 🚀 Usage Examples

### Using Tailwind CSS Classes
```tsx
<div className="flex items-center justify-between p-4 bg-background">
  <h1 className="text-2xl font-bold text-foreground">Hello World</h1>
  <p className="text-sm text-muted-foreground">Subtitle text</p>
</div>
```

### Using shadcn/ui Components
```tsx
import { Button } from './components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card'

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Card</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="default">Click me</Button>
        <Button variant="outline">Cancel</Button>
      </CardContent>
    </Card>
  )
}
```

## 🎨 Color System
The app uses CSS variables for theming. Light and dark modes are supported:
- `background` / `foreground` - Main colors
- `primary` / `primary-foreground` - Primary brand colors
- `secondary` / `secondary-foreground` - Secondary colors
- `muted` / `muted-foreground` - Muted text and backgrounds
- `accent` / `accent-foreground` - Accent colors
- `destructive` / `destructive-foreground` - Error/danger colors
- `card` / `card-foreground` - Card specific colors
- `border` - Border color
- `input` - Input border color
- `ring` - Focus ring color

## 📦 Adding New shadcn/ui Components
To add more shadcn/ui components, create them in `src/components/ui/` following the existing patterns.

## 🔧 Customization
- Tailwind config: `tailwind.config.js`
- CSS variables: `src/index.css`
- PostCSS config: `postcss.config.js`

## 💡 Tips
1. Use the `cn()` utility to combine Tailwind classes with conditional classes
2. Prefer Tailwind utility classes over custom CSS
3. Use the semantic color variables for consistency
4. Components are fully typed with TypeScript