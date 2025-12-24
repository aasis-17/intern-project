import { useEffect, useState } from "react";

// useDebounce for debouncing function
export const useDebounce = (fn, delay) =>{
    let timeout;
    return (...args)=>{
        clearTimeout(timeout)
        timeout = setTimeout(()=>{
        fn(...args)
    },delay)
}
}

// useDebounce for debouncing state
//** In react we should always debounce value or state not function
// ** we should not debounce event handler, setState
// ** always debounce values not function */


export const useDebounceState = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

