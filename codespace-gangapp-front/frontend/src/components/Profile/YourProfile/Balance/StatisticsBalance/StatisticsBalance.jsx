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
          console.log("Error getting data");
        } else {
          const data = await response.json();
          setTotalLists(data.data);
          setLoading(true);
        }
      } catch (error) {
        console.log("Error getting data");
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
          console.log("Error getting data");
        } else {
          const data = await response.json();
          setSavedLists(data.data);
          setLoading(true);
        }
      } catch (error) {
        console.log("Error getting data");
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
          console.log("Error getting data");
        } else {
          const data = await response.json();
          setShopLists(data.data);
          setLoading(true);
        }
      } catch (error) {
        console.log("Error getting data");
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
          console.log("Error getting data");
        } else {
          const data = await response.json();
          setFinishLists(data.data);
          setLoading(true);
        }
      } catch (error) {
        console.log("Error getting data");
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
          console.log("Error getting data");
        } else {
          const data = await response.json();
          setSupermarket(data.data);
          console.log(data);
          setLoading(true);
        }
      } catch (error) {
        console.log("Error getting data");
      }
    };

    getTotalLists();
    getSavedLists();
    getShopLists();
    getFinishLists();
    getSupermarket();
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
              <span> {supermarket.length === 0 ? "0" : supermarket}</span>
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
