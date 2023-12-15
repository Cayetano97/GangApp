import "./EditProducts.css";
import SearchProducts from "./SearchProducts/SearchProducts";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import AlertGreen from "../../AlertGreen/AlertGreen";
import Alert from "../../Alert/Alert";

const EditProducts = () => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [market, setMarket] = useState([]);
  const [edit, setEdit] = useState(false);
  const [id_product, setId_product] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertRed, setAlertRed] = useState(false);
  const [alertError, setAlertError] = useState(false);

  const handleEditProduct = async (id) => {
    try {
      setId_product(localStorage.getItem("Product_Id"));
      const response = await fetch(`http://localhost:8000/product/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("Token"),
          "auth-token-refresh": localStorage.getItem("Refresh_Token"),
        },
        body: JSON.stringify({
          name_product: name !== "" ? name : undefined,
          url: url !== "" ? url : undefined,
          ...(market.length !== 0 && { market }),
        }),
      });
      if (response.status !== 200) {
        console.log("Error updating product, response not 200");
        setAlertRed(true);
        handleResetError();
      } else {
        console.log("Product updated");
        localStorage.removeItem("Product_Id");
        console.log(response);
        setAlert(true);
        handleResetError();
      }
    } catch (error) {
      console.log("Error updating product");
    }

    if (name === "" && url === "" && market.length === 0) {
      setAlertError(true);
    } else {
      setAlertError(false);
    }

    handleResetInfo();
  };

  const handleResetError = () => {
    setTimeout(() => {
      setAlert(false);
      setAlertRed(false);
      setAlertError(false);
    }, 5000);
  };

  const handleResetInfo = () => {
    setName("");
    setUrl("");
    setMarket([]);
    localStorage.removeItem("Product_Id");
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
    } else if (name === "aldi") {
      updatedMarket[index].id_market = 4;
    }

    setMarket(updatedMarket);
  };

  useEffect(() => {
    setId_product(localStorage.getItem("Product_Id"));
  }, []);

  return (
    <>
      <SearchProducts handleEdit={() => setEdit(true)} />
      {edit && (
        <div className="mainedit">
          <h2>Editar producto</h2>
          <form className="formcreate">
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value.charAt(0).toUpperCase() +
                    e.target.value.slice(1)
                )
              }
              placeholder="Introduce el nuevo nombre del producto"
            />
            <label htmlFor="url">URL</label>
            <input
              type="text"
              name="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Introduce la nueva URL de la imagen"
            />
            <h3>Supermercado</h3>
            {market.map((marketItem, index) => (
              <div key={index}>
                <label htmlFor={`name_market_${index}`}>
                  Nombre del mercado
                </label>
                <input
                  type="text"
                  name={`name_market_${index}`}
                  value={marketItem.name_market}
                  onChange={(e) =>
                    handleMarketChange(
                      index,
                      "name_market",
                      e.target.value.charAt(0).toUpperCase() +
                        e.target.value.slice(1)
                    )
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
                  className="inputprice"
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
                  className="closebutton"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddMarket}
              className="addmarketbutton"
            >
              Agregar mercado
            </button>
            <button type="button" onClick={() => handleEditProduct(id_product)}>
              Editar
            </button>
          </form>
          {alertRed || alertError ? (
            <Alert text="Error al editar el producto"></Alert>
          ) : (
            ""
          )}
          {alert ? (
            <AlertGreen text="Producto editado correctamente"></AlertGreen>
          ) : (
            ""
          )}
        </div>
      )}
    </>
  );
};

export default EditProducts;
