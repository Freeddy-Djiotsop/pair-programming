import { io } from "socket.io-client";
export const apiUrl = "http://localhost:3001";
export const socket = io(apiUrl);
