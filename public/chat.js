const chat = document.getElementById("chat");
const input = document.getElementById("messageInput");

let memory = {};

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = sender;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  addMessage(message, "user");
  input.value = "";

  const loading = document.createElement("div");
  loading.className = "ai";
  loading.textContent = "...";
  chat.appendChild(loading);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message,
        memory
      })
    });

    const data = await response.json();

    loading.remove();

    addMessage(data.reply, "ai");

    if (data.memory) {
      memory = data.memory;
    }
  } catch (err) {
    loading.textContent = "Error contacting server.";
  }
}
