Changelog & Manual Test Steps for Search page changes

- Changes made:
  - Replaced hard-coded categories list with `src/data/categories.js` (imported as `CATEGORIES`).
  - Added client-side promotion of products with `displayPriority > 0` (Featured) so they appear first when "Featured First" sort is active.
  - Added a compact Sort control (Featured First / Relevance) and defaulted to "Featured First".
  - Display a small `FEATURED` badge on product tiles for items with `displayPriority > 0`.

- Manual verification checklist:
  1. Open `/search?q=...` with query that returns at least one featured item (e.g., via admin or known products).
  2. Verify the Sort control exists (desktop) and defaults to "Featured First".
  3. Confirm products with `displayPriority > 0` show up at the top and have the `FEATURED` badge.
  4. Switch to "Relevance" and confirm original order from API is respected.
  5. Test with category filters applied and verify featured items still appear first in the result set.
  6. Verify pagination counts and navigation remain unchanged.
  7. Run through empty state, loading, and error flows to ensure no regressions.

Notes: This change is frontend-only and does not modify backend endpoints or logic.
