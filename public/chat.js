async function sendMessage() {
  const input = document.getElementById("message");
  const chat = document.getElementById("chat");

  const message = input.value.trim();
  if (!message) return;

  chat.innerHTML += `<div class="user">${message}</div>`;
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

    chat.innerHTML += `<div class="bot">${data.reply}</div>`;
    chat.scrollTop = chat.scrollHeight;

  } catch {
    chat.innerHTML += `<div class="bot">Error contacting server.</div>`;
  }
}
