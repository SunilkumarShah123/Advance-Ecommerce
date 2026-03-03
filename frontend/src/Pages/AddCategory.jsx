import { useState } from 'react'
import AdminLayout from '../Components/AdminLayout'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AddCategory = () => {
  const [category, setCategory] = useState('')

  const handleCategory = async (e) => {
    e.preventDefault()

    if (!category.trim()) {
      toast.error("Category name is required")
      return
    }

    try {
      const response = await fetch('http://localhost:8000/api/add-category/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          category_name: category
        })
      })

      if (response.ok) {
        toast.success('Category Added Successfully')
        setCategory('') // clear input
      } else {
        const data = await response.json()
        toast.error(data?.message || 'Please Input Valid Character')
      }

    } catch (error) {
      toast.error('Server error')
      console.error(error)
    }
  }

  return (
    <AdminLayout>
      <div className="row">
        <div className="col-md-12">
          <div className="p-4 text-center shadow-sm rounded">
            <h4>
              <i className="fas fa-plus-circle me-3"></i>
              Add Category
            </h4>
          
          </div>

          <form onSubmit={handleCategory}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control my-4"
                id="AddCategory"
                placeholder="Enter the Category Name"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              <i className="fas fa-plus-circle me-3"></i>
              Add Category
            </button>
          </form>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={2000} />
    </AdminLayout>
  )
}

export default AddCategory