---
name: Workspace script dependency resolution
description: Root-level utility scripts may not resolve dependencies declared only by a workspace package.
---

When a root-level utility needs a package owned by a workspace package, resolve it from that package's dependency context instead of adding a duplicate root dependency.

**Why:** The workspace keeps dependencies scoped to packages, so Node module resolution from the repository root can fail even when the dependency is installed and used successfully by an app package.

**How to apply:** Prefer the owning package's existing runtime/database module or use package-context resolution for one-off scripts; avoid broadening the root dependency graph just to run a utility.