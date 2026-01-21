import { useState } from 'react'
import './App.css'
import Customize from './components/mockup'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Customize></Customize>
    </>
  )
}

export default App
