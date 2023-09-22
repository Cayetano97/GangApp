import classes from "./HistoryBalance.module.css";
import { faTimeline } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";

const HistoryBalance = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [historyList, setHistoryList] = useState([]);

  useEffect(() => {
    const loginData = localStorage.getItem("Response");
    const loginDataParse = JSON.parse(loginData);
    const userId = loginDataParse.data.id;

    const getHistoryList = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/historyList/${userId}`,
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
          setError("Error getting data");
        } else {
          const data = await response.json();
          setHistoryList(data.data);
        }
      } catch (error) {
        console.log("Error getting data");
      } finally {
        setLoading(false);
      }
    };

    getHistoryList();
  }, []);

  // Función para formatear la fecha en formato europeo (DD/MM/AAAA)
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Función para capitalizar la primera letra del texto
  function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  return (
    <div className={classes.historyBalance}>
      <div className={classes.historyTable}>
        <p>
          <FontAwesomeIcon icon={faTimeline} size="xl" /> Histórico
        </p>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Fecha:</th>
                <th>Nombre:</th>
                <th>Supermercado:</th>
              </tr>
            </thead>
            <tbody>
              {historyList.map((item, index) => (
                <tr key={index}>
                  <td>{formatDate(item.createdAt)}</td>
                  <td>{capitalizeFirstLetter(item.name_list)}</td>{" "}
                  {/* Ajusta el nombre del campo cantidad */}
                  <td>{item.supermarkets.join(", ")}</td>{" "}
                  {/* Une los supermercados en un solo string */}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default HistoryBalance;
