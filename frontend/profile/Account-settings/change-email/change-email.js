import showMessage from "../../../messages.js";
import api_base_url from "../../../config.js";

lucide.createIcons();
const continuebtn = document.querySelector("#change_email_btn")
const token = localStorage.getItem("token");

continuebtn.addEventListener("click", async() => {

try{
const email = document.querySelector("#new_email").value

console.log("Email:", email);
if(email === ""){
 return showMessage("Please enter your new email address!", "error-message");
}

const response = await fetch(`${api_base_url}/auth/change_email`, {
  method:"POST",

  headers:{
    "Content-Type":"Application/json",
     "Authorization": `Bearer ${token}`
  },

  body : JSON.stringify({email})

})
 
const data = await response.json()
console.log("Backend response:", data);

if(!response.ok){
    showMessage(data.message, "error-message");
    
}else{
    showMessage(data.message, "success-message");
    window.location.href = "/frontend/profile/Account-settings/change-email/verify-email/verify-email.html";
    verifybtn.disabled = true;
}

}catch (error){
    console.log("failed to verify")
    verifybtn.disabled = true;
}

})


