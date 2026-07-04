import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

// GET /api/users/me — fetch the current user's role
router.get("/users/me", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.clerkId, userId))
    .limit(1);

  if (!user) { res.status(404).json({ error: "User not found" }); return; }
  res.json(user);
});

// POST /api/users/me — upsert user with role (called from onboarding)
router.post("/users/me", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { role, displayName } = req.body as { role: "student" | "teacher"; displayName?: string };
  if (!role || !["student", "teacher"].includes(role)) {
    res.status(400).json({ error: "role must be 'student' or 'teacher'" });
    return;
  }

  const [user] = await db
    .insert(usersTable)
    .values({ clerkId: userId, role, displayName: displayName ?? null })
    .onConflictDoUpdate({
      target: usersTable.clerkId,
      set: { role, displayName: displayName ?? null },
    })
    .returning();

  res.status(200).json(user);
});

export default router;
