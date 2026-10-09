const sendpassword = document.querySelector("#send-password");
const message = document.querySelector("#message");

sendpassword.addEventListener("click", async() => {
const email = document.querySelector("#email").value;
const response = await fetch(`http://127.0.0.1:3000/auth/forgotpassword`,{
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