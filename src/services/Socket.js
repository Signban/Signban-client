import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  autoConnect: false,
  path: import.meta.env.VITE_SOCKET_PATH,
  transports: ["websocket"],
});

export default socket;
