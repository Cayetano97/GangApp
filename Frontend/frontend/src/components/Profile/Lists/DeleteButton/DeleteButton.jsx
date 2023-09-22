import classes from "./DeleteButton.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const DeleteButton = (props) => {
  const [deleteLists, setDeleteLists] = useState(false);
  const navigate = useNavigate();

  //Const declarations
  const data_id = props.data._id;

  //Delete functions
  const deleteList = async (data_id) => {
    try {
      const response = await fetch(`http://localhost:8000/list/${data_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("Token"),
          "auth-token-refresh": localStorage.getItem("Refresh_Token"),
        },
      });
      if (response.ok) {
        await response.json();
        setDeleteLists(deleteLists);
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteList = () => {
    //Borrar la lista de la base de datos
    deleteList(data_id);
    navigate("/profile/");
  };

  return (
    <div className={classes.deleteButton}>
      <button onClick={handleDeleteList}>
        Borrar lista
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    </div>
  );
};

export default DeleteButton;
