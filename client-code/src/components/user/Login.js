import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import axios from "axios";
import "./styles/login.css";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/user/login", {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });
      console.log("Registrierung erfolgreich:", response.data);
    } catch (error) {
      console.error("Fehler bei der Registrierung:", error);
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
              placeholder="...@example.de"
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
