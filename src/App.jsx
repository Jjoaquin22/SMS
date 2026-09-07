import Login from "./pages/Login"
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom"
import Register from "./pages/Register"

function App() {


  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/Login" replace />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
