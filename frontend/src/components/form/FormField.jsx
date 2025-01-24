import React from 'react'
import PropTypes from "prop-types"
import { forwardRef } from 'react'


const FormField= ({
  label,
  type="text",
  className,
  labelClassName,
  required,
  defaultValue,
  ...props
},ref) =>
{
  
return (

  <>
    { label && <label className={`${labelClassName}`} htmlFor={label}>
      {label}
      {required && <span className='text-red-500'>*</span>}
      </label> }
      <input
          id={label}
          default={defaultValue}
          className={`outline-none ${className}`}
          type={type}
          required={required}
          {...props}
          ref={ref}
           />

  </>
)
}

// FormField.propTypes = {
//     type : PropTypes.string.isRequired,
//     label : PropTypes.string,
//     placeholder : PropTypes.string.isRequired,
//     onChange : PropTypes.func.isRequired,
//     name : PropTypes.string.isRequired,
//     value : PropTypes.string.isRequired,
//     required : PropTypes.bool,
//     error : PropTypes.string
// } 

export default forwardRef(FormField)