const chatBox = document.getElementById("chat-box");
const inputField = document.getElementById("chat-input");
const sendButton = document.getElementById("send-btn");

let messages = [];

function addMessage(text, sender) {
  const bubble = document.createElement("div");
  bubble.className = sender === "user" ? "user-message" : "bot-message";
  bubble.textContent = text;

  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const input = inputField.value.trim();
  if (!input) return;

  addMessage(input, "user");

  messages.push({
    role: "user",
    content: input,
  });

  inputField.value = "";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: input,
        conversation: messages,
        userId: "student_1",
      }),
    });

    const data = await response.json();

    addMessage(data.reply, "bot");

    messages.push({
      role: "assistant",
      content: data.reply,
    });

  } catch (err) {
    addMessage("Something went wrong.", "bot");
    console.error(err);
  }
}

sendButton.addEventListener("click", sendMessage);

inputField.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
