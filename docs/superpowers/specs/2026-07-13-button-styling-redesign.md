# Button Styling Redesign

## Overview

Redesign the Button component variants to use a new visual style with white borders and inverted color schemes.

## Requirements

- Dark theme only (no light mode considerations)
- Primary button: white background, white border, black text
- Sub (secondary) button: black background, white border, black text
- 1px solid border on both variants
- Hover states for both variants
- Disabled states with reduced opacity

## Design

### Primary Button

| Property | Value |
|----------|-------|
| Background | white (`bg-white`) |
| Border | 1px solid white (`border border-white`) |
| Text | black (`text-black`) |
| Hover | slightly darker white (`hover:bg-gray-100`) |
| Disabled | reduced opacity (`disabled:opacity-50`) |

### Sub (Secondary) Button

| Property | Value |
|----------|-------|
| Background | black (`bg-black`) |
| Border | 1px solid white (`border border-white`) |
| Text | white (`text-white`) |
| Hover | slightly lighter black (`hover:bg-gray-800`) |
| Disabled | reduced opacity (`disabled:opacity-50`) |

### Shared Styles

- Rounded corners (`rounded`)
- Padding (`px-4 py-2`)
- Font size and weight (`text-sm font-medium`)
- Whitespace nowrap (`whitespace-nowrap`)
- Cursor pointer (`cursor-pointer`)
- Focus visible styles (`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black`)
- Disabled cursor (`disabled:cursor-not-allowed`)

## Implementation

Modify `app/components/Button.tsx` to update the variant styles:

```tsx
const variants = {
  primary:
    "bg-white text-black border border-white hover:bg-gray-100 disabled:opacity-50",
  secondary:
    "bg-black text-black border border-white hover:bg-gray-800 disabled:opacity-50",
}
```

## Files to Modify

- `app/components/Button.tsx`

## Testing

- Visual verification in browser
- Test hover states
- Test disabled states
- Run `npm run lint` to verify no linting errors
