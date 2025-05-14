import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useDebouncedValue } from './hooks/useDebounce'

function App() {
  const [count, setCount] = useState(0)
  const curCount = useDebouncedValue(count, 300)

  const clickBtn = () => {
    setCount(count+1);
    console.log(count, '点击')
  }

  return (
    <>
      <div>
        <button onClick={clickBtn}>点击</button>
        {curCount}
      </div>
    </>
  )
}

export default App
