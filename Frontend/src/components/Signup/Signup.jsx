import "./Signup.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import Alert from "../Alert/Alert";
import Icon from "../../assets/Icon.png";

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return passwordRegex.test(password);
};

const Signup = () => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(false);
  const [eye, setEye] = useState(true);

  const handlePassword = () => {
    setEye(!eye);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const username = e.target.username.value;
    const lastname = e.target.lastname.value;
    const password = e.target.password.value;

    if (email !== "" && username !== "" && lastname !== "") {
      if (!validateEmail(email)) {
        setAlert("Email inválido. Por favor, ingresa un email válido.");
        return;
      }

      if (!validatePassword(password)) {
        setAlert(
          "Contraseña inválida (debe contener al menos 8 caracteres, una mayúscula, una minúscula, un número y un caracter especial)."
        );
        return;
      }

      const response = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          username: username,
          lastname: lastname,
          password: password,
        }),
      });
      await response.json();

      if (response.status === 200) {
        navigate("/");
      }
    } else {
      setAlert("Por favor, completa todos los campos.");
    }
  };

  const handleInputBlur = () => {
    setAlert(false);
  };

  return (
    <div className="signup">
      <div className="title">
        <img src={Icon} alt="Icon" />
        <h1>SmartCart</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Introduce tu email"
          name="email"
          onBlur={handleInputBlur}
        />
        <input
          type="text"
          placeholder="Introduce tu nombre"
          name="username"
          onBlur={handleInputBlur}
        />
        <input
          type="text"
          placeholder="Introduce tus apellidos"
          name="lastname"
          onBlur={handleInputBlur}
        />
        <div className="passwordWrapper">
          <input
            type={eye ? "password" : "text"}
            placeholder="Introduce tu constraseña"
            name="password"
            onBlur={handleInputBlur}
          />
          <FontAwesomeIcon
            icon={eye ? faEye : faEyeSlash}
            onClick={handlePassword}
            className="faEye"
          />
        </div>
        <button type="submit" onBlur={handleInputBlur}>
          Regístrate
        </button>
        <p>
          ¿Ya tienes una cuenta? <Link to="/">Inicia sesión</Link>
        </p>
      </form>
      {alert ? <Alert text={alert} /> : null}
    </div>
  );
};

export default Signup;
