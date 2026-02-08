// Simple in-memory chat history (for demo)
const chatHistory = [];

function addMessage(msg) {
  chatHistory.push(msg);
  if (chatHistory.length > 100) chatHistory.shift(); // Keep last 100
}

function getHistory() {
  return chatHistory;
}

module.exports = { addMessage, getHistory };
