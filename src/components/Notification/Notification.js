import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { eventEmitter } from '../../WebSocket/ws.js'; // import eventEmitter instead of ws
import { connectWebSocket } from "./websocket.js";

// const WebSocket = window.WebSocket;

export const Notification = () => {

  // console.log({WebSocketClient});
  const [notification, setNotification] = useState('');


  let socket;
  
  useEffect(() => {
    if (window.location.protocol === "https:") {
      socket = new WebSocket('wss://software.shenkar.cloud:8080');
  } else {
      socket = new WebSocket('ws://software.shenkar.cloud:8001');
  }
    socket.addEventListener('message', handleMessageReceived);

    return () => {
      socket.removeEventListener('message', handleMessageReceived);
    };
  }, []);

  function handleMessageReceived(event) {
    const message = event.data;
    setNotification(message);
    const suggestionsPattern = /\b(Suggestion)\b/;
    const pumpPattern = /\b(PUMP)\b/;

    if (suggestionsPattern.test(message))
      toast.info(event.data);

    if (pumpPattern.test(message)) {
      let msg;
      msg = new SpeechSynthesisUtterance("Watering system number one activated");
      window.speechSynthesis.speak(msg);
    }
  }

  useEffect(() => {
    console.log({ notification });
  }, [notification])


  connectWebSocket();

  return (
    <div>
      <ToastContainer />
    </div>
  )
}