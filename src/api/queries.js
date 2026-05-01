// src/api/queries.js

export const USER_INFO_QUERY = `
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
`;

export const XP_QUERY = `
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
`;


export const XP_WITH_PROJECTS_QUERY = `
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
`;

export const SKILLS_QUERY = `
  {
    transaction(where: { type: { _like: "skill_%" } }) {
      type
      amount
    }
  }
`;

export default class Api {
  static async fetchData(query) {
    const token = localStorage.getItem("jwt");

    if (!token) {
      throw new Error("No JWT token found. Please login.");
    }

    const response = await fetch(
      "https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("jwt");
        window.location.reload();
      }
      throw new Error(`GraphQL request failed: ${response.status}`);
    }

    const json = await response.json();

    if (json.errors) {
      throw new Error(json.errors[0]?.message || "GraphQL error");
    }

    return json;
  }
}
