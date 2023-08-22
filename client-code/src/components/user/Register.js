import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import axios from "axios";
import bcrypt from "bcryptjs";
import "./styles/register.css";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          console.log("Fehler beim Generieren des Salts:");
          throw err;
        }

        bcrypt.hash(data.password, salt, async (err, hash) => {
          if (err) {
            console.error("Fehler beim Hashen des Passworts:");
            throw err;
          }

          // Speichere das `hash` in der Datenbank zusammen mit dem Benutzer
          console.log("Salted & Hashed Password:", hash);
          const response = await axios.post("/user/register", {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: hash,
          });
          console.log("Registrierung erfolgreich:", response.data);
        });
      });
    } catch (error) {
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
              {...register("firstName", { required: true })}
            />
            <i className="material-icons icon">person</i>
          </div>

          <div className="input-box">
            <label>Nachname</label>
            {errors.lastName && <span>Nachname ist erforderlich</span>}
            <input
              type="text"
              placeholder="Doe"
              {...register("lastName", { required: true })}
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
