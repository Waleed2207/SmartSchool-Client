import { EventEmitter } from 'events';

export const eventEmitter = new EventEmitter();
export const ws = new WebSocket('ws://localhost:8080');

ws.addEventListener('open', () => {
    console.log('connected');
});

ws.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
});


ws.addEventListener('message', (event) => {
    try {
        const message = JSON.parse(event.data);
        console.log("WebSocket message received:", message);

        if (message.motionDetected) {
            console.log("Emitting 'motionDetected' event with roomId:", message.roomId);
            eventEmitter.emit('motionDetected', message.roomId);
        }

        // Add the following to handle pump state changes
        if ('pumpState' in message) {
            if (message.pumpState) {
                eventEmitter.emit('pumpStateChange', true);
            } else {
                eventEmitter.emit('pumpStateChange', false);
            }
        }
    } catch (error) {
        console.log('Received non-JSON message:', event.data);
    }
});

