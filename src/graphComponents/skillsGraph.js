// src/components/graphs/skillsGraph.js

export default class SkillsGraph {
  static render(transactions) {
    const skills = {};
    transactions.forEach((tx) => {
      const name = tx.type.replace("skill_", "");
      if (!skills[name] || tx.amount > skills[name]) skills[name] = tx.amount;
    });

    const sorted = Object.entries(skills).sort((a, b) => b[1] - a[1]);
    if (!sorted.length) return `
      <div class="graph-card">
        <h2>Skill Levels</h2>
        <p style="color:var(--text-muted);text-align:center;padding:3rem 0">No skill data.</p>
      </div>`;

    const maxVal  = sorted[0][1];
    const ROW_H   = 42;
    const LABEL_W = 106;
    const VALUE_W = 36;
    const BAR_X   = LABEL_W + 10;
    const SVG_W   = 560;
    const BAR_MAX = SVG_W - BAR_X - VALUE_W - 10;
    const SVG_H   = sorted.length * ROW_H + 8;

    const bars = sorted.map(([name, amount], i) => {
      const hue   = 200 + i * 12;
      const color = `hsl(${hue}, 75%, 58%)`;
      const barW  = Math.max(4, (amount / maxVal) * BAR_MAX);
      const pct   = Math.round((amount / maxVal) * 100);
      const cy    = i * ROW_H + ROW_H / 2 + 4;
      const label = name.charAt(0).toUpperCase() + name.slice(1);
      const delay = (i * 0.045).toFixed(3);

      return `
        <g>
          <!-- label -->
          <text x="${LABEL_W}" y="${cy + 5}" fill="#94a3b8" font-size="12"
            font-weight="500" text-anchor="end" font-family="inherit">${label}</text>

          <!-- track -->
          <rect x="${BAR_X}" y="${cy - 9}" width="${BAR_MAX}" height="18"
            fill="rgba(15,23,42,0.8)" rx="9"/>

          <!-- bar — grows left to right -->
          <rect x="${BAR_X}" y="${cy - 9}" width="${barW}" height="18"
            fill="${color}" rx="9" opacity="0.9"
            style="transform-origin:${BAR_X}px ${cy}px;
                   animation:scaleInX 0.55s ${delay}s cubic-bezier(.4,0,.2,1) both"/>

          <!-- % inside bar -->
          ${barW > 40 ? `
          <text x="${BAR_X + barW - 8}" y="${cy + 5}"
            fill="rgba(255,255,255,0.55)" font-size="9" font-weight="700"
            text-anchor="end" font-family="inherit">${pct}%</text>` : ""}

          <!-- value on the right -->
          <text x="${BAR_X + BAR_MAX + 8}" y="${cy + 5}"
            fill="hsl(${hue},50%,65%)" font-size="11" font-weight="700"
            font-family="inherit">${amount}</text>
        </g>`;
    }).join("");

    return `
      <div class="graph-card">
        <h2>Skill Levels</h2>
        <div class="chart-scroll">
          <svg width="100%" viewBox="0 0 ${SVG_W} ${SVG_H}"
            style="display:block;min-width:240px;overflow:visible">
            ${bars}
          </svg>
        </div>
      </div>`;
  }
}
