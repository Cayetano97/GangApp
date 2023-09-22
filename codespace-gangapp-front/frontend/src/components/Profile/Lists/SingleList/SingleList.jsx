import classes from "./SingleList.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import Purchased from "./Purchased/Purchased";
import Finished from "./Finished/Finished";
import Editing from "./Editing/Editing";
import Spinner from "../../../Spinner/Spinner";
import AlertGreen from "../../../AlertGreen/AlertGreen";
import Alert from "../../../Alert/Alert";

const SingleList = () => {
  //UseStates
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({});
  const [alertGreen, setAlertGreen] = useState(false);
  const [alertRed, setAlertRed] = useState(false);

  //Const declarations
  const idList = window.location.pathname.split("/")[3];
  const navigate = useNavigate();
  const loginData = localStorage.getItem("Response");
  const loginDataParse = JSON.parse(loginData);
  const idUser = loginDataParse.data.id;

  //Handle function

  const handleBack = () => {
    navigate(`/profile/list/${idUser}`);
  };

  const handleAddTicket = (id) => {
    console.log(id);
  };

  //Fetch function
  const fetchAllLists = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/lists/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("Token"),
          "auth-token-refresh": localStorage.getItem("Refresh_Token"),
        },
      });

      if (response.ok) {
        const dataResponseSingleLists = await response.json();
        setData(dataResponseSingleLists.data[0]);
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchAllLists(idList);
  }, [idList, data.status]);

  return (
    <div className={classes.singleList}>
      <div className={classes.back} onClick={handleBack}>
        <FontAwesomeIcon icon={faArrowLeftLong} className={classes.arrow} />{" "}
        <span>Mis listas</span>
      </div>
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <Alert text="Algo no ha ido como debía... ¡Inténtalo de nuevo!" />
      ) : data.status === "Finalizada" ? (
        <Purchased data={data} isLoading={isLoading} error={error} />
      ) : data.status === "Comprando" ? (
        <Finished
          addTicket={handleAddTicket}
          data={data}
          isLoading={isLoading}
          error={error}
          updateList={() => fetchAllLists(idList)}
        />
      ) : (
        <Editing
          data={data}
          isLoading={isLoading}
          error={error}
          updateList={() => fetchAllLists(idList)}
          alertGreen={
            alertGreen && <AlertGreen text="Lista actualizada correctamente." />
          }
          setAlertGreen={setAlertGreen}
          alertRed={
            alertRed && <Alert text="Hubo un error al actualizar la lista." />
          }
          setAlertRed={setAlertRed}
        />
      )}
    </div>
  );
};

export default SingleList;
