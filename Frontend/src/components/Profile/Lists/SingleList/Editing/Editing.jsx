import classes from "./Editing.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faBasketShopping,
  faTrash,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import DeleteButton from "../../DeleteButton/DeleteButton";
import Alert from "../../../../Alert/Alert";
import Spinner from "../../../../Spinner/Spinner";

const Editing = (props) => {
  const data = props.data;

  //UseStates
  const [isEditing, setIsEditing] = useState(false);
  const [listName, setListName] = useState(data.name_list);
  const [searchName, setSearchName] = useState("");
  const [editProducts, setEditProducts] = useState(data.id_products);
  const [matchingProducts, setMatchingProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [focus, setFocus] = useState(false);

  //Const declarations

  const navigate = useNavigate();
  const id_list = window.location.pathname.split("/")[3];

  //Handle Market functions

  const handleNavigate = () => {
    localStorage.setItem("id_list", id_list);
    localStorage.setItem("product_quantity", editProducts.length);
    navigate("/profile/market");
  };

  //Handle Edit functions

  const handleEditList = () => {
    setIsEditing(true);
  };

  const handleListNameChange = (e) => {
    setListName(e.target.value.trim());
  };

  const handleProductNameChange = (e) => {
    setSearchName(e.target.value.trim());
  };

  const handleProductFocus = () => {
    setFocus(true);
  };

  const handleProductBlur = () => {
    setFocus(false);
  };

  const handleAddProduct = (newProduct) => {
    const newProductObject = {
      id: newProduct._id,
      name: newProduct.name_product,
    };

    const productExists = editProducts.some(
      (product) => product.id === newProduct._id
    );

    if (productExists) {
      setAlert(true);
      setSearchName("");
      setTimeout(() => {
        setAlert(false);
      }, 5000);
      return;
    }

    setEditProducts((prevProducts) => [...prevProducts, newProductObject]);

    if (newProduct !== "") {
      setAlert(false);
    } else {
      setMatchingProducts([]);
      setSearchName("");
      setEditProducts(data.id_products);
    }
  };

  const handleDeleteProduct = (id) => {
    setEditProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id)
    );
  };

  //Handle Save and Cancel

  const handleSaveList = async () => {
    setIsEditing(false);
    UpdateList(id_list, listName, editProducts); //Actualiza nombre y productos
    props.updateList(); //Actualiza lista
  };

  const handleCancelList = () => {
    setIsEditing(false);
    setListName(data.name_list);
    setEditProducts(data.id_products);
    setMatchingProducts([]);
  };

  //Fetch functions

  const UpdateList = async (id, newNameList, products) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/list/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("Token"),
          "auth-token-refresh": localStorage.getItem("Refresh_Token"),
        },
        body: JSON.stringify({
          name_list: newNameList !== "" ? newNameList : undefined,
          id_products: products,
        }),
      });

      if (response.ok) {
        await response.json();
        props.setAlertGreen(true);
        props.setAlertRed(false);
      } else {
        props.setAlertGreen(false);
        props.setAlertRed(true);
        throw new Error("Error al actualizar la lista");
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
    setTimeout(() => {
      props.setAlertGreen(false);
      props.setAlertRed(false);
    }, 5000);
  };

  const searchMatchingProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/products/${searchName}`,
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
      const reducedData = data.map((product) => {
        return {
          _id: product._id,
          name_product: product.name_product,
        };
      });

      setMatchingProducts(reducedData.slice(0, 5));
    } catch (error) {
      console.log("Error searching for products:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (searchName !== "") {
      searchMatchingProducts();
    } else {
      setMatchingProducts([]);
    }
  }, [searchName]);

  useEffect(() => {
    if (editProducts !== undefined) {
      setEditProducts(editProducts);
    }
  }, [editProducts]);

  return (
    <>
      <div
        className={`${classes.editing} ${isEditing ? classes.isEditing : " "}`}
      >
        {props.isLoading ? (
          <Spinner />
        ) : props.error ? (
          <p>Lo sentimos, algo salió mal... ¡Inténtalo de nuevo!</p>
        ) : props.length === 0 ? (
          <p>Aún no tienes ninguna lista. ¡Agrega una!</p>
        ) : (
          <>
            <div className={classes["list-header"]}>
              {isEditing ? (
                <input
                  type="text"
                  placeholder={data.name_list}
                  onChange={handleListNameChange}
                />
              ) : (
                <h3>{data.name_list}</h3>
              )}
              <span>{data.status}</span>
            </div>
            <div className={classes["list-body"]}>
              <div className={classes["list-body-header"]}>
                <p>Productos:</p>
                <p>{new Date(data.createdAt).toLocaleDateString()}</p>
              </div>
              {isEditing && (
                <>
                  <div className={classes.search}>
                    <input
                      type="text"
                      placeholder="Añade un producto"
                      value={alert ? "" : searchName}
                      onChange={handleProductNameChange}
                      onFocus={handleProductFocus}
                      onBlur={handleProductBlur}
                    />

                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </div>
                  {matchingProducts.length > 0 && (
                    <div className={classes["search-products"]}>
                      <ul>
                        {matchingProducts.map((product) => {
                          return (
                            <li
                              key={product._id}
                              onClick={handleAddProduct.bind(this, product)}
                            >
                              {product.name_product}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                  {alert && (
                    <div className={classes.alert}>
                      <Alert text="El producto ya está incluido en la lista." />
                    </div>
                  )}
                </>
              )}
              <div className={classes["list-body-products"]}>
                <ul>
                  {isEditing ? (
                    isLoading ? (
                      <Spinner />
                    ) : (
                      <>
                        {editProducts && editProducts.length
                          ? editProducts.map((product) => (
                              <li key={product.id} className={classes.trash}>
                                <span> {product.name} </span>

                                <FontAwesomeIcon
                                  icon={faTrash}
                                  onClick={handleDeleteProduct.bind(
                                    this,
                                    product.id
                                  )}
                                />
                              </li>
                            ))
                          : null}
                      </>
                    )
                  ) : (
                    <>
                      {data.id_products.map((product) => {
                        return <li key={product.id}> {product.name} </li>;
                      })}
                    </>
                  )}
                </ul>
              </div>
              <div className={classes["list-body-footer"]}>
                {editProducts && editProducts.length ? (
                  editProducts.length === 1 ? (
                    <p>Total: {editProducts.length} producto</p>
                  ) : (
                    <p>Total: {editProducts.length} productos</p>
                  )
                ) : (
                  <p>¡Añade un producto a tu lista!</p>
                )}
                {data.updatedAt !== data.createdAt ? (
                  <p>
                    Actualizada el{" "}
                    {new Date(data.updatedAt).toLocaleDateString()}.
                  </p>
                ) : null}
              </div>
            </div>

            <div className={classes["list-footer"]}>
              {isEditing && (
                <div className={classes["list-footer-editing"]}>
                  <button onClick={handleSaveList}>Guardar</button>
                  <button onClick={handleCancelList}>Cancelar</button>
                </div>
              )}
              <div
                className={
                  isEditing
                    ? classes["no-editing"]
                    : classes["list-footer-status"]
                }
              >
                <button onClick={handleEditList}>
                  Editar lista <FontAwesomeIcon icon={faPenToSquare} />
                </button>
                <button onClick={handleNavigate}>
                  Elegir supermercado{" "}
                  <FontAwesomeIcon icon={faBasketShopping} />
                </button>
              </div>
              <div className={classes["list-footer-delete"]}>
                <DeleteButton data={data} />
              </div>
            </div>
          </>
        )}
        {props.alertGreen}
        {props.alertRed}
      </div>
    </>
  );
};

export default Editing;
