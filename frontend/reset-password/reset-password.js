//reading the token and filder
const params =new URLSearchParams(window.location.search);
const token = params.get("token");
const resetpassword = document.querySelector("#reset-password");
const message = document.querySelector("#message");

resetpassword.addEventListener("click", async() => {
const newpassword = document.querySelector("#new-password").value;
const confirmpassword = document.querySelector("#confirm-password").value;
if(newpassword !== confirmpassword) {
    message.textContent = "Passwords do not match!";
reture;
}

const response = await fetch("http://127.0.0.1:3000/auth/resetpassword", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    newpassword,
    confirmpassword,
    token
  })
});

const data = await response.json();
message.textContent = data.message || data.error;

}) 


