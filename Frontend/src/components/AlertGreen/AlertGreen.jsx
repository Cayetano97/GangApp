import "./AlertGreen.css";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const AlertGreen = (props) => {
  const [isAlert, setIsAlert] = useState(true);

  const handleAlert = () => {
    setIsAlert(false);
  };

  useEffect(() => {
    setTimeout(() => {
      setIsAlert(false);
    }, 5000);

    return () => {
      clearTimeout();
    };
  });

  return (
    <div className={isAlert ? "active" : "close"}>
      <FontAwesomeIcon icon={faXmark} onClick={handleAlert} />
      {props.text}
    </div>
  );
};

export default AlertGreen;
