import React, { useState } from 'react'
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../Css/admin.css'
import PublicLayout from '../Components/PublicLayout'
const AdminLogin = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('http://localhost:8000/api/admin-login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      })

      if (response.ok) {
        toast.success('Login successful')
        localStorage.setItem('adminUser',username)
        setTimeout(() => {
          window.location.href = '/admin-dashboard'
        }, 2000)

      } else {
        toast.error('Invalid username or password')
      }

    } catch (error) {
      toast.error('Server error')
    }
  }

  return (
    <>
    <PublicLayout>
    <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{ backgroundImage: "url('/images/background.webp')" }}
      >
        <div className="card p-4 shadow-lg" style={{ width: '350px' }}>
          
          <h4 className="text-center mb-3 d-flex align-items-center justify-content-center gap-2">
            <FaUser /> Admin Login
          </h4>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="exampleInputUserName" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="exampleInputUserName"
                placeholder="Enter Your Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="exampleCheck1"
              />
              <label className="form-check-label" htmlFor="exampleCheck1">
                Remember me
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              <FaSignInAlt className="me-2" />
              Login
            </button>
          </form>
        </div>
      </div>

      <ToastContainer className="text-center" autoClose={2000} />
    </PublicLayout>

    </>
  )
}

export default AdminLogin