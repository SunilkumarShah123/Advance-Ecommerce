import React from 'react'
import '../Css/admin.css'
import { useState,useEffect } from 'react'
import AdminSideBar from './AdminSideBar'
import AdminHeader from './AdminHeader'

const AdminLayout = ({children}) => {
    const [openSideBar,setOpenSideBar]=useState(true)
    const [newOrderCount,setNewOrderCount]=useState(0)

    useEffect(()=>{
       const handleReSize=()=>{
        if (window.innerWidth < 768){
            setOpenSideBar(false)
        }else{
          setOpenSideBar(true)
        }
       }
       handleReSize()

       window.addEventListener("resize",handleReSize)
       fetch("http://localhost:8000/api/not-confirmed-orders").then( res => res.json()).then(data => setNewOrderCount(data.length)).catch( error => console.log(error))
    },[])

    const toggleSideBar=()=>{
      setOpenSideBar((prev)=>!prev)
    }
    
  return (
    <>
    <div className='d-flex'> 
    {openSideBar&&<AdminSideBar/>}
    <div id='page-content-wrapper' className={`w-100 ${openSideBar?'with-size':'with-resize'}`}>
            <AdminHeader toggleSideBar={toggleSideBar} openSideBar={openSideBar} newOrder={newOrderCount} />
        <div className='container-fluid mt-4'>
            {children}
        </div>
    </div>
    </div>
    </>
  )
}

export default AdminLayout