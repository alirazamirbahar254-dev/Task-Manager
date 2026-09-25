const signin = document.querySelector("#signin");
const login = document.querySelector("#login");
const signup = document.querySelector("#signup");

signup.addEventListener("click", () =>{
window.location = "signup.html"
});

console.log("signin.js loaded");
login.addEventListener("click", async () =>{

const email = document.querySelector("#email").value;
const password = document.querySelector("#password").value;
try {
    
const userdata = {email:email, password:password}
console.log("before fetch");
const response = await fetch(`http://localhost:3000/auth/login`,{

method : "POST",

headers : {
    "content-type" : "application/JSON",
},

body : JSON.stringify(userdata)
});
console.log(response.status);
const data = await response.json()

//redirect to task manager after login
if(response.status === 200){
console.log("Login successful")
window.location = "index.html"
}

localStorage.setItem("token",data.token)
console.log(data)

}
catch(error) {
   console.log(error)
}
})




