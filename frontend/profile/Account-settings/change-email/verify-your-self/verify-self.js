lucide.createIcons();
const email = document.querySelector("#email_mask");
const lemail = localStorage.getItem("email");

// Masking to the email
let spliteemail = lemail.split("@");
let name = spliteemail[0];
let letters = name.slice(0, 2);
let maskedemail = letters + "****" + "@" + spliteemail[1]
email.textContent = (maskedemail);

