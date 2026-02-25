const chatBox = document.querySelector(".chat-box");
const input = document.getElementById("messageInput");

const userId = "student1"; // temporary identity

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = `msg ${sender}`;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  addMessage(message, "user");
  input.value = "";

  const loading = document.createElement("div");
  loading.className = "msg ai";
  loading.textContent = "...";
  chatBox.appendChild(loading);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message,
        userId
      })
    });

    const data = await res.json();

    loading.remove();
    addMessage(data.reply, "ai");

  } catch (err) {
    loading.textContent = "Error contacting AI.";
  }
}

// ENTER key support
input.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});
