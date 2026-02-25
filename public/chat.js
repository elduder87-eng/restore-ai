async function sendMessage() {
  const input = document.getElementById("messageInput");
  const chat = document.getElementById("chat");

  const message = input.value;
  if (!message) return;

  chat.innerHTML += `
    <div class="user">You: ${message}</div>
  `;

  input.value = "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    chat.innerHTML += `
      <div class="ai">${data.reply}</div>
    `;

  } catch {
    chat.innerHTML += `
      <div class="ai">Error contacting server.</div>
    `;
  }
}
