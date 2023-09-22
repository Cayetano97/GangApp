import classes from "./Finished.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperclip,
  faBasketShopping,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons";
import CameraUploader from "../../../NewList/CameraUploader/CameraUploader";
import DeleteButton from "../../DeleteButton/DeleteButton";
import Spinner from "../../../../Spinner/Spinner";
import Alert from "../../../../Alert/Alert";

const Finished = (props) => {
  //UseStates
  const [patchTicket, setPatchTicket] = useState([]);
  const [addTicket, setAddTicket] = useState(false);
  const [checkbox, setCheckbox] = useState(false);
  const id_list = window.location.pathname.split("/")[3];

  //Const declarations
  const data = props.data;
  const navigate = useNavigate();

  //Handle checkbox change

  const handleCheckboxChange = (id) => {
    const checkedProducts = data.id_products.map((product) => {
      if (product.id === id) {
        product.addedToCart = !product.addedToCart;
      }
      setCheckbox(!checkbox);
      return product;
    });

    localStorage.setItem(
      `checked-products-${id_list}`,
      JSON.stringify(checkedProducts)
    );
  };

  const handleAddTicket = () => {
    setAddTicket(!addTicket);
  };

  const handleImageUpload = () => {
    patchList();
    props.updateList();
  };

  const handleNavigateMarket = () => {
    navigate(`/profile/market`);
  };

  //Fetch functions

  const patchList = async () => {
    try {
      const response = await fetch(`http://localhost:8000/list/${data._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("Token"),
          "auth-token-refresh": localStorage.getItem("Refresh_Token"),
        },
        body: JSON.stringify({
          status: "Finalizada",
        }),
      });

      if (response.ok) {
        await response.json();
        setPatchTicket(patchTicket);
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //UseEffect

  useEffect(() => {
    const checkedProducts = JSON.parse(
      localStorage.getItem(`checked-products-${id_list}`) || "[]"
    );

    const singleCheckedProduct = checkedProducts.map(
      (product) =>
        checkedProducts.some(
          (checkedProduct) =>
            checkedProduct.id === product.id && checkedProduct.addedToCart
        )
      // product.addedToCart === true ? true : false
    );

    setCheckbox(singleCheckedProduct);
  }, []);

  return (
    <>
      <div className={classes.purchased}>
        {props.isLoading ? (
          <Spinner />
        ) : props.error ? (
          <Alert text="Lo sentimos, algo salió mal... ¡Inténtalo de nuevo!" />
        ) : props.length === 0 ? (
          <p>Aún no tienes ninguna lista. ¡Agrega una!</p>
        ) : (
          <>
            <div className={classes["list-header"]}>
              <h3>{data.name_list}</h3>
              <span>{data.status}</span>
            </div>
            <div className={classes["list-body"]}>
              <div className={classes["list-body-header"]}>
                <p>Productos:</p>
                <p>{new Date(data.createdAt).toLocaleDateString()}</p>
              </div>
              <div className={classes["list-body-products"]}>
                {data.id_products.map((product, index) => {
                  return (
                    <div
                      className={classes["single-product"]}
                      key={product.index}
                    >
                      <input
                        type="checkbox"
                        checked={
                          checkbox[index] === true
                            ? true
                            : product.addedToCart === true
                            ? product.addedToCart
                            : false
                        }
                        onChange={() => handleCheckboxChange(product.id)}
                      />
                      <span>{product.name}</span>
                    </div>
                  );
                })}
              </div>
              <div className={classes["list-body-footer"]}>
                {data.id_products.length === 1 ? (
                  <p>Total: {data.id_products.length} producto</p>
                ) : (
                  <p>Total: {data.id_products.length} productos</p>
                )}
              </div>
            </div>

            <div className={classes["list-footer"]}>
              <div className={classes["change-market"]}>
                <div className={classes.market}>
                  <FontAwesomeIcon icon={faBasketShopping} />
                  <span>{data.supermarkets}</span>
                </div>
                <div className={classes.change}>
                  <button onClick={handleNavigateMarket}>
                    Cambiar supermercado
                  </button>
                </div>
              </div>
              <div className={classes.market}>
                <FontAwesomeIcon icon={faDollarSign} />
                <span>Total estimado: {data.price} €</span>
              </div>

              <div className={classes.buttons}>
                <button onClick={handleAddTicket}>
                  Añadir ticket
                  <FontAwesomeIcon icon={faPaperclip} />
                </button>
                <DeleteButton data={data} />
              </div>
            </div>
          </>
        )}
      </div>
      {addTicket ? (
        <CameraUploader
          title="Añade el ticket de tu compra"
          handleImageUpload={handleImageUpload}
        />
      ) : null}
    </>
  );
};

export default Finished;
