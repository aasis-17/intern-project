import  { forwardRef } from 'react'
import { v4 as uuidv4 } from 'uuid'

const TextField = ({label, labelClassName,placeholder, className, required, ...props}, ref) => {
  const key = uuidv4()
  return (
    <>
        { label && 
            <label htmlFor={key} className={`${labelClassName}`}>
                {label}{required && <span className='text-red-500'>*</span>}
            </label> }

        <textarea  
            id={key} 
            className={`${className}  px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600`}
            placeholder={placeholder}
            required={required}
            {...props}
            ref={ref}
             />
    </>
  )
}

export default forwardRef(TextField)