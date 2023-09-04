import { io } from "socket.io-client";
import { apiUrl } from "./url";
export const socket = io(apiUrl);
