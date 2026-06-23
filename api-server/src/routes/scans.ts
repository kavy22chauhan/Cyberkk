import { Router } from "express";
import { db } from "@workspace/db";
import { scansTable } from "@workspace/db";
import { eq, desc, asc, ilike, and, sql, count } from "drizzle-orm";
import {
  CreateScanBody,
  GetScanParams,
  DeleteScanParams,
  ListScansQueryParams,
} from "@workspace/api-zod";
import { analyzeUrl } from "../lib/phishingDetector";

const router = Router();

// POST /scans — scan a URL
router.post("/scans", async (req, res) => {
  const parsed = CreateScanBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request: url is required" });
  }

  const { url } = parsed.data;
  const result = analyzeUrl(url);

  const [scan] = await db.insert(scansTable).values({
    url,
    score: result.score,
    status: result.status,
    reasons: JSON.stringify(result.reasons),
    recommendations: JSON.stringify(result.recommendations),
  }).returning();

  return res.status(201).json(formatScan(scan));
});

// GET /scans — list with pagination, search, sort
router.get("/scans", async (req, res) => {
  const parsed = ListScansQueryParams.safeParse(req.query);
  const params = parsed.success ? parsed.data : null;

  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;
  const offset = (page - 1) * limit;
  const search = params?.search;
  const sortBy = params?.sortBy ?? "scan_date";
  const sortOrder = params?.sortOrder ?? "desc";
  const statusFilter = params?.status;

  const conditions: ReturnType<typeof ilike>[] = [];
  if (search) {
    conditions.push(ilike(scansTable.url, `%${search}%`));
  }
  if (statusFilter) {
    conditions.push(eq(scansTable.status, statusFilter));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const colMap: Record<string, typeof scansTable.scanDate | typeof scansTable.score | typeof scansTable.status | typeof scansTable.url> = {
    scan_date: scansTable.scanDate,
    score: scansTable.score,
    status: scansTable.status,
    url: scansTable.url,
  };
  const col = colMap[sortBy] ?? scansTable.scanDate;
  const orderFn = sortOrder === "asc" ? asc : desc;

  const [scans, totalResult] = await Promise.all([
    db.select().from(scansTable)
      .where(where)
      .orderBy(orderFn(col))
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(scansTable).where(where),
  ]);

  const total = Number(totalResult[0]?.count ?? 0);

  return res.json({
    scans: scans.map(formatScan),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
});

// GET /scans/recent — 5 most recent
router.get("/scans/recent", async (_req, res) => {
  const scans = await db.select()
    .from(scansTable)
    .orderBy(desc(scansTable.scanDate))
    .limit(5);
  return res.json(scans.map(formatScan));
});

// GET /scans/:id
router.get("/scans/:id", async (req, res) => {
  const parsed = GetScanParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid scan ID" });
  }

  const [scan] = await db.select().from(scansTable).where(eq(scansTable.id, parsed.data.id));
  if (!scan) {
    return res.status(404).json({ error: "Scan not found" });
  }
  return res.json(formatScan(scan));
});

// DELETE /scans/:id
router.delete("/scans/:id", async (req, res) => {
  const parsed = DeleteScanParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid scan ID" });
  }

  const [deleted] = await db.delete(scansTable)
    .where(eq(scansTable.id, parsed.data.id))
    .returning();

  if (!deleted) {
    return res.status(404).json({ error: "Scan not found" });
  }
  return res.json({ success: true });
});

function formatScan(scan: typeof scansTable.$inferSelect) {
  return {
    id: scan.id,
    url: scan.url,
    score: scan.score,
    status: scan.status,
    reasons: JSON.parse(scan.reasons) as string[],
    recommendations: JSON.parse(scan.recommendations) as string[],
    scanDate: scan.scanDate.toISOString(),
  };
}

export default router;
