import "./CardSales.css";
import Spinner from "../../../Spinner/Spinner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CardSales = ({ isLoading, error, dataResponseSales }) => {
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
    <div className="productCard">
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
              className="divButton"
              onClick={() => handleCardClick(index)}
              key={sale._id}
            >
              <div className="cardContainer">
                <div
                  className={
                    clickedCardIndex === index ? "allCardClicked" : "allCard"
                  }
                >
                  <div className="imgCard">
                    <img src={sale.url} alt={sale.name} loading="lazy" />
                  </div>
                  <div>
                    <span className="bucket">
                      {(sale.discount * 100).toFixed(0)} %
                    </span>
                  </div>
                  <div className="infoCard">
                    <h3> {sale.name}</h3>
                    <div className="discount">
                      <span>Marca:&nbsp;{sale.brand}</span>
                      <div className="date">
                        <span>
                          Inicio: &nbsp;
                          {new Date(sale.start_discount).toLocaleDateString()}
                        </span>
                        <span>
                          Fin: &nbsp;
                          {new Date(sale.end_discount).toLocaleDateString()}
                        </span>
                      </div>
                      <span onClick={handleRedirect}>Ver oferta &nbsp; →</span>
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
