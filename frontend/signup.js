// Get Sign Up form values 
const signup = document.querySelector("#signup");


// Listen for Sign Up button click
signup.addEventListener("click", async () =>{

//geting the values of fields
const name1 = document.querySelector("#name1").value;
const name2 = document.querySelector("#name2").value;
const email = document.querySelector("#email").value;
const password1 = document.querySelector("#password1").value;
const password2 = document.querySelector("#password2").value;
const terms = document.querySelector("#terms").checked;


//validation 
if(name1 === "" || name2 === "" || email === "" || password1 === "" || password2 === "" || terms === false ){
    alert("please fill the all fields");
    return
}


const userdata = {  name:name1 + " " + name2,    email:email,  password:password1, }

const response = await fetch(`http://localhost:3000/auth/register`,
    {
    method:"POST",

    headers : {
    "content-type" : "application/json",
      }, 

    body :JSON.stringify(userdata),
    
    })
     const data = await response.json()
     console.log(data);
})

