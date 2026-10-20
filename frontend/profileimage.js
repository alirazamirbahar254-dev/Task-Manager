import api_base_url from "./config.js";

export async function loadProfileImage() {
const images = document.querySelectorAll("[data-profile-img]");

const showLetter = (image) => {
    image.classList.remove("active");
    const letter = image.parentElement.querySelector("span");
    if (letter?.id === "letter") {
        letter.classList.remove("hidden");
    } else {
        letter?.classList.add("active");
    }
};

const showImage = (image) => {
    image.classList.add("active");
    const letter = image.parentElement.querySelector("span");
    if (letter?.id === "letter") {
        letter.classList.add("hidden");
    } else {
        letter?.classList.remove("active");
    }
};

images.forEach(showLetter);

const token = localStorage.getItem("token");
const response = await fetch(`${api_base_url}/auth/getprofile_image`,{
    method : "GET",
    headers:{
        "Authorization": `Bearer ${token}`
    }
})

if(!response.ok) return;

const data = await response.blob()

images.forEach((img) => {
    const imageUrl = URL.createObjectURL(data);
    const onLoad = () => {
        showImage(img);
        img.removeEventListener("error", onError);
        URL.revokeObjectURL(imageUrl);
    };
    const onError = () => {
        showLetter(img);
        img.removeEventListener("load", onLoad);
        URL.revokeObjectURL(imageUrl);
    };

    img.addEventListener("load", onLoad, { once: true });
    img.addEventListener("error", onError, { once: true });
    img.src = imageUrl;
});
}

