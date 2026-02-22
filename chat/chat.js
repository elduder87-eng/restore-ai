async function sendMessage() {
  const input = document.getElementById("messageInput");
  const chatBox = document.getElementById("chatBox");

  const message = input.value.trim();
  if (!message) return;

  // show user message
  const userMsg = document.createElement("p");
  userMsg.innerHTML = "<strong>You:</strong> " + message;
  chatBox.appendChild(userMsg);

  input.value = "";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    const aiMsg = document.createElement("p");
    aiMsg.innerHTML = "<strong>Restore AI:</strong> " + data.reply;
    chatBox.appendChild(aiMsg);

    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (err) {
    const errorMsg = document.createElement("p");
    errorMsg.innerHTML = "<strong>Error:</strong> Could not reach AI.";
    chatBox.appendChild(errorMsg);
  }
}
