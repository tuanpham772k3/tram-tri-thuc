import React from "react";
import PropTypes from "prop-types";

const ErrorMessage = ({ message }) => {
    return (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
            <p className="text-red-600 dark:text-red-300">{message}</p>
        </div>
    );
};

ErrorMessage.propTypes = {
    message: PropTypes.string.isRequired,
};

export default ErrorMessage;
