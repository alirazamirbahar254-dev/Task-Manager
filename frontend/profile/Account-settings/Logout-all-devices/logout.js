import  api_base_url  from "../../../config.js";
const log_out = document.querySelector("#logout-popup-container");
log_out.addEventListener("click", async() => {
    console.log("LOGOUT ALL CONTROLLER HIT")
const token = localStorage.getItem("token");
try{ 
const response = await fetch(`${api_base_url}/auth/logout_all`,{

method:"POST",
headers:{
    "Content-Type":"application/json",
    "Authorization": `Bearer ${token}`
},
});

const data = await response.json()
if(!response.ok){
return data.message

}
localStorage.removeItem("token");
localStorage.removeItem("name");
localStorage.removeItem("email");
window.location.href = "../../signin.html"
}catch (error){
    console.error(error)
console.error("Internal Server Error",error)
}
});

