//for urls

const front_url = "127.0.0.1";
const front_localhost = "localhost";
const back_localhost = "http://localhost:3000";
const back_vercel = "https://task-manager-rc1uiq36f-aliraza-s-project.vercel.app";

let api_base_url;

if(window.location.hostname === front_url || window.location.hostname === front_localhost){
    api_base_url = back_localhost
}else {
    api_base_url = back_vercel 
}

export default api_base_url;