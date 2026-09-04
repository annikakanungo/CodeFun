export default async function handler(req, res) {
  res.status(200).json([
    { action: "Completed challenge", time: "2026-09-04" },
    { action: "Earned XP", time: "2026-09-03" }
  ]);
}
