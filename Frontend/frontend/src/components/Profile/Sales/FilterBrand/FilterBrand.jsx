import classes from "./FilterBrand.module.css";
import { useState, useEffect } from "react";

const FilterBrand = ({ handleBrandChange }) => {
  const [allBrands, setAllBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUniqueBrands = async () => {
    try {
      const response = await fetch("http://localhost:8000/salesunique/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("Token"),
          "auth-token-refresh": localStorage.getItem("Refresh_Token"),
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAllBrands(["Todas", ...data.data]);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUniqueBrands();
  }, []);

  return (
    <div className={classes.containerFilter}>
      <div className={classes.filterHeader}>
        <p>Filtra por marca:</p>
      </div>
      <div className={classes.select}>
        {isLoading ? (
          <p>Cargando...</p>
        ) : allBrands && allBrands.length !== 0 ? (
          <select onChange={(e) => handleBrandChange(e.target.value)}>
            {allBrands &&
              allBrands.length !== 0 &&
              allBrands.map((brand, index) => (
                <option key={index} value={brand}>
                  {brand}
                </option>
              ))}
          </select>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default FilterBrand;
