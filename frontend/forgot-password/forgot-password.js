import api_base_url from "../config.js";

const sendpassword = document.querySelector("#send-password");
const message = document.querySelector("#message");

sendpassword.addEventListener("click", async() => {
const email = document.querySelector("#email").value;

const response = await fetch(`${api_base_url}/auth/forgotpassword`,{
method: "POST",
headers: {
    "content-type" : "application/JSON",
},
body: JSON.stringify({email:email})

})

const data = await response.json()
if(!response.ok){

message.textContent = data.message;
} else {
  message.textContent = data.message;
}

})
lucide.createIcons();
