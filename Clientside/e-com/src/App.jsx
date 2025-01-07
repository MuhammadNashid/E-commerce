import { useState } from 'react'
import React,{BrowserRouter,Routes,Route} from 'react-router-dom'
import Nav from './components/Nav'
import Login from './components/Login'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
    <Nav/>
    <Routes>
      <Route path="/login" element={<Login/>}></Route>
    </Routes>
    </BrowserRouter>
     
   
    </>
  )
}

export default App
