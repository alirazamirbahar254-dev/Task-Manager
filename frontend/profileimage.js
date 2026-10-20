import api_base_url from "./config.js";

export async function loadProfileImage() {
const images = document.querySelectorAll("[data-profile-img]");
const image = document.querySelector("#image");
const letter = document.querySelector("#letter");

const token = localStorage.getItem("token");
const response = await fetch(`${api_base_url}/auth/getprofile_image`,{
    method : "GET",
    headers:{
        "Authorization": `Bearer ${token}`
    }
})

if(!response.ok)  return;

const data = await response.blob()

images.forEach((img) => {
    img.src = URL.createObjectURL(data);
    img.classList.add("active");
});

letter.classList.add("hidden");
image.classList.add("active")


}


