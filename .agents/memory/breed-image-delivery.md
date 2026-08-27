---
name: Breed image delivery
description: The reliable image-source decision for this dog-breed site.
---

Use breed-specific image endpoints rather than Unsplash Source query URLs. Unsplash Source may cache one result across different query strings, which makes every breed card display the same dog. Prefer a breed-aware API with a second breed-aware source as fallback, and lazy-load images on list pages to avoid requesting every image immediately.

**Why:** The deployed site visibly returned one identical image for all popular breeds even though the query strings differed.

**How to apply:** When changing image handling, verify at least the first several popular breeds in the deployed-style preview and confirm their image URLs/results are different before publishing.