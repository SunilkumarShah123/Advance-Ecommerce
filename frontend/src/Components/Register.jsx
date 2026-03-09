import React from 'react'
import PublicLayout from './PublicLayout'
import { useState } from "react"
import { useNavigate, Link } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FaSignInAlt } from 'react-icons/fa'

const Register = () => {

  const navigate = useNavigate()

  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    confirm_password: "",
  })

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (userData.password !== userData.confirm_password) {
      toast.error("Password and Confirm Password must be same")
      return
    }

    try {

      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone,
          email: userData.email,
          password: userData.password,
        })
      })

      const data = await response.json()

      if (response.ok) {

        toast.success(`${userData.first_name} registered successfully`)

        setUserData({
          first_name: "",
          last_name: "",
          phone: "",
          email: "",
          password: "",
          confirm_password: ""
        })

        setTimeout(() => {
          navigate("/login")
        }, 2000)

      } else {
        toast.error(data.error || "Registration failed")
      }

    } catch (error) {
      toast.error("Server error. Please try again.")
    }
  }

  return (
    <>
      <PublicLayout>

        <ToastContainer position="top-center" autoClose={2000} />

        <div className='container my-4'>
          <div className="row shadow-lg rounded-4 p-4">

            <div className="col-md-12">

              <h2 className='text-primary text-center mb-4'>Register</h2>

              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name='first_name'
                    placeholder="Enter Your First Name"
                    value={userData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name='last_name'
                    placeholder="Enter Your Last Name"
                    value={userData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    name='phone'
                    placeholder="Enter Your Phone Number"
                    value={userData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name='email'
                    placeholder="Enter Your Email"
                    value={userData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name='password'
                    placeholder="Enter Your Password"
                    value={userData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name='confirm_password'
                    placeholder="Confirm Password"
                    value={userData.confirm_password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className='d-flex align-items-center gap-3'>

                  <button type="submit" className="btn btn-md btn-primary">
                    <FaSignInAlt className="me-2" />
                    Register
                  </button>

                  <h6 className='text-muted mb-0 ms-auto'>
                    Already Registered User?
                  </h6>

                  <Link to="/login" className='btn btn-warning'>
                    Login
                  </Link>

                </div>

              </form>

            </div>

          </div>
        </div>

      </PublicLayout>
    </>
  )
}

export default Register