import { useState } from 'react';
import { useDebouncedValue } from './hooks/useDebounce'

function App() {
  const [value, setValue] = useState('');
  const [debounced] = useDebouncedValue(value, 200);

  return (
    <>
      <input
        label="Enter value to see debounce"
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
      />

      <span>Value: {value}</span>
      <span>Debounced value: {debounced}</span>
    </>
  );
}

export default App
