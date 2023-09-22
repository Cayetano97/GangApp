import classes from "./Lists.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CardList from "../CardList/CardList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";

const Lists = () => {
  //UseStates
  const [dataResponseAllLists, setDataResponseAllLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  //Const declarations
  const navigate = useNavigate();
  const loginData = localStorage.getItem("Response");
  const loginDataParse = JSON.parse(loginData);
  const idUser = loginDataParse.data.id;

  //Handle functions
  const handleOpenEachList = (index) => {
    if (dataResponseAllLists.data.length !== 0) {
      const idEachList = dataResponseAllLists.data[index]._id;
      navigate(`/profile/lists/${idEachList}`);
    }
  };

  const handleAddList = () => {
    navigate("/profile/new");
  };

  const handleBack = () => {
    navigate("/profile");
  };

  // Fetch function

  const fetchAllLists = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/list/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("Token"),
          "auth-token-refresh": localStorage.getItem("Refresh_Token"),
        },
      });

      if (response.ok) {
        const dataResponseAllLists = await response.json();
        setDataResponseAllLists(dataResponseAllLists);
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAllLists(idUser);
  }, [idUser]);

  return (
    <>
      <div className={classes["all-lists"]}>
        <div className={classes.back} onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowLeftLong} className={classes.arrow} />
          <span>Inicio</span>
        </div>
        <CardList
          handleOpenList={handleOpenEachList}
          isLoading={isLoading}
          error={error}
          dataResponse={dataResponseAllLists}
        />
      </div>
      <button className={classes.faPlus} onClick={handleAddList}>
        {" "}
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </>
  );
};

export default Lists;
