import { useEffect, useState } from 'react';

export function useOnClickOutside(ref, handler) {
 useEffect(() => {
   const listener = (event) => {
     if (!ref.current || ref.current.contains(event.target)) {
       return;
     }
     handler();
   };
   document.addEventListener('mousedown', listener);
   document.addEventListener('touchstart', listener);
   return () => {
     document.removeEventListener('mousedown', listener);
     document.removeEventListener('touchstart', listener);
   };
 }, [ref, handler])}

 export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {

      clearTimeout(timer);
    };
  }, [value, delay]);
  return debouncedValue;
 }