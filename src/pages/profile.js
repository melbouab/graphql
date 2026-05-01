// src/pages/profile.js
import Api, {
  USER_INFO_QUERY,
  XP_QUERY,
  XP_WITH_PROJECTS_QUERY,
  SKILLS_QUERY,
} from "../api/queries.js";
import ProjectsRatio from "../graphComponents/projectsRatio.js";
import SkillsGraph    from "../graphComponents/skillsGraph.js";
import TopProjects    from "../graphComponents/topProjects.js";

export default class Profile {
  async render() {
    try {
      const [userRes, xpRes, nestedRes, skillsRes] = await Promise.all([
        Api.fetchData(USER_INFO_QUERY),         
        Api.fetchData(XP_QUERY),                
        Api.fetchData(XP_WITH_PROJECTS_QUERY),   
        Api.fetchData(SKILLS_QUERY),       
      ]);

      const user             = userRes.data.user[0];
      const xpTransactions   = xpRes.data.transaction;
      const nestedTx         = nestedRes.data.transaction;
      const skillsTx         = skillsRes.data.transaction;

      // ── XP calculation (deduplicated by path) ──────────────────────────────
      const xpByPath = {};
      xpTransactions.forEach((tx) => {
        if (!xpByPath[tx.path] || tx.amount > xpByPath[tx.path]) {
          xpByPath[tx.path] = tx.amount;
        }
      });
      const totalXp    = Object.values(xpByPath).reduce((a, b) => a + b, 0);
      const auditRatio = user.totalDown > 0
        ? (Math.round(user.auditRatio * 10) / 10).toFixed(1)
        : "N/A";

      const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.login;

      const avatarHtml = user.avatarUrl
        ? `<img src="${user.avatarUrl}" class="profile-image" alt="avatar" />`
        : `<div class="profile-image avatar-fallback">${user.login[0].toUpperCase()}</div>`;

      return `
        <div class="profile-container">

          <!-- ── TOP BAR ────────────────────────────────────── -->
          <header>
            ${avatarHtml}
            <div class="header-info">
              <h1>${fullName}</h1>
              <span>@${user.login}</span>
            </div>
            <button id="logout-btn">Logout</button>
          </header>

          <!-- ════════════════════════════════════════════════ -->
          <!-- SECTION 1 · User Identification                  -->
          <!-- ════════════════════════════════════════════════ -->
          <section class="profile-section" id="section-identification">
            <h2 class="section-title">
              <span class="section-number">01</span> User Identification
            </h2>
            <div class="user-info">
              <div class="info-card">
                <span class="card-label">Username</span>
                <span class="card-value">${user.login}</span>
              </div>
              <div class="info-card">
                <span class="card-label">Full Name</span>
                <span class="card-value">${fullName}</span>
              </div>
              <div class="info-card">
                <span class="card-label">Email</span>
                <span class="card-value" style="font-size:0.95rem;">${user.email}</span>
              </div>
              <div class="info-card">
                <span class="card-label">User ID</span>
                <span class="card-value">#${user.id}</span>
              </div>
            </div>
          </section>

          <!-- ════════════════════════════════════════════════ -->
          <!-- SECTION 2 · XP & Progress                        -->
          <!-- ════════════════════════════════════════════════ -->
          <section class="profile-section" id="section-xp">
            <h2 class="section-title">
              <span class="section-number">02</span> XP &amp; Progress
            </h2>
            <div class="user-info">
              <div class="info-card highlight">
                <span class="card-label">Total XP</span>
                <span class="card-value">${Math.round(totalXp / 1000)} kB</span>
              </div>
              <div class="info-card">
                <span class="card-label">Projects Completed</span>
                <span class="card-value">${Object.keys(xpByPath).length}</span>
              </div>
              <div class="info-card">
                <span class="card-label">Top Project XP</span>
                <span class="card-value">
                  ${nestedTx.length > 0
                    ? Math.round(nestedTx[0].amount / 1000) + " kB — " + (nestedTx[0].object?.name || "?")
                    : "N/A"}
                </span>
              </div>
            </div>
          </section>

          <!-- ════════════════════════════════════════════════ -->
          <!-- SECTION 3 · Audits                               -->
          <!-- ════════════════════════════════════════════════ -->
          <section class="profile-section" id="section-audits">
            <h2 class="section-title">
              <span class="section-number">03</span> Audits
            </h2>
            <div class="user-info">
              <div class="info-card highlight">
                <span class="card-label">Audit Ratio</span>
                <span class="card-value">${auditRatio}</span>
              </div>
              <div class="info-card">
                <span class="card-label">Audits Done</span>
                <span class="card-value" style="color:var(--success);">${Math.round(user.totalUp / 1000)} kB</span>
              </div>
              <div class="info-card">
                <span class="card-label">Audits Received</span>
                <span class="card-value" style="color:var(--danger);">${Math.round(user.totalDown / 1000)} kB</span>
              </div>
            </div>
          </section>

          <!-- ════════════════════════════════════════════════ -->
          <!-- SECTION 4 · Statistics (mandatory graphs)        -->
          <!-- ════════════════════════════════════════════════ -->
          <section class="profile-section" id="section-stats">
            <h2 class="section-title">
              <span class="section-number">04</span> Statistics
            </h2>
            <div id="graphs-container">
              ${ProjectsRatio.render(user.totalUp, user.totalDown)}
              ${SkillsGraph.render(skillsTx)}
              ${TopProjects.render(nestedTx)}
            </div>
          </section>

        </div>
      `;
    } catch (error) {
      console.error(error);
      return `
        <div style="display:flex;flex-direction:column;align-items:center;
          justify-content:center;min-height:100vh;gap:1rem;padding:2rem;">
          <p style="color:var(--danger);font-size:1.1rem;">Error loading profile data.</p>
          <p style="color:var(--text-muted);font-size:0.9rem;">${error.message}</p>
          <button id="logout-btn" style="margin-top:1rem;padding:0.6rem 1.5rem;
            background:var(--danger);color:white;border:none;border-radius:8px;
            cursor:pointer;font-weight:600;">Logout</button>
        </div>
      `;
    }
  }

  setupEvents() {
    document.getElementById("logout-btn")?.addEventListener("click", () => {
      localStorage.removeItem("jwt");
      window.location.reload();
    });
  }
}
