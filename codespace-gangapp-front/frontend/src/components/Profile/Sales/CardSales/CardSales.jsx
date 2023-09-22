import classes from "./CardSales.module.css";
import Spinner from "../../../Spinner/Spinner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";

const CardSales = ({ isLoading, error, dataResponseSales, selectedBrand }) => {
  const [clickedCardIndex, setClickedCardIndex] = useState(null);
  const navigate = useNavigate();

  const handleCardClick = (index) => {
    localStorage.setItem(
      "discount",
      (dataResponseSales[index].discount * 100).toFixed(0)
    );
    localStorage.setItem("saleId", dataResponseSales[index]._id);

    if (clickedCardIndex === index) {
      setClickedCardIndex(null);
    } else {
      setClickedCardIndex(index);
    }
  };

  const handleRedirect = () => {
    navigate("/profile/sales/used");
  };

  return (
    <div className={classes.productCard}>
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <p>Lo sentimos, algo salió mal... ¡Inténtalo de nuevo!</p>
      ) : !Array.isArray(dataResponseSales) ||
        dataResponseSales.length === 0 ? (
        <p>No hay ofertas disponibles.</p>
      ) : (
        dataResponseSales.map((sale, index) => {
          return (
            <button
              className={classes.divButton}
              onClick={() => handleCardClick(index)}
              key={sale._id}
            >
              <div className={classes.cardContainer}>
                <div
                  className={
                    clickedCardIndex === index
                      ? classes.allCardClicked
                      : classes.allCard
                  }
                >
                  <div className={classes.imgCard}>
                    <img src={sale.url} alt={sale.name} loading="lazy" />
                  </div>
                  <div>
                    <span className={classes.bucket}>
                      {(sale.discount * 100).toFixed(0)} %
                    </span>
                  </div>
                  <div className={classes.infoCard}>
                    <h3> {sale.name}</h3>
                    <div className={classes.discount}>
                      <div>
                        <div>
                          Marca:{" "}
                          <span className={classes.brand}>{sale.brand}</span>
                        </div>
                        <div>
                          Inicio Oferta:{" "}
                          <span>
                            {new Date(sale.start_discount).toLocaleDateString()}
                          </span>
                        </div>
                        <div className={classes.arrow}>
                          <div>
                            Fin Oferta:{" "}
                            <span>
                              {new Date(sale.end_discount).toLocaleDateString()}
                            </span>
                          </div>
                          <span onClick={handleRedirect}>
                            Ver oferta{" "}
                            <FontAwesomeIcon icon={faArrowRightLong} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          );
        })
      )}
    </div>
  );
};

export default CardSales;
