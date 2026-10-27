import api_base_url from "../../../../config.js";
import showMessage from "../../../../messages.js";
lucide.createIcons();
const token = localStorage.getItem("token");
const email = localStorage.getItem("email");
const masked_email = document.querySelector("#email_mask");
const inputs = document.querySelectorAll(".otp-input");
const verify = document.querySelector("#verify-btn");
const message = document.querySelector("#message");


let split_email = email.split("@");
let name = split_email[0];
let name_letter = name.slice(0, 1);
let maskedemail = name_letter + "****" + "@" + split_email[1];
masked_email.textContent = (maskedemail);

verify.addEventListener("click", async() => {
    try{
const otp = [...inputs].map(input => input.value).join("")

const response = await fetch(`${api_base_url}/auth/change_email_otp`,{

    method:"POST",
    headers:{
         "Content-Type":"application/json",
        "Authorization": `Bearer ${token}`
    },
    body : JSON.stringify({otp})

})

     const data = await response.json();
    
    if(!response.ok){
        showMessage(data.message, "error-message");

    }else{
        showMessage(data.message, "success-message");
        verify.disabled = true;
        
    const isLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);
    window.location.href = isLocal
     ?"/frontend/profile/profile-settings/settings.html"
     :"/profile/profile-settings/settings.html"
    }

    }catch (error){
        console.log(error);
        console.log("failed to verify")
        
    }
})
