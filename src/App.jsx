import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import 'bootstrap/dist/css/bootstrap.min.css'
import '../src/assets/styles/styles.css'


function App() {
  
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
      </Routes>
    </BrowserRouter>
    
  )
}

export default App
