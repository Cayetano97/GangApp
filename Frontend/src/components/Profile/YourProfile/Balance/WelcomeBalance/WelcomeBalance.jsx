import "./WelcomeBalance.css";
import { useState } from "react";
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
    <div className="welcomeBalance">
      <div className="welcomeTitle">
        <p>Hola, {capitalizeFirstLetter(username)}</p>
      </div>
      <div className="welcomeText">
        <p>Bienvenido a tu monedero.</p>
        <div className="buttonEditProfile">
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
          className="modalEditProfile"
        />
      )}
    </div>
  );
};

export default WelcomeBalance;
