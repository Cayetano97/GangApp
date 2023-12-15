import "./Profile.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBarsStaggered } from "@fortawesome/free-solid-svg-icons";
import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import Icon from "../../assets/Icon.png";
import IconAdmin from "../../assets/Icon-Admin.png";

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const loginData = localStorage.getItem("Response");
  const loginDataParse = JSON.parse(loginData);
  const iduser = loginDataParse.data.id;
  const username = loginDataParse.data.user;
  const capitalizedUsername =
    username.charAt(0).toUpperCase() + username.slice(1);

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

    const localStorages = Object.keys(localStorage);
    localStorages.forEach((storage) => {
      if (storage.startsWith("checked-products-")) {
        localStorage.removeItem(storage);
      }
    });
  };

  return (
    <div className="profile">
      <div className="profileheader">
        {loginDataParse.data.role === "admin" ? (
          <img src={IconAdmin} alt="Icon" onClick={handleHome} />
        ) : (
          <img src={Icon} alt="Icon" onClick={handleHome} />
        )}
        <div className="profile-header-left">
          <p className="card">{capitalizedUsername}</p>
          <FontAwesomeIcon
            icon={isOpen ? faXmark : faBarsStaggered}
            className="icon-menu"
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
