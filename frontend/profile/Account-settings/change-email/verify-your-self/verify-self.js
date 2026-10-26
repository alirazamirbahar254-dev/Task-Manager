import api_base_url from "../../../../config.js";
document.addEventListener("DOMContentLoaded", () => {
    verifyemail();
})

lucide.createIcons();
const email = document.querySelector("#email_mask");
const lemail = localStorage.getItem("email");
const message = document.querySelector("#message");
const token = localStorage.getItem("token");


// Masking to the email
let spliteemail = lemail.split("@");
let name = spliteemail[0];
let letters = name.slice(0, 2);
let maskedemail = letters + "****" + "@" + spliteemail[1]
email.textContent = (maskedemail);

async function verifyemail() { 
const response  = await fetch(`${api_base_url}/auth/verifyemail`,{
    
    method: "POST",
    headers:{
        "Authorization": `Bearer ${token}`
    }
})

 const data = await response.json()
 if(!response.ok){
  message.textContent = data.message;
  message.classList.add("error-message")

 }else{

  message.textContent = data.message
  message.classList.add("success-message")
 }







}






