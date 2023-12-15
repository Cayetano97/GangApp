import "./Market.css";
import Spinner from "../../Spinner/Spinner";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReceipt,
  faCartShopping,
  faBasketShopping,
  faArrowRightLong,
  faPiggyBank,
} from "@fortawesome/free-solid-svg-icons";
import Alert from "../../Alert/Alert";

const Market = () => {
  const [markets, setMarkets] = useState({});
  const [prices, setPrices] = useState({});
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [error, setError] = useState(false);
  const [array, setArray] = useState([]);
  const [recomended, setRecomended] = useState({});
  const [isLoadingRecomended, setIsLoadingRecomended] = useState(false);
  const [savedMoney, setSavedMoney] = useState([]);
  const [savedMarket, setSavedMarket] = useState([]);

  const navigate = useNavigate();
  const respuesta = localStorage.getItem("Response");
  const id_list = localStorage.getItem("id_list");
  const productsQuantity = localStorage.getItem("product_quantity");
  const respuestaJson = JSON.parse(respuesta);
  const idUser = respuestaJson.data.id;

  const merged = Object.entries(markets).map((market) => {
    return {
      market: market[0],
      products: market[1],
      price: prices[market[0]],
    };
  });

  const handleButtonRedirect = () => {
    if (selectedMarket !== null) {
      updateSupermarketName(id_list);
      navigate(`/profile/lists/${id_list}`);
    } else {
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 5000);
    }
  };

  const handleCheckbox = (marketId) => {
    setSelectedMarket(marketId === selectedMarket ? null : marketId);
    setSelectedPrice(prices[marketId]);
  };

  const fetchMarkets = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/listsmarket/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("Token"),
          "auth-token-refresh": localStorage.getItem("Refresh_Token"),
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMarkets(data.data.marketCount);
        setPrices(data.data.priceCount);
      }
    } catch (error) {
      setError(true);
    }
    setIsLoading(false);
  };

  const updateSupermarketName = async (lastList) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/list/${lastList}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("Token"),
          "auth-token-refresh": localStorage.getItem("Refresh_Token"),
        },
        body: JSON.stringify({
          status: "Comprando",
          supermarkets: selectedMarket,
          price: selectedPrice,
        }),
      });
      if (response.ok) {
        await response.json();
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const handlePriceFilter = () => {
    const orderPrice = merged.sort((a, b) => {
      return a.price - b.price;
    });

    setArray(orderPrice);
  };

  const handleProductsFilter = () => {
    const orderProducts = merged.sort((a, b) => {
      return b.products - a.products;
    });

    setArray(orderProducts);
  };

  const recomendedMarket = () => {
    setIsLoadingRecomended(true);
    const products = merged.map((products) => products.products);
    const maxProducts = Math.max(...products);
    const savedMoney = [];

    if (maxProducts === productsQuantity) {
      const equalProducts = merged.filter(
        (product) => product.products === productsQuantity
      );

      const equalPrices = equalProducts.sort((a, b) => {
        return a.price - b.price;
      });

      setRecomended(equalPrices[0]);

      for (let index = 1; index < equalPrices.length; index++) {
        savedMoney[equalPrices[index].market] =
          equalPrices[index].price - equalPrices[0].price;
      }

      const savedPrice = Object.values(savedMoney);
      const savedMarket = Object.keys(savedMoney);

      const filteredSavedPrice = savedPrice.filter((price) => price > 0);
      const fixedPrice = filteredSavedPrice.map((price) => price.toFixed(2));
      const filteredSavedMarket = savedMarket.filter(
        (market) => savedMoney[market] > 0
      );

      setSavedMoney(fixedPrice);
      setSavedMarket(filteredSavedMarket);

      setIsLoadingRecomended(false);
    } else if (maxProducts < productsQuantity) {
      const lessProducts = merged.filter(
        (product) => product.products < productsQuantity
      );

      const sortLessProducts = lessProducts.sort((a, b) => {
        if (a.products !== b.products) {
          return b.products - a.products;
        } else {
          return a.price - b.price;
        }
      });

      setRecomended(sortLessProducts[0]);

      for (let index = 1; index < sortLessProducts.length; index++) {
        savedMoney[sortLessProducts[index].market] =
          sortLessProducts[index].price - sortLessProducts[0].price;
      }

      const savedPrice = Object.values(savedMoney);
      const savedMarket = Object.keys(savedMoney);

      const filteredSavedPrice = savedPrice.filter((price) => price > 0);
      const fixedPrice = filteredSavedPrice.map((price) => price.toFixed(2));
      const filteredSavedMarket = savedMarket.filter(
        (market) => savedMoney[market] > 0
      );

      setSavedMoney(fixedPrice);
      setSavedMarket(filteredSavedMarket);

      setIsLoadingRecomended(false);
    } else {
      const never = merged.sort((a, b) => {
        return a.price - b.price;
      });
      setRecomended(never[0]);
      setIsLoadingRecomended(false);
    }
  };

  useEffect(() => {
    fetchMarkets(id_list);
  }, [idUser, id_list]);

  useEffect(() => {
    setArray(merged);
    recomendedMarket();
  }, [markets, prices]);

  return (
    <>
      <div className="market">
        <div className="market-title">
          <FontAwesomeIcon icon={faCartShopping} />
          <h2>Elige tu supermercado</h2>
        </div>
        <h4>Recomendado</h4>
        {isLoadingRecomended ? (
          <Spinner />
        ) : (
          recomended && (
            <div className="cardHeader-recomended">
              <div className="nameCheck">
                <h3>{recomended.market}</h3>

                <input
                  type="checkbox"
                  checked={
                    selectedMarket === recomended.market &&
                    selectedPrice === recomended.price
                  }
                  onChange={() => handleCheckbox(recomended.market)}
                />
              </div>
              <div className="cardList-recomended">
                <ul>
                  <li key={recomended.market} className="liList">
                    <div className="available">
                      <FontAwesomeIcon
                        icon={faBasketShopping}
                        className="icon"
                      />
                      Productos disponibles de tu lista:
                      <span className="checkboxText">
                        {recomended.products}/{productsQuantity}
                      </span>
                      <div className="total">
                        <FontAwesomeIcon icon={faReceipt} className="icon" />
                        Precio total:
                        <span className="checkboxText">
                          {recomended.price !== undefined
                            ? recomended.price.toFixed(2)
                            : recomended.price}
                          €
                        </span>
                      </div>
                      <div className="save">
                        <FontAwesomeIcon icon={faPiggyBank} className="icon" />
                        <span>Ahorras: </span>
                        <ul>
                          {savedMoney.length > 0 && savedMarket.length > 0 ? (
                            savedMarket.map((market, index) => (
                              <li key={index}>
                                <span>{savedMoney[index]} €</span> respecto al
                                {market}
                              </li>
                            ))
                          ) : (
                            <p>No hay ahorros disponibles.</p>
                          )}
                        </ul>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          )
        )}
      </div>
      <div className="market">
        <div className="market-filter">
          <h4>Ordena por:</h4>
          <label>
            <input
              type="radio"
              name="filter"
              value="price"
              onClick={handlePriceFilter}
            />
            Precio
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value="products"
              onClick={handleProductsFilter}
            />
            Productos
          </label>
        </div>
        {isLoading ? (
          <Spinner />
        ) : error ? (
          <Alert text="Hubo un error. ¡Inténtalo de nuevo!" />
        ) : (
          <>
            {array &&
              array.length !== 0 &&
              array.map((market) => (
                <div key={market.market} className="cardHeader">
                  <div className="nameCheck">
                    <h3>{market.market}</h3>
                    <input
                      type="checkbox"
                      checked={selectedMarket === market.market}
                      onChange={() => handleCheckbox(market.market)}
                    />
                  </div>
                  <div className="cardList">
                    <ul>
                      <li key={market.market} className="liList">
                        <div className="available">
                          <FontAwesomeIcon
                            icon={faBasketShopping}
                            className="icon"
                          />
                          Productos disponibles de tu lista:
                          <span className="checkboxText">
                            {market.products}/{productsQuantity}
                          </span>
                        </div>
                        <div className="total">
                          <FontAwesomeIcon icon={faReceipt} className="icon" />
                          Precio total:
                          <span className="checkboxText">
                            {market.price.toFixed(2)} €
                          </span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
          </>
        )}
      </div>
      <div className="divButton">
        <button onClick={handleButtonRedirect} className="button">
          Siguiente
          <FontAwesomeIcon icon={faArrowRightLong} />
        </button>
      </div>
      {alert && (
        <Alert text="Debes seleccionar un supermercado para continuar." />
      )}
    </>
  );
};

export default Market;
