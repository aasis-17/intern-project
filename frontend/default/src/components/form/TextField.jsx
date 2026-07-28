import  { forwardRef } from 'react'
import { v4 as uuidv4 } from 'uuid'

const TextField = ({label, labelClassName,placeholder, className,inputClassName, required, ...props}, ref) => {
  const key = uuidv4()
  return (
    <div className={`${className} mb-2`}>
        { label && 
            <label htmlFor={key} className={`${labelClassName}`}>
                {label}{required && <span className='text-red-500'>*</span>}
            </label> }

        <textarea  
            id={key} 
            className=" w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder={placeholder}
            required={required}
            {...props}
            ref={ref}
             />
    </div>
  )
}

export default forwardRef(TextField)