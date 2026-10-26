
let messageTimer;
function showMessage(text, className) {
  message.textContent = text;
  message.classList.remove("success-message", "error-message");
  message.classList.add(className);

  clearTimeout(messageTimer);
  messageTimer = setTimeout(() => {
    message.textContent = "";
    message.classList.remove("success-message", "error-message");
  }, 5000);
}

export default showMessage;