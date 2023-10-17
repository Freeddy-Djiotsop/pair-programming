import "./styles/register.css";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { notierror } from "../../toast";
import { useAuth } from "../Auth";
import axios from "../../api/axios";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const auth = useAuth();

  const onSubmit = async (data) => {
    try {
      const { firstname, lastname, email, password } = data;
      await axios.post("user/register", {
        firstname,
        lastname,
        email,
        password,
      });
      auth.setUser({ email });
      navigate("/login");
    } catch (error) {
      if (error.response?.status === 409)
        notierror(error.response.data.error.message);
      else if (!error?.response)
        notierror("Fehler bei der Registrierung, Keine Response vom Server");
      else notierror("Fehler bei der Registrierung,");
      console.error("Fehler bei der Registrierung:", error);
    }
  };

  return (
    <div className="register-form">
      <div className="register-wrapper">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>Registrierung</h1>
          <div className="input-box">
            <label>Vorname</label>
            {errors.firstName && <span>Vorname ist erforderlich</span>}
            <input
              type="text"
              placeholder="John"
              autoFocus
              {...register("firstname", { required: true })}
            />
            <i className="material-icons icon">person</i>
          </div>

          <div className="input-box">
            <label>Nachname</label>
            {errors.lastName && <span>Nachname ist erforderlich</span>}
            <input
              type="text"
              placeholder="Doe"
              {...register("lastname", { required: true })}
            />
            <i className="material-icons icon">person</i>
          </div>

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

          <button type="submit">Registrieren</button>
          <div className="register-link">
            <p>
              Schon einen Konto? <Link to="/login">Login</Link>
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
