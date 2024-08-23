import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classes from "./search.module.css";

Search.defaultProps = {
  searchRoute: "/search/",
  defaultRoute: "/",
  placeholder: "Search Food!",
  imgSrc: "./image.png",
};

export default function Search({
  searchRoute,
  defaultRoute,
  margin,
  placeholder,
  imgSrc,
}) {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();
  const { searchTerm } = useParams();

  useEffect(() => {
    setTerm(searchTerm ?? "");
  }, [searchTerm]);

  useEffect(() => {
    const handleNavigation = () => {
      if (term) {
        navigate(searchRoute + term);
      } else {
        navigate(defaultRoute);
      }
    };

    handleNavigation();
  }, [term, navigate, searchRoute, defaultRoute]);

  return (
    <div className={classes.container} style={{ margin }}>
      {imgSrc && (
        <div className={classes.imagebg}>
          <img src={imgSrc} alt="Search Icon" className={classes.searchImage} />
        </div>
      )}
      <div className={classes.searchInputContainer}>
        <input
          type="text"
          placeholder={placeholder}
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
      </div>
    </div>
  );
}
