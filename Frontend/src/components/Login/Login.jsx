import "./Login.css";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icon from "../../assets/Icon.png";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import Alert from "../Alert/Alert";

import { Button } from "antd";

const Login = () => {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [isLogged, setIsLogged] = useState(true);
  const [eye, setEye] = useState(true);
  const [alert, setAlert] = useState(false);

  const handleCheckbox = (e) => {
    setIsChecked(e.target.checked);
  };

  const handlePassword = () => {
    setEye(!eye);
  };
  const handleInputBlur = () => {
    setAlert(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    setAlert(false);
    setIsLogged(true);

    if (e.target.email.value !== "" && e.target.password.value !== "") {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: e.target.email.value,
          password: e.target.password.value,
        }),
      });

      const dataResponse = await response.json();

      if (isChecked) {
        localStorage.setItem("Email", e.target.email.value);
        localStorage.setItem("Password", e.target.password.value);
      } else {
        localStorage.removeItem("Email");
        localStorage.removeItem("Password");
      }

      if (response.status === 200) {
        localStorage.setItem("Response", JSON.stringify(dataResponse));
        navigate("/profile");
        if (dataResponse.data.role === "admin") {
          navigate("profile/admin/");
        }
        setIsLogged(true);
      } else {
        localStorage.clear();
        setIsLogged(false);
      }

      try {
        localStorage.setItem("Token", dataResponse.data.token);
        localStorage.setItem("Refresh_Token", dataResponse.data.refreshToken);
        setIsLogged(true);
      } catch (error) {
        setIsLogged(false);
      }
    } else {
      setAlert(true);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("Email") && localStorage.getItem("Password")) {
      document.querySelector("input[name='email']").value =
        localStorage.getItem("Email");
      document.querySelector("input[name='password']").value =
        localStorage.getItem("Password");
      setIsChecked(true);
    }
  }, []);

  return (
    <>
      <div className="login">
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
          <label htmlFor="remember">
            <input
              type="checkbox"
              name="remember"
              checked={isChecked}
              onChange={handleCheckbox}
            />
            Recordar sesión
          </label>
          <Button
            onBlur={handleInputBlur}
            onChange={handleCheckbox}
            type="primary"
            htmlType="submit"
            style={{
              width: "100%",
              // backgroundColor: "coral",
              // fontWeight: "600",
              // color: "white",
            }}
          >
            Inicia sesión
          </Button>
          <p>
            ¿Aún no estás registrado? <Link to="/signup">Regístrate</Link>
          </p>
        </form>
      </div>
      {!isLogged && <Alert text={"Email o contraseña incorrectos."} />}
      {alert && <Alert text={"El email y la contraseña son obligatorios."} />}
    </>
  );
};

export default Login;
