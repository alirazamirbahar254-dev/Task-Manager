lucide.createIcons();
document.addEventListener("DOMContentLoaded", () => {
    fetch(`./Logout-all-devices/logout.html`)
    .then(response => response.text())
    .then(html => {
        document.getElementById("logout-popup-container").innerHTML=html;
    })

    fetch(`./delete_account/delete.html`)
    .then(response => response.text())
    .then(html => {
        document.getElementById("delete-popup-container").innerHTML=html;
    })
})



const edit = document.querySelector("#edit");
edit.addEventListener("click", () => {
window.location.href = "change-email/verify-your-self/verify-self.html";
});

const logout_popup_container = document.querySelector("#logout-popup-container");
const logout_devices = document.querySelector(".logout_devices");
const delete_popup_container = document.querySelector("#delete-popup-container");
const delete_account = document.querySelector(".delete_account");

logout_devices.addEventListener("click", () => {
delete_popup_container.classList.remove("active");
logout_popup_container.classList.toggle("active")

})

delete_account.addEventListener("click", () => {
logout_popup_container.classList.remove("active");
delete_popup_container.classList.toggle("active");
})

document.addEventListener("click", (e) => {
if (
logout_devices.contains(e.target) ||
delete_account.contains(e.target) ||
logout_popup_container.contains(e.target) ||
delete_popup_container.contains(e.target)
) return;

logout_popup_container.classList.remove("active")
delete_popup_container.classList.remove("active")
})