import React from 'react'
import PropTypes from "prop-types"
import { forwardRef } from 'react'
import { v4 as uuidv4 } from 'uuid';


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
  const key = uuidv4()
return (

  <>
    { label && <label className={`${labelClassName}`} htmlFor={key}>
      {label}
      {required && <span className='text-red-500'>*</span>}
      </label> }
      <input
          id={key}
          defaultValue={defaultValue}
          className={` ${className}  px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600`}
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