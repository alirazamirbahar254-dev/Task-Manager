
function theme(){
const savedtheme = localStorage.getItem("theme")
const isdark = document.body.classList.toggle("dark", savedtheme === "dark");
// localStorage.setItem("theme", isdark ? "dark" : "light")

}
export default theme;