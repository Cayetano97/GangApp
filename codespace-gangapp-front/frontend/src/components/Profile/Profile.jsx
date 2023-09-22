import classes from "./Profile.module.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faBarsStaggered,
  faHippo,
} from "@fortawesome/free-solid-svg-icons";
import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "../SideBar/SideBar";

const Profile = () => {
  //UseStates
  const [isOpen, setIsOpen] = useState(false);

  //Const declarations
  const navigate = useNavigate();
  const loginData = localStorage.getItem("Response");
  const loginDataParse = JSON.parse(loginData);
  const iduser = loginDataParse.data.id;
  const username = loginDataParse.data.user;
  const capitalizedUsername =
    username.charAt(0).toUpperCase() + username.slice(1);

  //Handle functions

  const handleHome = () => {
    if (loginDataParse.data.role === "admin") {
      navigate("admin/");
    } else {
      navigate("/profile");
    }
  };

  const handleOpenMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogOut = () => {
    setIsOpen(!isOpen);
    localStorage.removeItem("Response");
    localStorage.removeItem("Token");
    localStorage.removeItem("Refresh_Token");
    localStorage.removeItem("id_list");
    localStorage.removeItem("product_quantity");

    //Eliminar todos los checked-products dinámicos del localStorage
    const localStorages = Object.keys(localStorage);
    localStorages.forEach((storage) => {
      if (storage.startsWith("checked-products-")) {
        localStorage.removeItem(storage);
      }
    });
  };

  return (
    <div className={classes.profile}>
      <div className={classes["profile-header"]}>
        {loginDataParse.data.role === "admin" ? (
          <FontAwesomeIcon
            icon={faHippo}
            style={{ color: "#0661fe" }}
            onClick={handleHome}
          />
        ) : (
          <FontAwesomeIcon icon={faHippo} onClick={handleHome} />
        )}
        <div className={classes["profile-header-left"]}>
          <p className={classes.card}>{capitalizedUsername}</p>
          <FontAwesomeIcon
            icon={isOpen ? faXmark : faBarsStaggered}
            className={classes["icon-menu"]}
            onClick={handleOpenMenu}
          />
        </div>
      </div>
      {isOpen ? (
        <SideBar iduser={iduser} close={handleOpenMenu} logout={handleLogOut} />
      ) : null}
      <Outlet />
    </div>
  );
};

export default Profile;
