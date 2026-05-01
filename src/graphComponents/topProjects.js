
export default class TopProjects {
  static render(transactions) {
    if (!transactions?.length) return `
      <div class="graph-card">
        <h2>Top Projects by XP</h2>
        <p style="color:var(--text-muted);text-align:center;padding:3rem 0">No project data.</p>
      </div>`;

    const maxXP = transactions[0].amount;

    // ── Layout constants ─────────────────────────────────────────
    const COL_W  = 52;   // column width
    const GAP    = 18;   // gap between columns
    const PAD_L  = 40;   // left padding (for Y-axis labels)
    const PAD_R  = 16;
    const PAD_T  = 36;   // top padding (for value labels above bars)
    const PAD_B  = 72;   // bottom padding (for rotated project name labels)
    const MAX_H  = 200;  // maximum bar height in px

    const SVG_W = PAD_L + transactions.length * (COL_W + GAP) - GAP + PAD_R;
    const SVG_H = PAD_T + MAX_H + PAD_B;
    const BASE_Y = PAD_T + MAX_H; // Y coordinate of the X-axis baseline

    // ── Gradient defs ────────────────────────────────────────────
    const defs = transactions.map((_, i) => {
      const hue = 210 + i * 15;
      return `
        <linearGradient id="vcg${i}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="hsl(${hue},80%,65%)"/>
          <stop offset="100%" stop-color="hsl(${hue},80%,38%)"/>
        </linearGradient>`;
    }).join("");

    // ── Y-axis guide lines ───────────────────────────────────────
    const guides = [0.25, 0.5, 0.75, 1].map(f => {
      const y   = PAD_T + MAX_H - f * MAX_H;
      const kbV = Math.round(f * maxXP / 1000);
      return `
        <line x1="${PAD_L - 6}" y1="${y}" x2="${SVG_W - PAD_R}" y2="${y}"
          stroke="rgba(148,163,184,0.08)" stroke-width="1" stroke-dasharray="5 4"/>
        <text x="${PAD_L - 8}" y="${y + 4}" fill="#475569" font-size="10"
          text-anchor="end" font-family="inherit">${kbV}k</text>`;
    }).join("");

    // ── X-axis baseline ──────────────────────────────────────────
    const baseline = `
      <line x1="${PAD_L - 6}" y1="${BASE_Y}" x2="${SVG_W - PAD_R}" y2="${BASE_Y}"
        stroke="rgba(148,163,184,0.15)" stroke-width="1"/>`;

    // ── Columns ──────────────────────────────────────────────────
    const cols = transactions.map(({ amount, object }, i) => {
      const name   = object?.name || "Unknown";
      const barH   = Math.max(4, (amount / maxXP) * MAX_H);
      const barY   = BASE_Y - barH;
      const cx     = PAD_L + i * (COL_W + GAP) + COL_W / 2;
      const barX   = cx - COL_W / 2;
      const hue    = 210 + i * 15;
      const kbVal  = (amount / 1000).toFixed(1);
      const pct    = Math.round((amount / maxXP) * 100);
      const delay  = (i * 0.055).toFixed(3);

      // truncate label to 10 chars to avoid overlap
      const label  = name.length > 10 ? name.slice(0, 9) + "…" : name;

      return `
        <g>
          <!-- subtle glow behind bar -->
          <rect x="${barX + 4}" y="${barY + 4}" width="${COL_W - 8}" height="${barH}"
            fill="hsl(${hue},80%,55%)" rx="5" opacity="0.18"
            style="filter:blur(7px)"/>

          <!-- main column — grows from baseline up -->
          <rect x="${barX}" y="${barY}" width="${COL_W}" height="${barH}"
            fill="url(#vcg${i})" rx="6"
            style="transform-origin:${cx}px ${BASE_Y}px;
                   animation:scaleInY 0.6s ${delay}s cubic-bezier(.4,0,.2,1) both"/>

          <!-- rank number inside bar (near bottom), only if bar tall enough -->
          ${barH > 28 ? `
          <text x="${cx}" y="${BASE_Y - 10}" fill="rgba(255,255,255,0.45)"
            font-size="11" font-weight="800" text-anchor="middle"
            font-family="inherit">${i + 1}</text>` : ""}

          <!-- kB + % label above bar -->
          <text x="${cx}" y="${barY - 18}" fill="hsl(${hue},70%,72%)"
            font-size="11" font-weight="700" text-anchor="middle"
            font-family="inherit">${kbVal}k</text>
          <text x="${cx}" y="${barY - 6}" fill="rgba(148,163,184,0.7)"
            font-size="9" text-anchor="middle"
            font-family="inherit">${pct}%</text>

          <!-- project name — rotated 45° at bottom -->
          <text
            transform="translate(${cx}, ${BASE_Y + 10}) rotate(45)"
            fill="#64748b" font-size="11" font-weight="500"
            text-anchor="start" dominant-baseline="middle"
            font-family="inherit">${label}</text>
        </g>`;
    }).join("");

    return `
      <div class="graph-card">
        <h2>Top Projects by XP</h2>
        <div class="chart-scroll">
          <svg viewBox="0 0 ${SVG_W} ${SVG_H}"
            width="${SVG_W}" height="${SVG_H}"
            style="display:block;min-width:${SVG_W}px">
            <defs>${defs}</defs>
            ${guides}
            ${baseline}
            ${cols}
          </svg>
        </div>
      </div>

      <style>
        @keyframes scaleInY {
          from { transform: scaleY(0); }
          to   { transform: scaleY(1); }
        }
      </style>`;
  }
}
