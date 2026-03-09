import Home from './Pages/Home'
import AdminLogin from './Pages/AdminLogin'
import AdminDashboard from './Pages/AdminDashboard'
import AddCategory from './Pages/AddCategory'
import { Routes, Route } from 'react-router-dom'
import ManageCategory from './Pages/ManageCategory'
import AddFood from './Pages/AddFood'
import ManageFood from './Pages/ManageFood'
import SearchPage from './Pages/SearchPage'
import Register from './Components/Register'
import Login from './Components/Login'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/add-category" element={<AddCategory />} />
      <Route path="/manage-category" element={<ManageCategory />} />
      <Route path="/add-food-item" element={<AddFood />} />
      <Route path="/manage-food-item" element={<ManageFood />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      
    </Routes>
  )
}

export default App