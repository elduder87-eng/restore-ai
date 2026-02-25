const chatBox = document.getElementById("chat");
const input = document.getElementById("message");
const sendBtn = document.getElementById("send");

let memory = {};

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = sender;
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  addMessage(message, "user");
  input.value = "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message,
        memory
      })
    });

    const data = await res.json();

    if (data.reply) {
      addMessage(data.reply, "ai");
    }

    if (data.memory) {
      memory = data.memory;
    }

  } catch (err) {
    addMessage("Error contacting server.", "ai");
  }
}

sendBtn.onclick = sendMessage;

input.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});
