// import io from 'socket.io-client';

// // Initialize Socket.IO client with the backend URL
// const socket = io('http://localhost:5000', {
//   autoConnect: false, // Connect manually when needed
//   auth: {
//     token: () => localStorage.getItem('token'), // Send JWT token for authentication
//   },
// });

// // Handle connection events
// socket.on('connect', () => {
//   console.log('Connected to Socket.IO server');
// });

// socket.on('disconnect', () => {
//   console.log('Disconnected from Socket.IO server');
// });

// socket.on('connect_error', (error) => {
//   console.error('Socket.IO connection error:', error);
// });

// // Function to connect the socket manually
// export const connectSocket = () => {
//   if (!socket.connected) {
//     socket.connect();
//   }
// };

// // Function to disconnect the socket manually
// export const disconnectSocket = () => {
//   if (socket.connected) {
//     socket.disconnect();
//   }
// };

// export default socket;
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  withCredentials: true,
  autoConnect: false,
});

export default socket;