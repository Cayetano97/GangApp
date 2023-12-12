import classes from "./NotFound.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

const NotFound = () => {
  return (
    <div className={classes.NotFound}>
      <FontAwesomeIcon
        icon={faExclamationCircle}
        className={classes.errorIcon}
      />
      <h3 className={classes.NotFoundTitle}>404</h3>
      <h4 className={classes.NotFoundSubtitle}>Página no encontrada</h4>
      <p className={classes.NotFoundPrg}>
        Lo sentimos, la página que estás buscando no existe.
      </p>

      <a
        href="/profile"
        className={classes.NotFoundLink}
        title="Volver al inicio"
      >
        Volver al inicio
      </a>
    </div>
  );
};

export default NotFound;
