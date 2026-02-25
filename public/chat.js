const form = document.getElementById("chat-form");
const input = document.getElementById("message-input");
const chatWindow = document.getElementById("chat-window");

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.textContent = text;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = input.value.trim();
  if (!message) return;

  addMessage(message, "user");
  input.value = "";

  const thinking = document.createElement("div");
  thinking.className = "message assistant";
  thinking.textContent = "Thinking...";
  chatWindow.appendChild(thinking);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    thinking.remove();
    addMessage(data.reply, "assistant");

  } catch (err) {
    thinking.remove();
    addMessage("Server error.", "assistant");
  }
});
