export default async function (context, req) {
  return {
    status: 200,
    body: [
      { action: "Completed challenge", time: "2026-09-04" },
      { action: "Earned XP", time: "2026-09-03" }
    ]
  };
}
