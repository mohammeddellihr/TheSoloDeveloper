# Task 2 Report: Fix Form Layout Inconsistencies

## What Was Implemented

- **CommentForm.tsx**: Changed `gap-2` to `gap-3` (line 17) and `mt-2` to `mt-4` (line 34) for consistent spacing.
- **CreateNoteForm.tsx**: Moved error message from top of form (after `<form>` tag) to just before the submit footer, so order is: fields → error → submit button.
- **UpdateNoteForm.tsx**: Moved error message from top of form (after hidden input) to just before the submit footer, same order as CreateNoteForm.

## Verification

- `npm run build`: Compiled successfully with no errors.
- `npm run lint`: 0 errors (3 pre-existing warnings on unrelated Delete components, not from this task).

## Files Changed

- `app/components/CommentForm.tsx`
- `app/components/CreateNoteForm.tsx`
- `app/components/UpdateNoteForm.tsx`
