---
name: Video asset style refreshes
description: Lesson video restyling should preserve stable public asset paths.
---

Restyle lesson videos in place while keeping their filenames and resolution stable.

**Why:** The database and lesson UI reference public video paths; stable paths let visual treatments change without data migrations or broken lesson links.

**How to apply:** Convert to temporary files, validate the outputs, then atomically replace the originals. Keep the established 16:9 720p format unless a product requirement changes.