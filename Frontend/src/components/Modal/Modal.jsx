import "./Modal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const Modal = (props) => {
  return (
    <div className={props.filter ? "filter" : "hidden"}>
      <div className={props.openModal ? "show" : "hidden"}>
        <FontAwesomeIcon
          icon={faXmark}
          onClick={props.close}
          className="closeIcon"
        />
        <div className={props.classesModalContent}>{props.content}</div>
      </div>
    </div>
  );
};
export default Modal;
