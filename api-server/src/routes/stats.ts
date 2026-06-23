import { Router } from "express";
import { db } from "@workspace/db";
import { scansTable } from "@workspace/db";
import { eq, sql, count, avg, gte } from "drizzle-orm";

const router = Router();

// GET /stats/summary
router.get("/stats/summary", async (_req, res) => {
  const [totals, todayResult] = await Promise.all([
    db.select({
      total: count(),
      safe: sql<number>`SUM(CASE WHEN status = 'safe' THEN 1 ELSE 0 END)::int`,
      suspicious: sql<number>`SUM(CASE WHEN status = 'suspicious' THEN 1 ELSE 0 END)::int`,
      highRisk: sql<number>`SUM(CASE WHEN status = 'high_risk' THEN 1 ELSE 0 END)::int`,
      avgScore: avg(scansTable.score),
    }).from(scansTable),
    db.select({ count: count() }).from(scansTable).where(
      gte(scansTable.scanDate, sql`CURRENT_DATE`)
    ),
  ]);

  const row = totals[0];
  return res.json({
    total: Number(row?.total ?? 0),
    safe: Number(row?.safe ?? 0),
    suspicious: Number(row?.suspicious ?? 0),
    highRisk: Number(row?.highRisk ?? 0),
    avgScore: Number(Number(row?.avgScore ?? 0).toFixed(1)),
    todayCount: Number(todayResult[0]?.count ?? 0),
  });
});

// GET /stats/trend — last 30 days
router.get("/stats/trend", async (_req, res) => {
  const rows = await db.select({
    date: sql<string>`TO_CHAR(scan_date, 'YYYY-MM-DD')`,
    count: count(),
    safe: sql<number>`SUM(CASE WHEN status = 'safe' THEN 1 ELSE 0 END)::int`,
    suspicious: sql<number>`SUM(CASE WHEN status = 'suspicious' THEN 1 ELSE 0 END)::int`,
    highRisk: sql<number>`SUM(CASE WHEN status = 'high_risk' THEN 1 ELSE 0 END)::int`,
  })
    .from(scansTable)
    .where(gte(scansTable.scanDate, sql`NOW() - INTERVAL '30 days'`))
    .groupBy(sql`TO_CHAR(scan_date, 'YYYY-MM-DD')`)
    .orderBy(sql`TO_CHAR(scan_date, 'YYYY-MM-DD') ASC`);

  return res.json(rows.map(r => ({
    date: r.date,
    count: Number(r.count),
    safe: Number(r.safe),
    suspicious: Number(r.suspicious),
    highRisk: Number(r.highRisk),
  })));
});

// GET /stats/top-indicators — most common detection reasons
router.get("/stats/top-indicators", async (_req, res) => {
  const scans = await db.select({ reasons: scansTable.reasons }).from(scansTable);

  const indicatorMap = new Map<string, number>();
  for (const scan of scans) {
    try {
      const reasons = JSON.parse(scan.reasons) as string[];
      for (const r of reasons) {
        if (r !== "No phishing indicators detected") {
          // Shorten to key phrase
          const key = r.split(" — ")[0].split(" (")[0];
          indicatorMap.set(key, (indicatorMap.get(key) ?? 0) + 1);
        }
      }
    } catch {
      // skip malformed
    }
  }

  const sorted = [...indicatorMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([indicator, count]) => ({ indicator, count }));

  return res.json(sorted);
});

export default router;
