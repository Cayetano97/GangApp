import classes from "./Products.module.css";
import { useState, useEffect } from "react";
import Spinner from "../../Spinner/Spinner";

const Products = () => {
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMarket, setSelectedMarket] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const response = await fetch(`http://localhost:8000/product`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("Token"),
            "auth-token-refresh": localStorage.getItem("Refresh_Token"),
          },
        });
        if (response.status !== 200) {
          console.log("Error getting all products");
        } else {
          const data = await response.json();
          console.log("All products ok");
          setAllProducts(data.data);
          setLoading(true);
        }
      } catch (error) {
        console.log("Error getting all products");
      }
    };

    getAllProducts();
  }, []);

  const filteredProducts = allProducts
    .filter(
      (product) =>
        product.name_product.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedMarket === "" ||
          product.market.some((item) => item.name_market === selectedMarket))
    )
    .sort((a, b) => {
      if (sortBy === "price") {
        const aPrice = Math.max(
          ...a.market.filter((item) => item.price).map((item) => item.price)
        );
        const bPrice = Math.max(
          ...b.market.filter((item) => item.price).map((item) => item.price)
        );
        return sortOrder === "asc" ? aPrice - bPrice : bPrice - aPrice;
      } else if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.name_product.localeCompare(b.name_product)
          : b.name_product.localeCompare(a.name_product);
      } else {
        return 0;
      }
    });

  const markets = [
    ...new Set(
      allProducts.flatMap((product) =>
        product.market.map((item) => item.name_market)
      )
    ),
  ];

  return (
    <div className={classes.MainProducts}>
      <h2>Productos</h2>
      <input
        type="text"
        placeholder="Buscar productos"
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(
            e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
          )
        }
      />
      <select
        value={selectedMarket}
        onChange={(e) => setSelectedMarket(e.target.value)}
      >
        <option value=""> - Todos los supermercados -</option>
        {markets.map((market) => (
          <option key={market} value={market} className={classes.optionmarket}>
            {market}
          </option>
        ))}
      </select>
      <div className={classes.checkboxes}>
        <label>
          Ordenar por:
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">- Elige una opción -</option>
            <option value="price">Precio</option>
            <option value="name">Nombre</option>
          </select>
        </label>
        {sortBy === "price" || sortBy === "name" ? (
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        ) : (
          ""
        )}
      </div>
      {loading ? (
        <div>
          <h3>Número de productos: {filteredProducts.length} </h3>
          <div className={classes.mapproducts}>
            {filteredProducts.map((product, index) => (
              <div key={index} className={classes.product}>
                <span>
                  <strong>Nombre</strong>
                </span>
                <span>{product.name_product}</span>
                <img
                  src={
                    product.url
                      ? product.url
                      : "https://raw.githubusercontent.com/Cayetano97/React/main/IMG/error.jpg"
                  }
                  alt={`${product.name_product}.JPG`}
                />
                <span>
                  <strong>Imagen_URL</strong>
                </span>
                <a href={product.url} target="_blank" rel="noreferrer">
                  {product.url}
                </a>
                <div className={classes.market}>
                  <h4> - Supermercados - </h4>
                  {product.market.map((item, index) => (
                    <div key={index}>
                      <span>
                        {item.name_market} {item.price && `- ${item.price} €`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default Products;
