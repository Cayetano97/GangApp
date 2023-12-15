import "./NotFound.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

const NotFound = () => {
  return (
    <div className="NotFound">
      <FontAwesomeIcon icon={faExclamationCircle} className="errorIcon" />
      <h3 className="NotFoundTitle">404</h3>
      <h4 className="NotFoundSubtitle">Página no encontrada</h4>
      <p className="NotFoundPrg">
        Lo sentimos, la página que estás buscando no existe.
      </p>

      <a href="/profile" className="NotFoundLink" title="Volver al inicio">
        Volver al inicio
      </a>
    </div>
  );
};

export default NotFound;
