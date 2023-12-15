import "./FilterMarket.css";
import { useState } from "react";

const FilterMarket = ({ onFilterChange, market }) => {
  const [filter, setFilter] = useState("");

  const handleFilterChange = (event) => {
    const selectedFilter = event.target.value;
    setFilter(selectedFilter);
    onFilterChange(selectedFilter, market);
  };

  return (
    <div className="checkboxFilter">
      <div className="checkboxText">
        <p>Filtra por supermercado</p>
      </div>
      <div className="checkbox">
        <label className="checkboxLabel">
          <input
            type="checkbox"
            value="mercadona"
            checked={filter === "mercadona"}
            onChange={handleFilterChange}
            className="checkboxInput"
          />
          Mercadona
        </label>
        <label className="checkboxLabel">
          <input
            type="checkbox"
            value="aldi"
            checked={filter === "aldi"}
            onChange={handleFilterChange}
            className="checkboxInput"
          />
          Aldi
        </label>
        <label className="checkboxLabel">
          <input
            type="checkbox"
            value="lidl"
            checked={filter === "lidl"}
            onChange={handleFilterChange}
            className="checkboxInput"
          />
          Lidl
        </label>
        <label className="checkboxLabel">
          <input
            type="checkbox"
            value="dia"
            checked={filter === "dia"}
            onChange={handleFilterChange}
            className="checkboxInput"
          />
          Dia
        </label>
        <label className="checkboxLabel">
          <input
            type="checkbox"
            value="todos"
            checked={filter === "todos"}
            onChange={handleFilterChange}
            className="checkboxInput"
          />
          Todos
        </label>
      </div>
    </div>
  );
};

export default FilterMarket;
