import { toast } from "react-toastify";

const style = {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};

export const notisuccess = (message) => toast.success(message, style);
export const notierror = (message) => toast.error(message, style);
