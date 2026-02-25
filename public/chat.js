// Restore AI — Frontend Chat Controller

const chatBox = document.getElementById("chat-box");
const input = document.getElementById("message-input");
const button = document.getElementById("send-button");

// ✅ Create persistent user identity
let userId = localStorage.getItem("restore_user_id");

if (!userId) {
  userId = "user_" + Math.random().toString(36).substring(2, 10);
  localStorage.setItem("restore_user_id", userId);
}

// Add message to UI
function addMessage(text, sender) {
  const message = document.createElement("div");
  message.className = sender === "user" ? "user-message" : "ai-message";
  message.textContent = text;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Send message
async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  addMessage(message, "user");
  input.value = "";

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message,
      userId
    })
  });

  const data = await response.json();
  addMessage(data.reply, "ai");
}

button.addEventListener("click", sendMessage);

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
