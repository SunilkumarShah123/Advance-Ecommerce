import Home from './Pages/Home'
import AdminLogin from './Pages/AdminLogin'
import AdminDashboard from './Pages/AdminDashboard'
import AddCategory from './Pages/AddCategory'
import { Routes, Route } from 'react-router-dom'
import ManageCategory from './Pages/ManageCategory'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/add-category" element={<AddCategory />} />
      <Route path="/manage-category" element={<ManageCategory />} />
    </Routes>
  )
}

export default App