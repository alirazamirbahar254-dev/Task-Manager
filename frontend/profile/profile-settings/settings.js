import api_base_url from "../../config.js";

lucide.createIcons()
const username = document.querySelector("#normal-text");
const useremail = document.querySelector("#email")
const editname = document.querySelector("#edit-text");
const message = document.querySelector("#message");
const nameicon = document.querySelector("#name-icon");

const token1 = localStorage.getItem("token");
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
    "Authorization" : `Bearer ${token1}`
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






