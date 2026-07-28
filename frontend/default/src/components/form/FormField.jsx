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

  <div className={`${className} mb-2`}>
    { label && <label className={`${labelClassName} block text-sm font-medium text-gray-600`} htmlFor={key}>
      {label}
      {required && <span className='text-red-500'>*</span>}
      </label> }
      <input
          id={key}
          defaultValue={defaultValue}
          className={`${type ==="checkbox" && "" || type === "file" && "hidden" || "px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 w-full"}  `}
          type={type}
          required={required}
          {...props}
          ref={ref}
           />
  </div>
)
}

export default forwardRef(FormField)