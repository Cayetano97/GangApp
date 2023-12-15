import "./DeleteButton.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const DeleteButton = (props) => {
  const [deleteLists, setDeleteLists] = useState(false);
  const navigate = useNavigate();

  const data_id = props.data._id;

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
    deleteList(data_id);
    navigate("/profile/");
  };

  return (
    <div className="deleteButton">
      <button onClick={handleDeleteList}>
        Borrar lista
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    </div>
  );
};

export default DeleteButton;
