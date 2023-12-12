import React, { useState, useEffect } from "react";
import classes from "./NewList.module.css";
import CameraUploader from "./CameraUploader/CameraUploader";
import { useNavigate } from "react-router-dom";
import Alert from "../../Alert/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";

const NewList = () => {
  const navigate = useNavigate();
  const [listName, setListName] = useState("");
  const [productName, setProductName] = useState("");
  const [matchingProducts, setMatchingProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [listNameError, setListNameError] = useState(false);
  const [noSelectedProducts, setNoSelectedProducts] = useState(false);
  const [idList, setIdList] = useState("");
  const [alert, setAlert] = useState(false);
  const [savedList, setSavedList] = useState(false);
  const [productsQuantity, setProductsQuantity] = useState(0);

  const handleListNameChange = (e) => {
    setListName(e.target.value);
  };

  const handleInputChange = (e) => {
    setProductName(e.target.value);
  };

  const handleBack = () => {
    window.history.back();
  };

  const addProductToList = (product) => {
    const isProductAdded = selectedProducts.some(
      (selectedProduct) => selectedProduct._id === product._id
    );

    if (!isProductAdded) {
      setSelectedProducts((prevProducts) => [...prevProducts, product]);
      setProductName("");
    }
  };

  const removeProductFromList = (product) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.filter(
        (selectedProduct) => selectedProduct._id !== product._id
      )
    );
  };

  const createList = async () => {
    const loginData = localStorage.getItem("Response");
    const loginDataParse = JSON.parse(loginData);
    const idUser = loginDataParse.data.id;

    if (listName === "") {
      setListNameError(true);
      return;
    }

    if (selectedProducts.length === 0) {
      setNoSelectedProducts(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("Token"),
          "auth-token-refresh": localStorage.getItem("Refresh_Token"),
        },
        body: JSON.stringify({
          id_user: idUser,
          id_products: selectedProducts.map((product) => {
            return (product = {
              id: product._id,
              name: product.name_product,
            });
          }),
          name_list: listName,
          status: "Guardada",
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear la lista");
      } else {
        const data = await response.json();
        setIdList(data.datasave._id);
        setProductsQuantity(data.datasave.id_products.length);
        console.log(data.datasave.id_products.length);
      }
    } catch (error) {
      console.log("Error creating list:", error);
    }
  };

  const handleButtonSave = () => {
    createList();
  };

  useEffect(() => {
    if (idList !== "") {
      console.log(idList);
      localStorage.setItem("id_list", idList);
      setSavedList(true);
    }
  }, [idList]);

  const handleButtonMarket = () => {
    if (idList !== "") {
      localStorage.setItem("id_list", idList);
      localStorage.setItem("product_quantity", productsQuantity);
      navigate("/profile/market");
    } else {
      setAlert(true);
      localStorage.removeItem("id_list");
      localStorage.removeItem("product_quantity");
    }
  };

  const handleListNameFocus = () => {
    setListNameError(false);
  };

  const handleInputFocus = () => {
    setNoSelectedProducts(false);
  };

  useEffect(() => {
    const searchMatchingProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/products/${productName}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("Token"),
              "auth-token-refresh": localStorage.getItem("Refresh_Token"),
            },
          }
        );
        const { data } = await response.json();
        setMatchingProducts(data.slice(0, 5));
      } catch (error) {
        console.log("Error searching for products:", error);
      }
    };

    if (productName !== "") {
      searchMatchingProducts();
    } else {
      setMatchingProducts([]);
    }
  }, [productName]);

  return (
    <>
      <div className={classes.NewList}>
        <div className={classes.back} onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowLeftLong} />
        </div>
        <h2>Nueva Lista</h2>
        <div className={classes.NewListForm}>
          <div className={classes.NewListFormName}>
            <label htmlFor="name">Nombre:</label>
            <input
              className={`${classes.NameInput} ${
                listNameError ? classes.ErrorInput : ""
              }`}
              type="text"
              id="name"
              placeholder="Nombre de la lista"
              value={listName.charAt(0).toUpperCase() + listName.slice(1)}
              onChange={handleListNameChange}
              onFocus={handleListNameFocus}
            />
          </div>
          <div className={classes.NewListFormSearch}>
            <label htmlFor="search">Buscar Productos:</label>
            <input
              className={`${classes.SearchInput} ${
                noSelectedProducts ? classes.ErrorInput : ""
              }`}
              type="text"
              id="search"
              placeholder="Introduce un producto"
              value={productName.charAt(0).toUpperCase() + productName.slice(1)}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
          </div>
          <div className={classes.NewListFormProducts}>
            <ul>
              {matchingProducts.map((product) => (
                <li className={classes.ButtonAdd} key={product._id}>
                  {product.name_product}
                  <button onClick={() => addProductToList(product)}>
                    Agregar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={classes.List}>
          <h3 className={classes.ListName}>
            {listName !== "" ? `${listName}:` : "- Sin Nombre -"}
          </h3>
          <ul className={classes.UlList}>
            {selectedProducts.map((product) => (
              <li key={product._id}>
                <button
                  className={classes.RemoveButton}
                  onClick={() => removeProductFromList(product)}
                >
                  X
                </button>
                {product.name_product}
              </li>
            ))}
          </ul>
        </div>

        <div className={classes.NewListFormButton}>
          <div>
            <button
              onClick={handleButtonSave}
              disabled={savedList}
              className={
                !savedList ? classes.normalButton : classes.disabledButton
              }
            >
              Guardar
            </button>
          </div>
          <div>
            <button
              onClick={handleButtonMarket}
              disabled={!savedList}
              className={
                savedList ? classes.normalButton : classes.disabledButton
              }
            >
              Elige un supermercado
            </button>
          </div>
        </div>
      </div>
      {alert && (
        <Alert text="Lo sentimos, algo no ha ido como debía... ¡Inténtalo de nuevo!" />
      )}
      <div>
        <CameraUploader title="Subir lista de la compra" />
      </div>
    </>
  );
};

export default NewList;
