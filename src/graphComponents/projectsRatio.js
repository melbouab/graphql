
export default class ProjectsRatio {
  static render(totalUp, totalDown) {
    const total = totalUp + totalDown;
    if (total === 0) return `
      <div class="graph-card">
        <h2>Audit Ratio</h2>
        <p style="color:var(--text-muted);text-align:center;padding:3rem 0">No audit data.</p>
      </div>`;

    const ratio      = totalDown > 0 ? (totalUp / totalDown).toFixed(2) : "∞";
    const upPct      = Math.round((totalUp  / total) * 100);
    const downPct    = 100 - upPct;
    const upKB       = (totalUp  / 1000).toFixed(1);
    const downKB     = (totalDown / 1000).toFixed(1);

    const R   = 110;  // radius
    const CX  = 160;  // centre x
    const CY  = 160;  // centre y
    const SW  = 28;   // stroke-width
    const C   = 2 * Math.PI * R;
    const upArc = (totalUp / total) * C;

    const R2  = 70;
    const C2  = 2 * Math.PI * R2;
    const clampedRatio = Math.min(parseFloat(ratio) || 0, 3); // cap at 3x for display
    const ratioArc = (clampedRatio / 3) * C2;

    return `
      <div class="graph-card" style="grid-column:1/-1">
        <h2>Audit Ratio</h2>
        <div class="audit-ratio-layout">

          <!-- ── Left: Donut ── -->
          <div class="donut-wrap">
            <svg viewBox="0 0 320 320" class="donut-svg">
              <defs>
                <linearGradient id="upGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%"   stop-color="#10b981"/>
                  <stop offset="100%" stop-color="#34d399"/>
                </linearGradient>
                <linearGradient id="downGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%"   stop-color="#ef4444"/>
                  <stop offset="100%" stop-color="#f87171"/>
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>

              <!-- track ring -->
              <circle cx="${CX}" cy="${CY}" r="${R}"
                fill="none" stroke="#1e293b" stroke-width="${SW}"/>

              <!-- down arc (full, red underneath) -->
              <circle cx="${CX}" cy="${CY}" r="${R}"
                fill="none" stroke="url(#downGrad)" stroke-width="${SW}"
                stroke-dasharray="${C}" stroke-dashoffset="0"
                transform="rotate(-90 ${CX} ${CY})"/>

              <!-- up arc (green on top) -->
              <circle cx="${CX}" cy="${CY}" r="${R}"
                fill="none" stroke="url(#upGrad)" stroke-width="${SW}"
                stroke-dasharray="${upArc} ${C}"
                stroke-dashoffset="0"
                stroke-linecap="round"
                transform="rotate(-90 ${CX} ${CY})"
                filter="url(#glow)"
                style="transition:stroke-dasharray 1.4s cubic-bezier(.4,0,.2,1)"/>

              <!-- inner ratio ring -->
              <circle cx="${CX}" cy="${CY}" r="${R2}"
                fill="none" stroke="#1e293b" stroke-width="6"/>
              <circle cx="${CX}" cy="${CY}" r="${R2}"
                fill="none" stroke="#3b82f6" stroke-width="6"
                stroke-dasharray="${ratioArc} ${C2}"
                stroke-dashoffset="0"
                transform="rotate(-90 ${CX} ${CY})"
                style="transition:stroke-dasharray 1.6s cubic-bezier(.4,0,.2,1)"/>

              <!-- centre text -->
              <text x="${CX}" y="${CY - 14}" fill="#94a3b8"
                font-size="13" text-anchor="middle" font-weight="600">RATIO</text>
              <text x="${CX}" y="${CY + 22}" fill="#f1f5f9"
                font-size="38" text-anchor="middle" font-weight="900"
                font-family="inherit">${ratio}</text>
            </svg>
          </div>

          <!-- ── Right: Stats ── -->
          <div class="audit-stats">

            <div class="audit-stat-block">
              <div class="audit-stat-dot" style="background:var(--success)"></div>
              <div>
                <div class="audit-stat-label">Audits Done</div>
                <div class="audit-stat-value">${upKB} <span>kB</span></div>
              </div>
              <div class="audit-stat-pct" style="color:var(--success)">${upPct}%</div>
            </div>

            <div class="audit-bar-wrap">
              <div class="audit-bar-track">
                <div class="audit-bar-fill success"
                  style="width:${upPct}%"></div>
              </div>
            </div>

            <div class="audit-stat-block" style="margin-top:1rem">
              <div class="audit-stat-dot" style="background:var(--danger)"></div>
              <div>
                <div class="audit-stat-label">Audits Received</div>
                <div class="audit-stat-value">${downKB} <span>kB</span></div>
              </div>
              <div class="audit-stat-pct" style="color:var(--danger)">${downPct}%</div>
            </div>

            <div class="audit-bar-wrap">
              <div class="audit-bar-track">
                <div class="audit-bar-fill danger"
                  style="width:${downPct}%"></div>
              </div>
            </div>

            <div class="audit-ratio-badge">
              <span>${parseFloat(ratio) >= 1 ? '✅' : '⚠️'}</span>
              <span>${parseFloat(ratio) >= 1
                ? 'Good standing — keep it up!'
                : 'Do more audits to improve your ratio'}</span>
            </div>
          </div>
        </div>
      </div>

      <style>
        .audit-ratio-layout {
          display: flex;
          align-items: center;
          gap: 3rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        .donut-wrap { flex-shrink: 0; }
        .donut-svg  { width: 240px; height: 240px; }
        .audit-stats {
          flex: 1;
          min-width: 220px;
          max-width: 360px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .audit-stat-block {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .audit-stat-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .audit-stat-block > div:nth-child(2) { flex: 1; }
        .audit-stat-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          font-weight: 600;
        }
        .audit-stat-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text);
        }
        .audit-stat-value span {
          font-size: 0.9rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .audit-stat-pct {
          font-size: 1.1rem;
          font-weight: 800;
        }
        .audit-bar-wrap { padding: 0 0 0 1.5rem; }
        .audit-bar-track {
          background: var(--bg);
          border-radius: 999px;
          height: 10px;
          overflow: hidden;
        }
        .audit-bar-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 1.2s cubic-bezier(.4,0,.2,1);
        }
        .audit-bar-fill.success { background: linear-gradient(90deg,#059669,#10b981); }
        .audit-bar-fill.danger  { background: linear-gradient(90deg,#dc2626,#ef4444); }
        .audit-ratio-badge {
          margin-top: 1.25rem;
          padding: 0.75rem 1rem;
          background: var(--bg);
          border: 1px solid var(--border-2);
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        @media(max-width:600px){
          .donut-svg { width: 180px; height: 180px; }
          .audit-ratio-layout { gap: 1.5rem; }
        }
      </style>
    `;
  }
}
