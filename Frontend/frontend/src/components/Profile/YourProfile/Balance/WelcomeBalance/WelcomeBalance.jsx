import { useState } from "react";
import classes from "./WelcomeBalance.module.css";
import Modal from "../../../../Modal/Modal";
import EditProfile from "../EditProfile/EditProfile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

const WelcomeBalance = () => {
  const loginData = JSON.parse(localStorage.getItem("Response"));
  const username = loginData?.data.user;
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  return (
    <div className={classes.welcomeBalance}>
      <div className={classes.welcomeTitle}>
        <p>Hola, {capitalizeFirstLetter(username)}</p>
      </div>
      <div className={classes.welcomeText}>
        <p>Bienvenido de nuevo a tu Monedero Virtual.</p>
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
