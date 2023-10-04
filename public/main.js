const socket = io();

const clientTotal = document.getElementById("client-total");

const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const messageInput = document.getElementById("message-input");
const messageForm = document.getElementById("message-form");

const messageTone = new Audio("/message-tone.mp3");

socket.on("client-total", (data) => {
  clientTotal.innerHTML = `Total clients: ${data}`;
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

function sendMessage() {
  if (messageInput.value === "") return;
  const data = {
    user: nameInput.value,
    message: messageInput.value,
    dateTime: new Date(),
  };

  socket.emit("message", data);
  addMessageToUi(true, data);
  messageInput.value = "";
}

socket.on("chat-message", (data) => {
  messageTone.play();
  addMessageToUi(false, data);
});

function addMessageToUi(isOwnMessage, data) {
  clearFeedback();
  const element = `
  <li class="${isOwnMessage ? "message-left" : "message-right"}">
  <p class="message">
    ${data.message}
    <span>${data.user} ● ${moment(data.dateTime).fromNow()}</span>
  </p>
</li>
`;
  messageContainer.innerHTML += element;
  scrollToBottom();
}

function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

messageInput.addEventListener("focus", (e) => {
  socket.emit("feedback", {
    feedback: `✍️ ${nameInput.value} is typing a message...`,
  });
});

messageInput.addEventListener("keypress", (e) => {
  socket.emit("feedback", {
    feedback: `✍️ ${nameInput.value} is typing a message...`,
  });
});

messageInput.addEventListener("blur", (e) => {
  socket.emit("feedback", {
    feedback: ``,
  });
});

socket.on("chat-feedback", (data) => {
  clearFeedback();
  const element = `<li class="message-feedback">
  <p class="feedback" id="feedback">${data.feedback} </p>
</li>`;

  messageContainer.innerHTML += element;
});

function clearFeedback() {
  document.querySelectorAll("li.message-feedback").forEach((element) => {
    element.parentNode.removeChild(element);
  });
}
