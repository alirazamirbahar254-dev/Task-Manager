import { loadProfileImage } from "../profileimage.js";

const name = document.querySelector("#username");
const email = document.querySelector("#useremail");
const innerletter = document.querySelector("#inner-letter");
const profilebtn = document.querySelector("#profilebtn");
const profilemenu = document.querySelector(".profile-menu");
const outerletter = document.querySelector("#outer-letter");
const profile = document.querySelector("#edit")
const settings = document.querySelector("#settings")
const logout = document.querySelector("#logout")

 name.textContent = localStorage.getItem("name")
 email.textContent = localStorage.getItem("email")

 innerletter.textContent = localStorage.getItem("name").charAt(0).toUpperCase()
 outerletter.textContent = localStorage.getItem("name").charAt(0).toUpperCase()

profile.addEventListener("click", () => {
  const isLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);

  window.location.href = isLocal
    ? "/frontend/profile/profile-settings/settings.html"
    : "/profile/profile-settings/settings.html";
});

settings.addEventListener("click", () => {
window.location.href = "/frontend/profile/Account-settings/Account.html";
})