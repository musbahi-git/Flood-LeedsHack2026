const { addMessage, getHistory } = require('./services/chatService');

function setupChatSocket(server) {
  const WebSocket = require('ws');
  const wss = new WebSocket.Server({ server, path: '/chat' });

  wss.on('connection', ws => {
    // Send chat history
    ws.send(JSON.stringify({ type: 'history', messages: getHistory() }));

    ws.on('message', data => {
      try {
        const msg = JSON.parse(data);
        addMessage(msg);
        // Broadcast to all
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(msg));
          }
        });
      } catch (e) {
        ws.send(JSON.stringify({ type: 'error', error: 'Invalid message format' }));
      }
    });
  });
}

module.exports = { setupChatSocket };
