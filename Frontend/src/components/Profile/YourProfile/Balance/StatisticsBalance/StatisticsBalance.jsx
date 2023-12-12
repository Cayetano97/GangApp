import classes from "./StatisticsBalance.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCashRegister } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import Spinner from "../../../../Spinner/Spinner";

const StatisticsBalance = () => {
  const [loading, setLoading] = useState(false);
  const [totalLists, setTotalLists] = useState([]);
  const [savedLists, setSavedLists] = useState([]);
  const [shopLists, setShopLists] = useState([]);
  const [finishLists, setFinishLists] = useState([]);
  const [supermarket, setSupermarket] = useState([]);

  useEffect(() => {
    const loginData = localStorage.getItem("Response");
    const loginDataParse = JSON.parse(loginData);
    const userId = loginDataParse.data.id;

    const getTotalLists = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/total_lists/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("Token"),
              "auth-token-refresh": localStorage.getItem("Refresh_Token"),
            },
          }
        );
        if (response.status !== 200) {
          console.log(
            "Error getting data from total lists - response is not 200"
          );
        } else if (response.status === 404) {
          console.log("Error 404");
        } else {
          const data = await response.json();
          setTotalLists(data.data);
        }
      } catch (error) {
        console.log("Error getting data from total lists");
      }
    };

    const getSavedLists = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/total_lists_saved/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("Token"),
              "auth-token-refresh": localStorage.getItem("Refresh_Token"),
            },
          }
        );
        if (response.status !== 200) {
          console.log(
            "Error getting data from saved lists - response is not 200"
          );
        } else if (response.status === 404) {
          console.log("Error 404");
        } else {
          const data = await response.json();
          setSavedLists(data.data);
        }
      } catch (error) {
        console.log("Error getting data from saved lists");
      }
    };

    const getShopLists = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/total_lists_shopping/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("Token"),
              "auth-token-refresh": localStorage.getItem("Refresh_Token"),
            },
          }
        );
        if (response.status !== 200) {
          console.log(
            "Error getting data from shopping lists - response is not 200"
          );
        } else if (response.status === 404) {
          console.log("Error 404");
        } else {
          const data = await response.json();
          setShopLists(data.data);
        }
      } catch (error) {
        console.log("Error getting data from shopping lists");
      }
    };

    const getFinishLists = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/total_lists_finished/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("Token"),
              "auth-token-refresh": localStorage.getItem("Refresh_Token"),
            },
          }
        );
        if (response.status !== 200) {
          console.log(
            "Error getting data from finished lists - response is not 200"
          );
        } else if (response.status === 404) {
          console.log("Error 404");
        } else {
          const data = await response.json();
          setFinishLists(data.data);
        }
      } catch (error) {
        console.log("Error getting data from finished lists ");
      }
    };

    const getSupermarket = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/most_used_market/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("Token"),
              "auth-token-refresh": localStorage.getItem("Refresh_Token"),
            },
          }
        );
        if (response.status !== 200) {
          console.log(
            "Error getting data from most used market - response is not 200"
          );
        } else {
          const data = await response.json();

          if (data.data === 0) {
            setSupermarket("No hay datos");
          } else {
            setSupermarket(data.data);
          }
        }
      } catch (error) {
        console.log("Error getting data from most used market");
      }
    };

    getTotalLists();
    getSavedLists();
    getShopLists();
    getFinishLists();
    getSupermarket();

    Promise.all([
      getTotalLists(),
      getSavedLists(),
      getShopLists(),
      getFinishLists(),
      getSupermarket(),
    ]).then(() => {
      setLoading(true);
    });
  }, []);

  return (
    <>
      {loading ? (
        <div className={classes.statisticsBalance}>
          <div className={classes.statisticsBalanceItem}>
            <div className={classes.statisticsBalanceTittle}>
              <label>
                <FontAwesomeIcon icon={faCashRegister} /> Estadísticas
              </label>
            </div>
            <p>
              Supermercado más frecuente:
              <span> {supermarket}</span>
            </p>
            <p>
              Número de listas creadas:
              <span> {totalLists}</span>
            </p>
            <p>
              Número de listas guardadas:
              <span> {savedLists}</span>
            </p>
            <p>
              Número de listas comprando:
              <span> {shopLists}</span>
            </p>
            <p>
              Número de listas finalizadas:
              <span> {finishLists}</span>
            </p>
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default StatisticsBalance;
