import React from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../Components/AdminLayout'

const ManageCategory = () => {
  return (
    <>
    <AdminLayout>
        <div >
          <h2 className='text-center p-3 text-primary shadow-sm'><i className='fas fa-list-alt me-2'></i>Manage Category</h2>
        </div>
        <div>
            
            <div  >
            <input className='form-control w-50 mb-0' type="text" placeholder='Enter the category name' />
            <h5 className='text-end text-muted mb-2'><i className='fas fa-database me-2'></i>Total Categories
                <span className='badge bg-success ms-2 '>5</span>
            </h5>

            </div>
            <div>
            <table className='table table-bordered table-hover'>
                <thead className='table-dark'>
                <tr>
                    <th>S.No</th>
                    <th>Category Name</th>
                    <th>Creation Date</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Laptop</td>
                        <td>11/07/2025</td>
                        <td>
                            <Link className='btn btn-sm btn-primary me-2'>
                            <i className='fas fa-edit'></i>Edit
                            </Link>
                            <Link className='btn btn-sm btn-danger'>
                            <i className='fas fa-trash'></i>Delete
                            </Link>
                         
                        </td>
                    </tr>
                </tbody>
            </table>
            </div>
        </div>
    </AdminLayout>
    </>
  )
}

export default ManageCategory