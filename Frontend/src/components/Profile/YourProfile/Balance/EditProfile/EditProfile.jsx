import classes from "./EditProfile.module.css";
import Alert from "../../../../Alert/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouseUser } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

const EditProfile = () => {
  const [loading, setLoading] = useState(true);
  const [created, setCreated] = useState(false);
  const [useLists, setUseLists] = useState({
    username: "",
    lastname: "",
    email: "",
  });
  const [username, setUsername] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const loginData = localStorage.getItem("Response");
  const loginDataParse = JSON.parse(loginData);
  const iduser = loginDataParse.data.id;

  const getProfile = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/userallinfo/${iduser}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("Token"),
            "auth-token-refresh": localStorage.getItem("Refresh_Token"),
          },
        }
      );
      if (response.status !== 200) {
        console.log("Error getting data");
      } else {
        const responseData = await response.json();
        setUseLists(responseData.data);
        setLoading(false);
      }
    } catch (error) {
      console.log("Error getting data");
    }
  };

  const patchProfile = async () => {
    try {
      if (password !== confirmPassword) {
        setPasswordError(true);
        return;
      } else {
        setPasswordError(false);
      }
      const response = await fetch(
        `http://localhost:8000/updateuser/${iduser}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("Token"),
            "auth-token-refresh": localStorage.getItem("Refresh_Token"),
          },
          body: JSON.stringify({
            username: username !== "" ? username : undefined,
            lastname: lastname !== "" ? lastname : undefined,
            email: email !== "" ? email : undefined,
            password: password !== "" ? password : undefined,
          }),
        }
      );
      if (response.status !== 200) {
        console.log("Error updating data");
      } else {
        console.log("Data updated");
        getProfile();
        setCreated(true);
      }
    } catch (error) {
      console.log("Error updating data");
    }

    handleResetInfo();
    getProfile();
  };

  const handleResetInfo = () => {
    setUsername("");
    setLastname("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setTimeout(() => {
      setPasswordError(false);
      setCreated(false);
    }, 5000);
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className={classes.yourProfileModal}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className={classes.profileModal}>
          <h3>
            <FontAwesomeIcon className={classes.iconModal} icon={faHouseUser} />
            Tu Perfil
          </h3>
          <div className={classes.profileInfoModal}>
            <div className={classes.profileInfoItemModal}>
              <form className={classes.EditProfileForm}>
                <p>Nombre:</p>
                <input
                  type="text"
                  name="username"
                  value={username.charAt(0).toUpperCase() + username.slice(1)}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={useLists.username}
                />
                <p>Apellidos:</p>
                <input
                  type="text"
                  name="lastname"
                  value={lastname.charAt(0).toUpperCase() + lastname.slice(1)}
                  onChange={(e) => setLastname(e.target.value)}
                  placeholder={useLists.lastname}
                />
                <p>Email:</p>
                <input
                  type="text"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={useLists.email}
                />
                <p>Nueva contraseña:</p>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nueva contraseña"
                />
                <p>Confirmar contraseña:</p>
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmar contraseña"
                />
                {passwordError ? (
                  <Alert text="Las contraseñas no coinciden" />
                ) : (
                  ""
                )}
              </form>
              <button
                type="submit"
                className={classes.EditProfileButton}
                onClick={() => patchProfile()}
              >
                Guardar
              </button>
              {created ? (
                <div className={classes.greenalert}>
                  <p>Perfil modificado correctamente</p>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
