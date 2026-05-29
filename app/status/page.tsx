import os from "node:os";

export const dynamic = "force-dynamic";

export default function StatusPage() {
  const now = new Date();
  const uptimeSec = Math.floor(process.uptime());
  const memMB = Math.round(process.memoryUsage().rss / 1024 / 1024);
  const loadAvg = os.loadavg().map((n) => n.toFixed(2)).join(", ");

  const rows: [string, string][] = [
    ["Server time (UTC)", now.toISOString()],
    ["Hostname", os.hostname()],
    ["Platform", `${os.platform()} ${os.arch()}`],
    ["Node version", process.version],
    ["Process uptime", `${uptimeSec}s`],
    ["Resident memory", `${memMB} MB`],
    ["Load average (1, 5, 15 min)", loadAvg],
    ["CPU cores", String(os.cpus().length)],
    ["Total memory", `${Math.round(os.totalmem() / 1024 / 1024)} MB`],
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0F1115",
        color: "#F4F1EB",
        fontFamily: "'Inter', system-ui, sans-serif",
        padding: "4rem 2rem",
      }}
    >
      <div style={{ maxWidth: "780px", margin: "0 auto" }}>
        <div
          style={{
            fontSize: ".72rem",
            letterSpacing: ".22em",
            textTransform: "uppercase",
            color: "#B5141A",
            fontWeight: 700,
            marginBottom: "1rem",
          }}
        >
          Server status
        </div>
        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "2.5rem",
            fontWeight: 600,
            marginBottom: "1.5rem",
            lineHeight: 1.1,
          }}
        >
          Rendered on the Node runtime.
        </h1>
        <p style={{ color: "#9098A4", marginBottom: "3rem", lineHeight: 1.7 }}>
          This page is server-rendered on every request. The values below come
          from the actual Node.js process serving this site — they cannot exist
          on static hosting.
        </p>

        <div
          style={{
            border: "1px solid #262A33",
            background: "#1A1D24",
          }}
        >
          {rows.map(([k, v], i) => (
            <div
              key={k}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "1rem 1.5rem",
                borderTop: i === 0 ? "none" : "1px solid #262A33",
                fontSize: ".95rem",
              }}
            >
              <span style={{ color: "#9098A4" }}>{k}</span>
              <span style={{ fontFamily: "'Space Grotesk', monospace" }}>
                {v}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "2rem",
            padding: "1rem 1.5rem",
            background: "#1A1D24",
            border: "1px solid #262A33",
            fontSize: ".85rem",
            color: "#9098A4",
          }}
        >
          Also try{" "}
          <a
            href="/api/stats"
            style={{ color: "#E25358", textDecoration: "underline" }}
          >
            /api/stats
          </a>{" "}
          for the same data as JSON.
        </div>

        <div style={{ marginTop: "2rem" }}>
          <a
            href="/"
            style={{
              color: "#B5141A",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            ← Back to Redbridge
          </a>
        </div>
      </div>
    </main>
  );
}
