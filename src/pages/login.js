// src/pages/login.js
import Auth from "../api/auth.js";

export default class Login {
  htmlLogin() {
    return `
      <div class="login-container">
        <div class="login-logo">
          <div class="logo-icon">⬡</div>
          <h1>Zone01 Profile</h1>
          <p>Sign in to view your profile</p>
        </div>
        <form id="login-form">
          <div class="input-group">
            <span class="input-icon">👤</span>
            <input type="text" id="identifier"
              placeholder="Username or Email"
              required autocomplete="username" />
          </div>
          <div class="input-group">
            <span class="input-icon">🔒</span>
            <input type="password" id="password"
              placeholder="Password"
              required autocomplete="current-password" />
          </div>
          <button type="submit" class="btn-login">Sign In</button>
          <p id="error-msg" class="hidden"></p>
        </form>
      </div>
    `;
  }

  async handleSubmit(e) {
    e.preventDefault();
    const identifier = document.getElementById("identifier").value.trim();
    const password   = document.getElementById("password").value;
    const errorMsg   = document.getElementById("error-msg");
    const btn        = e.target.querySelector(".btn-login");

    btn.disabled = true;
    btn.textContent = "Signing in…";
    errorMsg.classList.add("hidden");

    try {
      const token = await Auth.login(identifier, password);
      localStorage.setItem("jwt", token);
    } catch {
      errorMsg.textContent = "Invalid credentials. Please try again.";
      errorMsg.classList.remove("hidden");
      btn.disabled = false;
      btn.textContent = "Sign In";
    }
  }
}
