
let socket = null;

function connectWebSocket() {
  if (!socket) {
    const WebSocket = window.WebSocket;
    if (window.location.protocol === "https:") {
        socket = new WebSocket('wss://software.shenkar.cloud:8888');
    } else {
        socket = new WebSocket('ws://software.shenkar.cloud:8001');
    }
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