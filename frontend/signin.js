const signin = document.querySelector("#signin");
const login = document.querySelector("#login");
const signup = document.querySelector("#signup");
const forgotpassword=document.querySelector("#forgotpassword")

signup.addEventListener("click", () =>{
window.location = "signup.html"
});

login.addEventListener("click", async () =>{

const email = document.querySelector("#email").value;
const password = document.querySelector("#password").value;
try {

const userdata = {email:email, password:password}
console.log("before fetch");
const response = await fetch(`http://127.0.0.1:3000/auth/login`,{

method : "POST",
  credentials: "include",

headers : {
    "content-type" : "application/JSON",
},

body : JSON.stringify(userdata)
});
console.log(response.status);
const data = await response.json()

//redirect to task manager after login
if (!response.ok) {
  alert(data.message || "Incorrect email or password");
  return;
}

localStorage.setItem("token", data.token);
window.location = "index.html";
console.log(data)

}
catch(error) {
   console.log(error)
}
})

forgotpassword.addEventListener("click", () => {
window.location = "forgot-password/forgot-password.html"
})