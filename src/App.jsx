import Login from "./pages/Login"
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import PublicRoute from "./pages/PublicRoute"
import ManageStudents from "./pages/ManageStudents"

function App() {


  return (
    <>
    <Router>
     <Routes>
  <Route
    path="/"
    element={
      <PublicRoute>
        <Login />
      </PublicRoute>
    }
  />

  <Route
    path="/Register"
    element={
      <PublicRoute>
        <Register />
      </PublicRoute>
    }
  />

  <Route path="/Dashboard" element={<Dashboard />} />
  <Route path="/ManageStudents" element={<ManageStudents />} />
</Routes>
    </Router>
    </>
  )
}

export default App
