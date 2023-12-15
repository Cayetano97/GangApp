import "./SearchProducts.css";
import { useState, useEffect } from "react";
import Alert from "../../../Alert/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const SearchProducts = ({ handleEdit }) => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [results2, setResults2] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [alertDelete, setAlertDelete] = useState(false);
  const [idProduct, setIdProduct] = useState("");

  const handleSearch = async (product) => {
    try {
      const response = await fetch(
        `http://localhost:8000/productsfind/${product}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("Token"),
            "auth-token-refresh": localStorage.getItem("Refresh_Token"),
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setResults(data);
        setLoading(true);
        localStorage.setItem("Product_Id", data.data[0]._id);
        setIdProduct(data.data[0]._id);
      }
    } catch (error) {
      console.log("Error getting product", error);
      setError(true);
      handleResetError();
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8000/productdelete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("Token"),
            "auth-token-refresh": localStorage.getItem("Refresh_Token"),
          },
        }
      );
      if (response.ok) {
        console.log("Product deleted");
        localStorage.removeItem("Product_Id");
        setAlertDelete(true);
        handleResetError();
      }
    } catch (error) {
      console.log("Error deleting product", error);
    }
  };
  const handleResetError = () => {
    setResults([]);
    setTimeout(() => {
      setError(false);
      setAlertDelete(false);
    }, 5000);
  };

  const handleSelect = (name) => {
    setInput(name);
    handleSearch(name);
    setInput("");
  };

  useEffect(() => {
    const handleSearch2 = async (product) => {
      try {
        const response = await fetch(
          `http://localhost:8000/products/${product}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("Token"),
              "auth-token-refresh": localStorage.getItem("Refresh_Token"),
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setResults2(data);
          setLoading(true);
        }
      } catch (error) {
        console.log("Error getting product", error);
        setError(true);
        handleResetError();
      }
    };

    if (input !== "" && input !== 0) {
      handleSearch2(input);
    }
  }, [input]);

  return (
    <div className="mainsearch">
      <h2>Búsqueda de productos</h2>
      <input
        type="text"
        placeholder="Buscar productos"
        value={input}
        onChange={(e) =>
          setInput(
            e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
          )
        }
      />
      {input !== "" ? (
        <div className="resultsSearch">
          {loading && results2.data && results2.data.length > 0 ? (
            <>
              {results2.data.slice(0, 10).map((product) => (
                <div key={product.id} className="select">
                  <span>{product.name_product}</span>
                  <button onClick={() => handleSelect(product.name_product)}>
                    Seleccionar
                  </button>
                </div>
              ))}
            </>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}

      {error ? <Alert text="No se ha encontrado el producto." /> : ""}
      <div className="searchresults">
        {loading && results.data && results.data.length > 0 ? (
          <>
            <span>{results.data[0].name_product}</span>
            {results.data[0].url && (
              <a href={results.data[0].url} target="_blank" rel="noreferrer">
                {results.data[0].url}
              </a>
            )}
            <div className="marketcontainer">
              {results.data[0].market.map((market) => (
                <ul key={market.id_market}>
                  <li>
                    <strong>Supermercado: </strong> {market.name_market}
                  </li>
                  <li>
                    <strong>Precio: </strong>
                    {market.price}€
                  </li>
                  <li>
                    <strong>Fecha: </strong>
                    {new Date(market.date).toLocaleDateString()}
                  </li>
                </ul>
              ))}
            </div>
            <div className="buttons">
              <button onClick={() => handleDelete(idProduct)}>
                Eliminar producto
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <button onClick={handleEdit}>
                Editar
                <FontAwesomeIcon icon={faPenToSquare} />
              </button>
            </div>
          </>
        ) : (
          ""
        )}
        {alertDelete ? <Alert text="Producto eliminado correctamente" /> : ""}
      </div>
    </div>
  );
};

export default SearchProducts;
