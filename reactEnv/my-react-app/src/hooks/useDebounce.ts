
import { useState, useEffect } from 'react'

export const useDebouncedValue = <T>(value: T, delay: number):T[] => {
  const [delayVal, setDelayVal] = useState<T>(value);
  console.log('delay', delayVal)

  useEffect(()=>{
    const t = setTimeout(()=>{
      setDelayVal(value)
      console.log('定时', value);
    }, delay)
    console.log('delay-改', delayVal)
    return () => clearTimeout(t);
  }, [value, delay])

  return [delayVal];
}


