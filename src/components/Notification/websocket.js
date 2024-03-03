
let socket = null;

function connectWebSocket() {
  if (!socket) {
    const WebSocket = window.WebSocket;
    //socket = new WebSocket('ws://waleed.shenkar.dev:8002');
    socket = new WebSocket('ws://localhost:8002');
    socket.addEventListener('open', function (event) {
      console.log('WebSocket connection opened');
    });

    socket.addEventListener('message', function (event) {
      console.log('Received message:', event.data);
    });

    socket.addEventListener('error', function (event) {
      console.error('WebSocket error:', event);
    });

    socket.addEventListener('close', function (event) {
      console.log('WebSocket connection closed');
    });
  }
}

function sendWebSocketMessage(message) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(message);
  }
}

export { connectWebSocket, sendWebSocketMessage };