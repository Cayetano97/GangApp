import classes from "./Home.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSackDollar,
  faBasketShopping,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import CardList from "../CardList/CardList";
import CardSales from "../Sales/CardSales/CardSales";
import Alert from "../../Alert/Alert";

const Home = () => {
  const [dataResponseLists, setDataResponseLists] = useState([]);
  const [dataResponseSales, setDataResponseSales] = useState([]);
  const [hiddeButton, setHideButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const loginData = localStorage.getItem("Response");
  const loginDataParse = JSON.parse(loginData);
  const idUser = loginDataParse.data.id;
  const endpoint = "random";

  const handleNewList = () => {
    navigate("/profile/new");
  };

  const handleAllLists = () => {
    navigate(`/profile/list/${idUser}`);
  };

  const handleOpenList = () => {
    if (dataResponseLists.data.length !== 0) {
      const idList = dataResponseLists.data[0]._id;
      navigate(`/profile/lists/${idList}`);
    }
  };

  const handleSales = () => {
    navigate("/profile/sales");
  };

  const fetchLastLists = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/lastlist/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("Token"),
          "auth-token-refresh": localStorage.getItem("Refresh_Token"),
        },
      });
      if (response.ok) {
        const dataResponseLists = await response.json();
        setDataResponseLists(dataResponseLists);
        if (dataResponseLists.data.length > 0) {
          setHideButton(true);
        }
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      setError(error);
    }
    setIsLoading(false);
  };

  const fetchSales = async (endpoint) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/sale/${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("Token"),
          "auth-token-refresh": localStorage.getItem("Refresh_Token"),
        },
      });
      if (response.ok) {
        const dataResponseSales = await response.json();
        setDataResponseSales(dataResponseSales);
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      setError(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchLastLists(idUser);
    fetchSales(endpoint);
  }, [idUser, endpoint]);

  return (
    <div className={classes.home}>
      <div className={classes["new-list"]}>
        <button onClick={handleNewList}>
          Añadir nueva lista
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <div className={classes["shopping-lists"]}>
        <div className={classes["shopping-lists-title"]}>
          <FontAwesomeIcon icon={faBasketShopping} />
          <h3>Última lista creada</h3>
        </div>
        {error ? (
          <Alert text="Algo no ha ido como debía... ¡Inténtalo de nuevo!" />
        ) : (
          <CardList
            handleOpenList={handleOpenList}
            isLoading={isLoading}
            error={error}
            dataResponse={dataResponseLists}
          />
        )}

        {hiddeButton ? (
          <button className={classes["see-all"]} onClick={handleAllLists}>
            Todas tus listas
          </button>
        ) : null}
      </div>
      <div className={classes.sales}>
        <div className={classes["sales-title"]}>
          <FontAwesomeIcon icon={faSackDollar} />
          <h3>Ofertas</h3>
        </div>
        <p>
          Descubre todas nuestras ofertas exclusivas.
          <FontAwesomeIcon
            icon={faArrowUpRightFromSquare}
            onClick={handleSales}
          />
        </p>
        {error ? (
          <Alert text="Algo no ha ido como debía... ¡Inténtalo de nuevo!" />
        ) : (
          <CardSales
            isLoading={isLoading}
            error={error}
            dataResponseSales={dataResponseSales.data}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
