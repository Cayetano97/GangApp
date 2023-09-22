import classes from "./FilterMarket.module.css";
import { useState } from "react";

const FilterMarket = ({ onFilterChange, market }) => {
  const [filter, setFilter] = useState("");

  const handleFilterChange = (event) => {
    const selectedFilter = event.target.value;
    setFilter(selectedFilter);
    onFilterChange(selectedFilter, market);
  };

  return (
    <div className={classes.checkboxFilter}>
      <div className={classes.checkboxText}>
        <p>Filtra por supermercado</p>
      </div>
      <div className={classes.checkbox}>
        <label className={classes.checkboxLabel}>
          <input
            type="checkbox"
            value="mercadona"
            checked={filter === "mercadona"}
            onChange={handleFilterChange}
            className={classes.checkboxInput}
          />
          Mercadona
        </label>
        <label className={classes.checkboxLabel}>
          <input
            type="checkbox"
            value="aldi"
            checked={filter === "aldi"}
            onChange={handleFilterChange}
            className={classes.checkboxInput}
          />
          Aldi
        </label>
        <label className={classes.checkboxLabel}>
          <input
            type="checkbox"
            value="lidl"
            checked={filter === "lidl"}
            onChange={handleFilterChange}
            className={classes.checkboxInput}
          />
          Lidl
        </label>
        <label className={classes.checkboxLabel}>
          <input
            type="checkbox"
            value="dia"
            checked={filter === "dia"}
            onChange={handleFilterChange}
            className={classes.checkboxInput}
          />
          Dia
        </label>
        <label className={classes.checkboxLabel}>
          <input
            type="checkbox"
            value="todos"
            checked={filter === "todos"}
            onChange={handleFilterChange}
            className={classes.checkboxInput}
          />
          Todos
        </label>
      </div>
    </div>
  );
};

export default FilterMarket;
