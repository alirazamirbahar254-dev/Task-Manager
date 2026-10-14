lucide.createIcons()
const username = document.querySelector("#normal-text");
const useremail = document.querySelector("#email")
const editname = document.querySelector("#edit-text");


editname.value = localStorage.getItem("name").charAt(0).toUpperCase() + localStorage.getItem("name").slice(1);
username.textContent = localStorage.getItem("name").charAt(0).toUpperCase() + localStorage.getItem("name").slice(1);
useremail.textContent=localStorage.getItem("email")

username.addEventListener("click", () => {
editname.classList.add("active");
username.classList.add("hidden");
})






