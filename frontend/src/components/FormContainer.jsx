import React from 'react';
import './Form.css';

const FormContainer = ({ children }) => {
    return (
        <div className="form-container">
            <div className="form-card">
                {children}
            </div>
        </div>
    );
};

export default FormContainer; 