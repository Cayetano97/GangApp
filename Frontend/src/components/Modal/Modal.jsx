import classes from "./Modal.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const Modal = (props) => {
  //Fetch para traer la imagen del ticket!

  return (
    <div className={props.filter ? classes.filter : classes.hidden}>
      <div className={props.openModal ? classes.show : classes.hidden}>
        <FontAwesomeIcon
          icon={faXmark}
          onClick={props.close}
          className={classes.closeIcon}
        />
        <div className={props.classesModalContent}>{props.content}</div>
      </div>
    </div>
  );
};
export default Modal;
