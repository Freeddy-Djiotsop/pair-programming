import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./styles/login.css";
import { notierror, notisuccess } from "../../toast";
import { useAuth } from "../Auth";
import axios from "../../api/axios";

const serverLoginEndpunkt = "user/login";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const redirectPath = location.state?.path || "/project";
  const serverLoginEndpunkt = "user/login";

  const onSubmit = async (data) => {
    try {
      const { email, password } = data;
      const response = await axios.post(serverLoginEndpunkt, {
        email,
        password,
      });
      const { user, token } = response.data;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      auth.login();
      navigate(redirectPath, { replace: true });
      notisuccess(`Hallo: ${user.firstname} ${user.lastname}`);
    } catch (error) {
      const message = error.response
        ? error.response.data.error.message
        : "Keine Antwort vom Server. Bitte später erneut versuchen";
      notierror(message);
      console.error("Fehler bei der Login:", error);
    }
  };

  return (
    <div className="login-form">
      <div className="register-wrapper">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>Anmelden</h1>
          <div className="input-box">
            <label>Email</label>
            {errors.email && <span>Email ist erforderlich</span>}
            <input
              type="email"
              defaultValue={auth.user?.email}
              placeholder="...@example.de"
              autoFocus
              {...register("email", { required: true })}
            />
            <i className="material-icons icon">mail</i>
          </div>

          <div className="input-box">
            <label>Passwort</label>
            {errors.password && <span>Passwort ist erforderlich</span>}
            <input
              type="password"
              placeholder="password"
              {...register("password", { required: true })}
            />
            <i className="material-icons icon">lock</i>
          </div>

          <div className="login-remember">
            <label>
              <input type="checkbox" />
              Remember
            </label>
            <Link to="/reset/password">Password vergessen ?</Link>
          </div>

          <button type="submit">Login</button>

          <div className="register-link">
            <p>
              Keinen Konto? <Link to="/register">Register</Link>
            </p>
            <p>
              Weiter als <Link to="/gast">Gast</Link> ?
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
