import classes from "./Used.module.css";
import Spinner from "../../../Spinner/Spinner";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";

const Used = () => {
  const idSales = localStorage.getItem("saleId");
  const [isLoading, setIsLoading] = useState(false);
  const [usedData, setUsedData] = useState({});

  const handleBack = () => {
    window.history.back();
  };

  const fetchUsedSale = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/salesid/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("Token"),
          "auth-token-refresh": localStorage.getItem("Refresh_Token"),
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsedData(data.data[0]);
        setIsLoading(true);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchUsedSale(idSales);
  }, [idSales]);

  return (
    <>
      <div className={classes.back} onClick={handleBack}>
        <FontAwesomeIcon icon={faArrowLeftLong} className={classes.arrow} />{" "}
        <span>Ofertas</span>
      </div>
      <div className={classes.usedMain}>
        {isLoading ? (
          <>
            <h3>Oferta utilizada</h3>
            <div className={classes.cardsale}>
              <img src={usedData.url} alt={usedData.name} />
              <span>
                <strong>Producto: </strong>
                {usedData.name}
              </span>
              <span>
                <strong>Descuento: </strong>
                {usedData.discount * 100}%
              </span>
              <span>
                <strong>Supermercados disponibles: </strong>
                {usedData && usedData.market && usedData.market.length !== 0 ? (
                  <ul>
                    {usedData.market.map((supermarket, index) => (
                      <li key={index}>{supermarket}</li>
                    ))}
                  </ul>
                ) : (
                  "No hay supermercados disponibles"
                )}
              </span>
            </div>
          </>
        ) : (
          <Spinner />
        )}
      </div>
    </>
  );
};

export default Used;
