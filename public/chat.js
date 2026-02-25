// public/chat.js

const form = document.getElementById("chat-form");
const inputBox = document.getElementById("message-input");
const chatWindow = document.getElementById("chat-window");

// --------------------------------
// Create message bubbles
// --------------------------------
function addMessage(text, sender) {
  const message = document.createElement("div");
  message.className =
    sender === "user" ? "user-message" : "ai-message";

  message.textContent = text;

  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// --------------------------------
// Send Message
// --------------------------------
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = inputBox.value.trim();
  if (!message) return;

  addMessage(message, "user");
  inputBox.value = "";

  // loading placeholder
  const loading = document.createElement("div");
  loading.className = "ai-message";
  loading.textContent = "Thinking...";
  chatWindow.appendChild(loading);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: message,

        // ✅ Stage 7C Student Identity
        userId: "student-1"
      })
    });

    const data = await response.json();

    loading.remove();

    addMessage(data.reply, "ai");

  } catch (err) {
    loading.textContent = "Server error. Try again.";
    console.error(err);
  }
});
