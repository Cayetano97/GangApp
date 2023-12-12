import classes from "./Sales.module.css";
import CardSales from "./CardSales/CardSales";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import FilterBrand from "./FilterBrand/FilterBrand";

const Sales = () => {
  const [salesData, setSalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [filteredSalesData, setFilteredSalesData] = useState([]);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/profile");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8000/sales/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("Token"),
            "auth-token-refresh": localStorage.getItem("Refresh_Token"),
          },
        });
        if (response.ok) {
          const data = await response.json();
          setSalesData(data.data);
          setIsLoading(false);
        } else {
          throw new Error("Error al obtener los datos");
        }
      } catch (error) {
        console.error(error);
        setError(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand === "Todas" ? "" : brand);
  };

  useEffect(() => {
    if (salesData.length > 0) {
      const filteredData = salesData.filter(
        (sale) => selectedBrand === "" || sale.brand === selectedBrand
      );
      setFilteredSalesData(filteredData);
    }
  }, [selectedBrand, salesData]);

  return (
    <div className={classes.Sales}>
      <div className={classes.back} onClick={handleBack}>
        <FontAwesomeIcon icon={faArrowLeftLong} className={classes.arrow} />
        <span>Inicio</span>
      </div>
      <FilterBrand handleBrandChange={handleBrandChange} />
      <CardSales
        isLoading={isLoading}
        error={error}
        dataResponseSales={filteredSalesData}
        selectedBrand={selectedBrand}
      />
    </div>
  );
};

export default Sales;
