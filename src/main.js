// src/main.js
import Login from "./pages/login.js";
import Profile from "./pages/profile.js";

const app = document.getElementById("app");

async function init() {
  if (localStorage.getItem("jwt")) {
    document.body.classList.remove("login-page");
    document.body.classList.add("profile-page");

    app.innerHTML = `
      <div class="loading-screen">
        <div class="loading-inner">
          <div class="loading-spinner"></div>
          <p>Loading your profile…</p>
        </div>
      </div>
    `;

    const profilePage = new Profile();
    app.innerHTML = await profilePage.render();
    profilePage.setupEvents();
  } else {
    document.body.classList.add("login-page");
    document.body.classList.remove("profile-page");

    const loginPage = new Login();
    app.innerHTML = loginPage.htmlLogin();

    document.getElementById("login-form").addEventListener("submit", async (e) => {
      await loginPage.handleSubmit(e);
      if (localStorage.getItem("jwt")) {
        window.location.reload();
      }
    });
  }
}

init();
