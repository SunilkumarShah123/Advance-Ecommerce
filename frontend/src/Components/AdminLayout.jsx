import React from 'react'
import '../Css/admin.css'
import { useState,useEffect } from 'react'
import AdminSideBar from './AdminSideBar'
import AdminHeader from './AdminHeader'

const AdminLayout = ({children}) => {
    const [openSideBar,setOpenSideBar]=useState(true)

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
    },[])

    const toggleSideBar=()=>{
      setOpenSideBar((prev)=>!prev)
    }
    
  return (
    <>
    <div className='d-flex'> 
    {openSideBar&&<AdminSideBar/>}
    <div id='page-content-wrapper' className={`w-100 ${openSideBar?'with-size':'with-resize'}`}>
            <AdminHeader toggleSideBar={toggleSideBar} openSideBar={openSideBar} />
        <div className='container-fluid mt-4'>
            {children}
        </div>
    </div>
    </div>
    </>
  )
}

export default AdminLayout