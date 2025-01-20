import React from 'react'
import PropTypes from "prop-types"

const FormField = ({
    label,
    type="text",
    className="",
    labelClassName,
    placeholder="",
    onChange,
    name="input",
    value,
    required="false",
    error="",
    ...rest


}) => {
  return (
    <div>
        {label && 
        <label htmlFor={name} className={`${labelClassName}`}>
            {label}
            {required && <div className='text-red-500 text-sm'>*</div>} 
        </label> }

        <input 
            id={name} 
            type={type} 
            className={`${className}`} 
            placeholder={placeholder}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            {...rest}  
        />

        {error && <div>{error}</div>}
    </div>
  )
}

FormField.propTypes = {
    type : PropTypes.string.isRequired,
    label : PropTypes.string,
    placeholder : PropTypes.string.isRequired,
    onChange : PropTypes.func.isRequired,
    name : PropTypes.string.isRequired,
    value : PropTypes.string.isRequired,
    required : PropTypes.bool,
    error : PropTypes.string
} 

export default FormField