import classes from "./HomeAdmin.module.css";
import { useNavigate } from "react-router-dom";
import Spinner from "../../Spinner/Spinner";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserShield,
  faPenToSquare,
  faFile,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

const HomeAdmin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [allMarkets, setAllMarkets] = useState(0);
  const [allLists, setAllLists] = useState(0);
  const [allUsers, setUsers] = useState(0);
  const [CountSales, setCountSales] = useState(0);

  const handleRedirect0 = () => {
    navigate("products");
  };
  const handleRedirect1 = () => {
    navigate("create");
  };
  const handleRedirect2 = () => {
    navigate("edit");
  };
  const handleRedirect3 = () => {
    navigate("/profile/new");
  };

  const getAllProducts = async () => {
    try {
      const response = await fetch(`http://localhost:8000/product/count`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("Token"),
          "auth-token-refresh": localStorage.getItem("Refresh_Token"),
        },
      });
      if (response.status !== 200) {
        console.log("Error getting all product number");
      } else {
        const data = await response.json();
        console.log("All products ok");
        setAllProducts(data.count);
        setLoading(true);
      }
    } catch (error) {
      console.log("Error getting all products");
    }
  };
  const getAllMarkets = async () => {
    try {
      const response = await fetch(`http://localhost:8000/marketname`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("Token"),
          "auth-token-refresh": localStorage.getItem("Refresh_Token"),
        },
      });
      if (response.status !== 200) {
        console.log("Error getting all market name");
      } else {
        const data = await response.json();
        setAllMarkets(data);
        setLoading(true);
      }
    } catch (error) {
      console.log("Error getting all markets");
    }
  };
  const getAllList = async () => {
    try {
      const response = await fetch(`http://localhost:8000/all_lists`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("Token"),
          "auth-token-refresh": localStorage.getItem("Refresh_Token"),
        },
      });
      if (response.status !== 200) {
        console.log("Error getting all lists");
      } else {
        const data = await response.json();
        setAllLists(data.data);
        setLoading(true);
      }
    } catch (error) {
      console.log("Error getting all lists");
    }
  };
  const getAllUsers = async () => {
    try {
      const response = await fetch(`http://localhost:8000/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("Token"),
          "auth-token-refresh": localStorage.getItem("Refresh_Token"),
        },
      });
      if (response.status !== 200) {
        console.log("Error getting all users");
      } else {
        const data = await response.json();
        console.log("All users ok");
        setUsers(data.data);
        setLoading(true);
      }
    } catch (error) {
      console.log("Error getting all users");
    }
  };
  const getSalesCount = async () => {
    try {
      const response = await fetch(`http://localhost:8000/salescount`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("Token"),
          "auth-token-refresh": localStorage.getItem("Refresh_Token"),
        },
      });
      if (response.status !== 200) {
        console.log("Error getting sales count");
      } else {
        const data = await response.json();
        setCountSales(data.data);
        setLoading(true);
      }
    } catch (error) {
      console.log("Error getting sales count");
    }
  };

  useEffect(() => {
    getAllProducts();
    getAllList();
    getAllUsers();
    getSalesCount();
    getAllMarkets();
  }, []);

  return (
    <div className={classes.MainAdmin}>
      <h2>
        Admin
        <FontAwesomeIcon icon={faUserShield} />
      </h2>
      <h3>Productos</h3>
      <div className={classes.actions}>
        <button onClick={handleRedirect0}>
          Productos <FontAwesomeIcon icon={faFile} />
        </button>
        <button onClick={handleRedirect1}>
          Crear productos <FontAwesomeIcon icon={faPlus} />
        </button>
        <button onClick={handleRedirect2}>
          Editar productos <FontAwesomeIcon icon={faPenToSquare} />
        </button>
      </div>
      <div className={classes.statsproducts}>
        {loading ? (
          <>
            <span>
              <strong>Número de productos: </strong>
              {allProducts}
            </span>
            <div className={classes.marketnames}>
              <span>
                <strong>Número de supermercados: </strong>
                {allMarkets.count}
              </span>
              <ul>
                {allMarkets.marketNames &&
                  allMarkets.marketNames.map((name, index) => (
                    <li key={index}>{name}</li>
                  ))}
              </ul>
            </div>
          </>
        ) : (
          <Spinner />
        )}
      </div>
      <h3>Listas</h3>
      <div className={classes.statslist}>
        <button onClick={handleRedirect3}>
          Crear Lista <FontAwesomeIcon icon={faPlus} />
        </button>
        {loading ? (
          <span>
            <strong>Número de listas: </strong>
            {allLists ? allLists.length : 0}
          </span>
        ) : (
          <Spinner />
        )}
      </div>
      <h3>Usuarios</h3>
      <div className={classes.statslist}>
        {loading ? (
          <span>
            <strong>Número de usuarios: </strong>
            {allUsers ? allUsers.length : 0}
          </span>
        ) : (
          <Spinner />
        )}
      </div>
      <h3>Ofertas</h3>
      <div className={classes.statslist}>
        {loading ? (
          <span>
            <strong>Número de ofertas: </strong>
            {CountSales}
          </span>
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
};

export default HomeAdmin;
