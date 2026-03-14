import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AdminLayout from '../Components/AdminLayout'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const EditFood = () => {

  const { id } = useParams()
  const navigate = useNavigate()
  const adminUser = localStorage.getItem("adminUser")

  const [categoryList, setCategoryList] = useState([])
  const [imagePreview, setImagePreview] = useState(null)

  const [formData, setFormData] = useState({
    category:'',
    item_name:'',
    item_price:'',
    item_description:'',
    image:null,
    item_quantity:'',
    is_available:false
  })


  // fetch categories
  useEffect(() => {

    fetch("http://localhost:8000/api/get-categories/")
      .then((res) => res.json())
      .then((data) => {
        setCategoryList(data)
      })
      .catch((e) => {
        console.error("Error fetching categories:", e)
      })

  }, [])


  // fetch food item data
  useEffect(() => {

    if(!adminUser){
      navigate("/admin-login")
      return
    }

    fetch(`http://localhost:8000/api/manipulate-food/${id}/`)
      .then((res) => res.json())
      .then((data) => {

        setFormData({
          category: data.category,
          item_name: data.item_name,
          item_price: data.item_price,
          item_description: data.item_description,
          item_quantity: data.item_quantity,
          image:null,
          is_available:data.is_available
        })

        setImagePreview(`http://localhost:8000${data.image}`)

      })
      .catch((err)=>{
        console.error("Error fetching food item:", err)
      })

  }, [id, adminUser, navigate])


  const handleChange = (e) => {

    const { name, value, type, checked } = e.target

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    })

  }


  const handleImage = (e) => {

    const file = e.target.files[0]

    setFormData({
      ...formData,
      image:file
    })

    if(file){
      setImagePreview(URL.createObjectURL(file))
    }

  }


  const handleForm = async (e) => {

    e.preventDefault()

    const formDataToSend = new FormData()

    formDataToSend.append("category", formData.category)
    formDataToSend.append("item_name", formData.item_name)
    formDataToSend.append("item_price", formData.item_price)
    formDataToSend.append("item_quantity", formData.item_quantity)
    formDataToSend.append("item_description", formData.item_description)
    formDataToSend.append("is_available", formData.is_available)

    if(formData.image){
      formDataToSend.append("image", formData.image)
    }

    try{

      const res = await fetch(`http://localhost:8000/api/manipulate-food/${id}/`,{
        method:"PUT",
        body:formDataToSend
      })

      const data = await res.json()

      if(res.ok){

        toast.success("Food item updated successfully")

        setTimeout(()=>{
          navigate("/manage-food-item")
        },1500)

      }else{
        toast.error(data.error || "Update failed")
      }

    }catch(error){
      console.error("Error:",error)
      toast.error("Server error")
    }

  }


  return (
    <>
    <AdminLayout>

      <div className="p-4 text-center text-success shadow-sm rounded">
        <h4>
          <i className="fas fa-edit me-3"></i>
          Edit Food Item
        </h4>
      </div>

      <form onSubmit={handleForm} encType='multipart/form-data'>

        <label className='form-label mt-3'>Select Category</label>
        <select
          className='form-select'
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="">Select Category</option>

          {categoryList.map((cate)=>(
            <option key={cate.id} value={cate.id}>
              {cate.category_name}
            </option>
          ))}
        </select>


        <label className='form-label mt-3'>Food Item Name</label>
        <input
          type="text"
          name="item_name"
          value={formData.item_name}
          onChange={handleChange}
          className='form-control'
        />


        <label className='form-label mt-3'>Food Item Description</label>
        <textarea
          name="item_description"
          value={formData.item_description}
          onChange={handleChange}
          className='form-control'
        />


        <label className='form-label mt-3'>Food Item Quantity</label>
        <input
          type="text"
          name="item_quantity"
          value={formData.item_quantity}
          onChange={handleChange}
          className='form-control'
        />


        <label className='form-label mt-3'>Food Item Price</label>
        <input
          type="number"
          name="item_price"
          step="0.01"
          value={formData.item_price}
          onChange={handleChange}
          className='form-control'
        />


        <label className='form-label mt-3'>Food Image</label>

        {imagePreview && (
          <div className="text-center mt-2 mb-2">
            <img
              src={imagePreview}
              alt="Food"
              style={{
                width:"120px",
                height:"120px",
                borderRadius:"50%",
                objectFit:"cover",
                border:"3px solid #28a745"
              }}
            />
          </div>
        )}

        <input
          type="file"
          name="image"
          accept="image/*"
          className='form-control'
          onChange={handleImage}
        />


        <div className="form-check mt-3">
          <input
            type="checkbox"
            name="is_available"
            className="form-check-input"
            checked={formData.is_available}
            onChange={handleChange}
          />
          <label className="form-check-label">
            Available
          </label>
        </div>


        <div className="row mt-3">
          <div className="col-8 mx-auto">
            <button className='btn btn-success w-100'>
              Update Food
            </button>
          </div>
        </div>

      </form>

      <ToastContainer position="top-right" autoClose={2000} />

    </AdminLayout>
    </>
  )
}

export default EditFood