import { useState } from "react";
import classes from "./CreateProducts.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPlus } from "@fortawesome/free-solid-svg-icons";
import Alert from "../../Alert/Alert";

const CreateProducts = () => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [market, setMarket] = useState([]);
  const [created, setCreated] = useState(false);
  const [empty, setEmpty] = useState(false);

  const handleCreateProduct = async () => {
    try {
      const response = await fetch("http://localhost:8000/newproduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("Token"),
          "auth-token-refresh": localStorage.getItem("Refresh_Token"),
        },
        body: JSON.stringify({
          name_product: name,
          url: url,
          market: market,
        }),
      });
      console.log(response);
      if (response.status !== 200) {
        console.log("Error creating product, response not ok-200");
      } else {
        console.log("Product created");
        setCreated(true);
      }
    } catch (error) {
      console.log("Error creating product", error);
    }
    handleResetError();
    handleResetInfo();
  };

  const handleEmpty = () => {
    if (
      name === "" ||
      url === "" ||
      market.length === 0 ||
      market.some(
        (marketItem) =>
          marketItem.name_market === "" ||
          marketItem.price === "" ||
          marketItem.date === ""
      )
    ) {
      setEmpty(true);
      setTimeout(() => {
        setEmpty(false);
      }, 5000);
    } else {
      handleCreateProduct();
      setEmpty(false);
    }
  };

  const handleResetInfo = () => {
    setName("");
    setUrl("");
    setMarket([]);
  };

  const handleResetError = () => {
    setTimeout(() => {
      setEmpty(false);
      setCreated(false);
    }, 5000);
  };

  const handleAddMarket = () => {
    const newMarket = {
      name_market: "",
      price: "",
      date: "",
    };
    setMarket([...market, newMarket]);
  };

  const handleRemoveMarket = (index) => {
    const updatedMarket = [...market];
    updatedMarket.splice(index, 1);
    setMarket(updatedMarket);
  };

  const handleMarketChange = (index, field, value) => {
    const updatedMarket = [...market];
    updatedMarket[index][field] = value;

    const name = updatedMarket[index].name_market.toLowerCase();
    if (name === "mercadona") {
      updatedMarket[index].id_market = 1;
    } else if (name === "dia" || name === "día") {
      updatedMarket[index].id_market = 2;
    } else if (name === "lidl") {
      updatedMarket[index].id_market = 3;
    }

    setMarket(updatedMarket);
  };

  return (
    <div className={classes.maincreate}>
      <h2>Crear productos</h2>
      <form className={classes.formcreate}>
        <label htmlFor="name">Nombre</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
            )
          }
          placeholder="Introduce el nombre del nuevo producto"
        />
        <label htmlFor="url">URL</label>
        <input
          type="text"
          name="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Introduce la URL de la imagen"
        />
        <h3>Supermercado</h3>
        {market.map((marketItem, index) => (
          <div key={index}>
            <label htmlFor={`name_market_${index}`}>Nombre del mercado</label>
            <input
              type="text"
              name={`name_market_${index}`}
              value={
                marketItem.name_market.charAt(0).toUpperCase() +
                marketItem.name_market.slice(1)
              }
              onChange={(e) =>
                handleMarketChange(index, "name_market", e.target.value)
              }
              placeholder="Introduce el nombre del supermercado"
            />
            <label htmlFor={`price_${index}`}>Precio</label>
            <input
              type="text"
              name={`price_${index}`}
              value={marketItem.price}
              onChange={(e) =>
                handleMarketChange(index, "price", e.target.value)
              }
              placeholder="Introduce el precio del producto"
              className={classes.inputprice}
            />
            <label htmlFor={`date_${index}`}>Fecha</label>
            <input
              type="date"
              name={`date_${index}`}
              value={marketItem.date}
              onChange={(e) =>
                handleMarketChange(index, "date", e.target.value)
              }
            />
            <button
              type="button"
              onClick={() => handleRemoveMarket(index)}
              className={classes.closebutton}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddMarket}
          className={classes.addmarketbutton}
        >
          Agregar mercado
        </button>
        <button type="button" onClick={handleEmpty}>
          Crear
          <FontAwesomeIcon icon={faPlus} />
        </button>
        {created ? (
          <div className={classes.greenalert}>
            <p>Producto creado correctamente</p>
          </div>
        ) : (
          ""
        )}
        {empty ? <Alert text="Por favor, rellene todos los campos" /> : ""}
      </form>
      <h3>Subir archivo CSV</h3>
      <div className={classes.importfile}>
        <input type="file" name="file" />
      </div>
    </div>
  );
};

export default CreateProducts;
