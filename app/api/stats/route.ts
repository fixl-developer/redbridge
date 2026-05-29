import os from "node:os";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    serverTime: new Date().toISOString(),
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    nodeVersion: process.version,
    uptimeSeconds: Math.floor(process.uptime()),
    residentMemoryMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
    loadAverage: os.loadavg(),
    cpuCores: os.cpus().length,
    totalMemoryMB: Math.round(os.totalmem() / 1024 / 1024),
    freeMemoryMB: Math.round(os.freemem() / 1024 / 1024),
  });
}
