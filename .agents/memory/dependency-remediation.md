---
name: Dependency security updates
description: Safe dependency upgrade constraints for this workspace
---

Keep the workspace minimum release-age protection enabled when remediating npm vulnerabilities. Prefer the oldest patched release that is already mature enough to install rather than weakening that safeguard for a newly published latest version. When upgrading code generators, regenerate the clients and run the shared-library typecheck because newer generator output can require a different runtime library major.

**Why:** The security audit remediation encountered a newly published patched package blocked by the workspace's intentional release-age policy, and a newer generator release produced output incompatible with the workspace's current Zod and DOM typings.

**How to apply:** Update direct dependencies and narrowly scoped overrides, regenerate generated clients, inspect generated diffs, then run frozen install, audit, typecheck, and full builds before completing the upgrade.