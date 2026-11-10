import  api_base_url  from "../../../config.js";

document.addEventListener("click", async(event) => {
if (!(event.target instanceof Element) || !event.target.closest("#delete_all")) return;

const token = localStorage.getItem("token");
try{ 
const response = await fetch (`${api_base_url}/auth/delete_account`,{

method:"POST",
headers:{
    "content-type":"application/json",
    "Authorization": `Bearer ${token}`
}
})

const data = await response.json()
if(!response.ok){
  return alert(data.message)
}
alert(data.message);
localStorage.removeItem("token");
localStorage.removeItem("name");
localStorage.removeItem("email");
window.location.href = "../../signin.html"

}catch(error){
console.error(error)
console.error("Internal Server Error",error)
}
});
