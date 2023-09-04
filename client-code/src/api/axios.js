import axios from "axios";
import { apiUrl } from "./url";

export default axios.create({
  baseURL: apiUrl,
});
