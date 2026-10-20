import api_base_url from "../../config.js";
import { loadProfileImage } from "../../profileimage.js";
document.addEventListener("DOMContentLoaded", () => {
    loadProfileImage();
});

lucide.createIcons()
const username = document.querySelector("#normal-text");
const useremail = document.querySelector("#email")
const editname = document.querySelector("#edit-text");
const message = document.querySelector("#message");
const nameicon = document.querySelector("#name-icon");
const image = document.querySelector("#image");

const imageinput = document.querySelector("#image-input");
const token = localStorage.getItem("token");
const info = document.querySelector(".info")
const letter = document.querySelector("#letter");
letter.textContent = localStorage.getItem("name").charAt(0).toUpperCase()

editname.value = localStorage.getItem("name").charAt(0).toUpperCase() + localStorage.getItem("name").slice(1);
username.textContent = localStorage.getItem("name").charAt(0).toUpperCase() + localStorage.getItem("name").slice(1);
useremail.textContent=localStorage.getItem("email")

username.addEventListener("click", () => {
editname.classList.add("active");
nameicon.classList.add("hidden");
username.classList.add("hidden");
})

editname.addEventListener("keydown", async(e) =>{
    if(e.key === "Enter"){
    e.preventDefault()

const response  = await fetch(`${api_base_url}/auth/editname`,{
    method: "PATCH",
    headers: {
    "content-type" : "application/json",
    "Authorization" : `Bearer ${token}`
},

body: JSON.stringify({username:editname.value})

})

const data = await response.json()
if(!response.ok){

message.textContent = data.message;

} else {
localStorage.setItem("name", editname.value)
username.textContent = editname.value;
editname.classList.remove("active");
username.classList.remove("hidden");
nameicon.classList.remove("hidden");
message.textContent = data.message;

}

    }
})

info.addEventListener("click", () => {
    imageinput.click()
})

imageinput.addEventListener("change", async() => {
    const file = imageinput.files[0]

    if(!file)  return
       
    image.src = URL.createObjectURL(imageinput.files[0])
// making a container for image to send the backend 
    const formdata = new FormData()
    formdata.append("image", imageinput.files[0])

    letter.classList.add("hidden");
    image.classList.add("active")
const response = await fetch(`${api_base_url}/auth/profile_image`,{
      method : "POST",
      headers:{
        "Authorization": `Bearer ${token}`
      },
   body: formdata

})
const data = await response.json()
if(!response.ok){
message.textContent = data.message;
}else{
message.textContent = data.message
}
})
