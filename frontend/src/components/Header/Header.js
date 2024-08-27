import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import styles from "./header.module.css"; // Updated CSS module

export default function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate(); // React Router hook for navigation

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest(`.${styles.userSection}`)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        {/* Branding */}
        <div className={styles.branding}>
          <Link to="/" className={styles.logo}>
            KETI RESTAURANT
          </Link>
        </div>

        {/* Navigation */}
        <nav className={styles.navigation}>
          <Link to="/" className={styles.navLink}>
            Menu
          </Link>
          {/* <Link to="/about" className={styles.navLink}>
            About
          </Link>
          <Link to="/contact" className={styles.navLink}>
            Contact
          </Link>{" "}
           */}
          {user && (
            <Link to="/dashboard" className={styles.navLink}>
              Dashboard
            </Link>
          )}
        </nav>

        {/* User and Cart Actions */}
        <div className={styles.userActions}>
          {user ? (
            <div className={styles.userSection}>
              <button
                className={styles.userButton}
                onClick={toggleDropdown}
                aria-expanded={isDropdownOpen}
              >
                {user.name}
              </button>
              {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <button
                    className={styles.dropdownItem}
                    onClick={() => {
                      toggleDropdown();
                      logout();
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.userSection}>
              {/* Changed Login link to button for accessibility */}
              <button
                className={styles.userButton}
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </div>
          )}
          <div className={styles.cartSection}>
            <Link to="/cart" className={styles.cartLink}>
              Cart
              {cart.totalCount > 0 && (
                <span className={styles.cartCount}>{cart.totalCount}</span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
