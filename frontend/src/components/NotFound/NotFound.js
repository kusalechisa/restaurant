import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for prop validation
import { Link } from 'react-router-dom';
import classes from './notFound.module.css';

function NotFound({ message, linkRoute, linkText }) {
  return (
    <div className={classes.container}>
      <p>{message}</p> {/* Ensure message is wrapped in a paragraph for better styling */}
      <Link to={linkRoute} className={classes.link}>{linkText}</Link> {/* Add a class to style the link */}
    </div>
  );
}

// Define default props
NotFound.defaultProps = {
  message: 'Nothing Found!',
  linkRoute: '/',
};

// Define prop types
NotFound.propTypes = {
  message: PropTypes.string,
  linkRoute: PropTypes.string,
  linkText: PropTypes.string,
};

export default NotFound;
