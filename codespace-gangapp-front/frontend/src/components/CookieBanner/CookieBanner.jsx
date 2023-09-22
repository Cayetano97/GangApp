import React, { useState } from "react";
import { setCookie, getCookie } from "../CookieManager/CookieManager"; // Importa las funciones de manejo de cookies

import classes from "./CookieBanner.module.css"; // Agrega tus estilos CSS si es necesario

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(!getCookie("CookieConsent")); // Verifica si la cookie de consentimiento ya existe

  const handleAccept = () => {
    setCookie("CookieConsent", "true", { expires: 365 }); // Establece la cookie de consentimiento con una expiración de 1 año
    setShowBanner(false); // Oculta el banner
  };

  return (
    showBanner && (
      <div className={classes.cookieBanner}>
        <p>Este sitio web utiliza cookies para mejorar tu experiencia.</p>
        <button onClick={handleAccept}>Aceptar</button>
      </div>
    )
  );
};

export default CookieBanner;
