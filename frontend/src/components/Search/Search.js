import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classes from "./search.module.css";

Search.defaultProps = {
  searchRoute: "/search/",
  defaultRoute: "/",
  placeholder: "Search Food!",
};

export default function Search({
  searchRoute,
  defaultRoute,
  margin,
  placeholder,
}) {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();
  const { searchTerm } = useParams();

  useEffect(() => {
    setTerm(searchTerm ?? "");
  }, [searchTerm]);

  const search = () => {
    term ? navigate(searchRoute + term) : navigate(defaultRoute);
  };

  const clearSearch = () => {
    setTerm(""); // Clear the input field
    navigate(defaultRoute); // Refresh the data to the default route
  };

  return (
    <div className={classes.container} style={{ margin }}>
      <div className={classes.inputWrapper}>
        <input
          type="text"
          placeholder={placeholder}
          onChange={(e) => setTerm(e.target.value)}
          onKeyUp={(e) => e.key === "Enter" && search()}
          value={term}
        />
        {term && (
          <button onClick={clearSearch} className={classes.clearButton}>
            &times;
          </button>
        )}
      </div>
      <button onClick={search} className={classes.searchButton}>
        Search
      </button>
    </div>
  );
}
