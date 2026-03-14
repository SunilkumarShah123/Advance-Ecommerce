import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AdminLayout from '../Components/AdminLayout'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const UpdateCategory = () => {

  const { id } = useParams()
  const navigate = useNavigate()
  const adminUser = localStorage.getItem("adminUser")

  const [category, setCategory] = useState('')

  // handle change
  const handleChange = (e) => {
    setCategory(e.target.value)
  }

  // fetch existing category
  useEffect(() => {

    if (!adminUser) {
      navigate("/admin-login")
      return
    }

    const fetchCategory = async () => {
      try {

        const response = await fetch(`http://localhost:8000/api/manipulate-category/${id}/`)

        if (response.ok) {
          const data = await response.json()
          setCategory(data.category_name)
        } else {
          toast.error("Failed to load category")
        }

      } catch (error) {
        console.error(error)
        toast.error("Server error")
      }
    }

    fetchCategory()

  }, [id, adminUser, navigate])


  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!category.trim()) {
      toast.error("Category name is required")
      return
    }

    try {

      const response = await fetch(`http://localhost:8000/api/manipulate-category/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          category_name: category
        })
      })

      if (response.ok) {
        toast.success("Category Updated Successfully")

        setTimeout(() => {
          navigate("/manage-category")
        }, 1500)

      } else {
        const data = await response.json()
        toast.error(data?.message || "Update failed")
      }

    } catch (error) {
      console.error(error)
      toast.error("Server error")
    }

  }

  return (
    <AdminLayout>
      <div className="row">
        <div className="col-md-12">

          <div className="p-4 text-center shadow-sm rounded">
            <h4>
              <i className="fas fa-edit me-3"></i>
              Update Category
            </h4>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control my-4"
                placeholder="Enter the Category Name"
                value={category}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-success w-100">
              <i className="fas fa-save me-3"></i>
              Update Category
            </button>
          </form>

        </div>
      </div>

      <ToastContainer position="top-center" autoClose={2000} />
    </AdminLayout>
  )
}

export default UpdateCategory