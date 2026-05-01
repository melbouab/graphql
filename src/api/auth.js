// src/api/auth.js

export default class Auth {
  static async login(identifier, password) {
    const credentials = btoa(`${identifier.trim()}:${password}`);

    const response = await fetch(
      "https://learn.zone01oujda.ma/api/auth/signin",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Invalid credentials");
      }
      throw new Error(`Auth failed: ${response.status}`);
    }

    const token = await response.json();

    if (!token || typeof token !== "string") {
      throw new Error("Unexpected response from auth server");
    }

    return token;
  }
}
