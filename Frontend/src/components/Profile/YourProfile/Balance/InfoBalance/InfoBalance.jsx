import "./InfoBalance.css";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPiggyBank,
  faVault,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";

const InfoBalance = () => {
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalSaved, setTotalSaved] = useState([0]);
  const [halfSaved, setHalfSaved] = useState([0]);

  useEffect(() => {
    const loginData = localStorage.getItem("Response");
    const loginDataParse = JSON.parse(loginData);
    const idUser = loginDataParse.data.id;

    const fetchData = async (id) => {
      try {
        const response = await fetch(`http://localhost:8000/user/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("Token"),
            "auth-token-refresh": localStorage.getItem("Refresh_Token"),
          },
        });
        if (response.ok) {
          const dataResponse = await response.json();
          setResponse(dataResponse.balance);
          setIsLoading(false);
        } else {
          throw new Error("Error al obtener los datos");
        }
      } catch (error) {
        setError(error);
      }

      const getTotalSaved = async () => {
        try {
          const response = await fetch(
            `http://localhost:8000/totalsave/${idUser}`,
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
            setTotalSaved(data.data);
          }
        } catch (error) {
          console.log("Error getting data");
        }
      };

      const getHalfSaved = async () => {
        try {
          const response = await fetch(
            `http://localhost:8000/totalmedia/${idUser}`,
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
            setHalfSaved(data.data);
          }
        } catch (error) {
          console.log("Error getting data");
        }
      };

      getTotalSaved();
      getHalfSaved();
    };

    fetchData(idUser);
  }, []);

  return (
    <div className="infoBalance">
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className="cardBalance">
            <div className="icon">
              <FontAwesomeIcon icon={faWallet} size="xl" />
            </div>
            <div className="infoText">
              <label>Monedero</label>
              <label className="infoMoney">
                <span>{response} €</span>
              </label>
            </div>
          </div>
          <div className="cardBalance">
            <div className="icon">
              <FontAwesomeIcon icon={faPiggyBank} size="xl" />
            </div>
            <div className="infoText">
              <label>Total ahorrado</label>
              <label className="infoMoney">
                <span>{totalSaved ? totalSaved : 0} €</span>
              </label>
            </div>
          </div>
          <div className="cardBalance">
            <div className="icon">
              <FontAwesomeIcon icon={faVault} size="xl" />
            </div>
            <div className="infoText">
              <label>Media ahorrado</label>
              <label className="infoMoney">
                <span>{halfSaved ? halfSaved : 0} €</span>
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InfoBalance;
