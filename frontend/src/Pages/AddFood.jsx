import React, { useState, useEffect } from 'react'
import AdminLayout from '../Components/AdminLayout'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AddFood = () => {
    
    const [categoryList, setCategoryList] = useState([]);
    const [formData, setFormData] = useState({
      category:'',
      item_name:'',
      item_price:'',
      item_description:'',
      image:null,
      item_quantity:''
    });

    useEffect(() => {
      fetch("http://localhost:8000/api/get-categories/")
        .then((res) => res.json())
        .then((data) => {
          setCategoryList(data);
        })
        .catch((e) => {
          console.error("Error fetching categories:", e);
        });
    }, []);

    const handleChange = (e) => {
       setFormData({
        ...formData,
        [e.target.name]: e.target.value   
       })
    }

    const handleImage = (e) => {
      setFormData({
        ...formData,
        image: e.target.files[0]   
       })  
    }
     
    const handleForm = async (e) => {
      e.preventDefault();
    
      const formDataToSend = new FormData();
      formDataToSend.append("category", formData.category);
      formDataToSend.append("item_name", formData.item_name);
      formDataToSend.append("item_price", formData.item_price);
      formDataToSend.append("item_quantity", formData.item_quantity);
      formDataToSend.append("item_description", formData.item_description);
      formDataToSend.append("image", formData.image);
    
      try {
        const res = await fetch("http://localhost:8000/api/add-food-item/", {
          method: "POST",
          body: formDataToSend,   
        });
    
        const data = await res.json();
    
        if (res.ok) {
          toast.success(`${formData.item_name} added successfully`);
          console.log(data);
        } else {
          toast.error(data.error || "Error adding item");
        }
    
      } catch (error) {
        console.error("Error:", error);
      }
    };

  return (
    <>
    <AdminLayout>
        <div className="p-4 text-center text-primary shadow-sm rounded">
            <h4>
              <i className="fas fa-plus-circle me-3"></i>
              Add FoodItems
            </h4>
          </div>
          
          <div>
            <form onSubmit={handleForm} encType='multipart/form-data'> 
             
             <label className='form-label mt-3' htmlFor="selectCate">Select Category</label>
             <select 
               className='form-select' 
               name="category" 
               id="selectCate"
               value={formData.category}
               onChange={handleChange}
             >
                <option value="">Select Category</option> 
                {categoryList.map((cate) => (
                 <option key={cate.id} value={cate.id}>
                   {cate.category_name}
                 </option>
                ))}
             </select>

             <label className='form-label mt-3' htmlFor="foodItem">Food Item Name</label>
             <input 
               id='foodItem' 
               type="text" 
               name="item_name"  
               value={formData.item_name}  
               onChange={handleChange} 
               className='form-control' 
               placeholder='enter the name of the food Item ' 
             />

             <label className='form-label mt-3' htmlFor="foodDescription">Food Item Description</label>
             <textarea 
               id='foodDescription' 
               name="item_description"  
               value={formData.item_description} 
               onChange={handleChange}  
               className='form-control' 
               placeholder='Description about food item ' 
             />

             <label className='form-label mt-3' htmlFor="foodQuantity">Food Item Quantity</label>
             <input 
               id='foodQuantity' 
               type="text" 
               name="item_quantity"  
               value={formData.item_quantity} 
               className='form-control' 
               onChange={handleChange} 
               placeholder='Quantiy eg. 2 pieces /large' 
             />

             <label className='form-label mt-3' htmlFor="foodPrice">Food Item Price</label>
             <input 
               id='foodPrice'  
               name="item_price"   
               type="number" 
               value={formData.item_price} 
               step="0.01" 
               className='form-control' 
               onChange={handleChange} 
               placeholder='enter the price of the food Item ' 
             />

            <label className='form-label mt-3' htmlFor="foodImage">Food Image</label>
            <input 
              type="file"  
              name="image"   
              accept='image/*' 
              className='form-control'
              onChange={handleImage}  
            />

            <div className="row mt-3">
                <div className="col-8 mx-auto">
                <button className='btn btn-primary w-100'>Add</button>
                </div>
            </div>
            
            </form>
          </div>

          <ToastContainer position="top-right" autoClose={2000} />
    </AdminLayout>
    </>
  )
}

export default AddFood