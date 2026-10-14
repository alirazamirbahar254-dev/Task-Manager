const name = document.querySelector("#username");
const email = document.querySelector("#useremail");
const innerletter = document.querySelector("#inner-letter");
const image = document.querySelector("#image");
const profilebtn = document.querySelector("#profilebtn");
const profilemenu = document.querySelector(".profile-menu");
const outerletter = document.querySelector("#outer-letter");
const profilebtnimg = document.querySelector("#profilebtn img");
const profile = document.querySelector("#edit")
const settings = document.querySelector("#settings")
const logout = document.querySelector("#logout")

 name.textContent = localStorage.getItem("name")
 email.textContent = localStorage.getItem("email")

innerletter.textContent = localStorage.getItem("name").charAt(0).toUpperCase()
outerletter.textContent = localStorage.getItem("name").charAt(0).toUpperCase()

image.addEventListener("load", () => {
image.classList.add("active");
  innerletter.classList.remove("active");
})

image.addEventListener("error", () => {
 innerletter.classList.add("active");
  image.classList.remove("active");
})
 
profilebtnimg.addEventListener("load", () => {
  profilebtnimg.classList.add("active");
  outerletter.classList.remove("active");
})

profilebtnimg.addEventListener("error", () => {
profilebtnimg.classList.remove("active");
  outerletter.classList.add("active");
})

profile.addEventListener("click", () => {
window.location.href = "/frontend/profile/profile-settings/settings.html";
})