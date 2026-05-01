# GraphQL Profile — Zone01 Oujda

A personal profile page built with vanilla JavaScript and the GraphQL API provided by Zone01 Oujda. No frameworks, no libraries — pure HTML, CSS, and JS modules.

**Live demo:** `https://melbouab.github.io/graphql/`

---

## Features

- **Login page** — supports username or email + password (Basic Auth / JWT)
- **Profile page** with 4 sections:
  1. User Identification — name, username, email, user ID
  2. XP & Progress — total XP, projects completed, top project
  3. Audits — audit ratio, done vs received
  4. Statistics — 3 interactive SVG graphs
- **Logout** — clears JWT and returns to login
- **Responsive design** — works on mobile, tablet, and desktop
- **Glassmorphism UI** — dark mode with neon teal/purple accents

---

## Graphs (SVG)

| Graph | Type | Data source |
|---|---|---|
| Audit Ratio | Donut chart | `user.totalUp` / `user.totalDown` |
| Skill Levels | Horizontal bar chart | `transaction(type: skill_*)` |
| Top Projects by XP | Vertical column chart | `transaction { object { name } }` (nested) |

---

## GraphQL Queries Used

### 1. Normal Query
```graphql
{
  user {
    id
    login
    firstName
    lastName
    email
    auditRatio
    totalUp
    totalDown
    avatarUrl
  }
}
```

### 2. Query with Arguments
```graphql
{
  transaction(
    where: {
      eventId: { _eq: 41 }
      type: { _eq: "xp" }
      _and: [
        { path: { _nlike: "%piscine-go%" } }
        { path: { _nlike: "%exam%" } }
      ]
    }
    order_by: { createdAt: asc }
  ) {
    amount
    createdAt
    path
  }
}
```

### 3. Nested Query
```graphql
{
  transaction(
    where: { eventId: { _eq: 41 }, type: { _eq: "xp" } }
    order_by: { amount: desc }
    limit: 10
  ) {
    amount
    path
    object {
      name
      type
    }
  }
}
```

---

## Project Structure

```
graphql/
├── index.html
├── README.md
└── src/
    ├── main.js                    # App entry point — login/profile routing
    ├── api/
    │   ├── auth.js                # JWT login via Basic Auth
    │   └── queries.js             # All GraphQL queries + fetchData()
    ├── pages/
    │   ├── login.js               # Login page render + submit handler
    │   └── profile.js             # Profile page render + 4 sections
    ├── graphComponents/
    │   ├── projectsRatio.js       # Donut chart — audit ratio
    │   ├── skillsGraph.js         # Horizontal bars — skill levels
    │   └── topProjects.js         # Vertical columns — top projects
    └── styles/
        ├── main.css               # Design tokens, reset, body
        ├── login.css              # Login page styles
        └── profile.css            # Profile + cards + graphs layout
```

---

## How to Run Locally

```bash
# Clone the repo
git clone https://learn.zone01oujda.ma/git/melbouab/graphql
cd graphql

# Serve with any static server (no build step needed)
npx serve .
# or
python3 -m http.server 3000
```

Then open `http://localhost:3000` in your browser.

---

## How to Deploy (GitHub Pages)

```bash
# 1. Create a new GitHub repo named "graphql"
# 2. Push your files
git init
git add .
git commit -m "feat: graphql profile"
git remote add origin https://github.com/melbouab/graphql.git
git push -u origin main

# 3. Go to Settings → Pages → Branch: main → Save
# 4. Your site is live at: https://melbouab.github.io/graphql/
```

---

## Authentication Flow

```
User enters credentials
        ↓
btoa(identifier:password) → Basic Auth header
        ↓
POST /api/auth/signin
        ↓
JWT token stored in localStorage
        ↓
All GraphQL requests use: Authorization: Bearer <token>
        ↓
401 response → auto-logout + redirect to login
```