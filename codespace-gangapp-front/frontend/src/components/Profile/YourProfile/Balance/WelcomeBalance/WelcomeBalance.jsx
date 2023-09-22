import classes from "./WelcomeBalance.module.css";
import Modal from "../../../../Modal/Modal";
import EditProfile from "../EditProfile/EditProfile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserAstronaut,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const WelcomeBalance = () => {
  const loginData = localStorage.getItem("Response");
  const loginDataParse = JSON.parse(loginData);
  const [openModal, setOpenModal] = useState(false);

  // Handle functions
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  /* Función para capitalizar la primera letra del nombre del usuario */
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const username = capitalizeFirstLetter(loginDataParse.data.user);

  return (
    <div className={classes.welcomeBalance}>
      <div className={classes.welcomeTitle}>
        <p>
          <FontAwesomeIcon icon={faUserAstronaut} size="xl" /> Hola, {username}
        </p>
      </div>
      <div className={classes.welcomeText}>
        <p>Bienvenido de nuevo a tu Monedero Virtual. </p>
        <p>
          Aquí podrás ver el saldo de tu cuenta, así como el historial de tus
          transacciones.
        </p>
        <div className={classes.buttonEditProfile}>
          <button onClick={handleOpenModal}>
            Edita tu perfil <FontAwesomeIcon icon={faCircleCheck} />
          </button>
        </div>
      </div>
      {openModal && (
        <Modal
          filter={openModal}
          openModal={openModal}
          close={handleCloseModal}
          content={<EditProfile />}
          className={classes.modalEditProfile}
        />
      )}
    </div>
  );
};

export default WelcomeBalance;
