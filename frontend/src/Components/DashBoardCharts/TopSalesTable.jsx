import React,{useState,useEffect} from 'react'

export const TopSalesTable = () => {
    const [topFoods,setTopFoods]=useState([])
    useEffect(()=>{
      try{
        fetch("http://localhost:8000/api/top-sold-food-item").then( res => res.json()).then( data => setTopFoods(data)).catch(error => {
          toast.error(error)
          console.log(error)
         })
      }catch(error){
        console.log(error)
      
      }
       
   
    },[])
  return (
    <div className="card shadow p-2">
     <div className="card-header text-white bg-success text-center fw-bold">
        <i className='fas fa-star me-2' style={{}}></i>
          Top 5 Sold Food Item
     </div>

     <div className='card-body'>
         <table className='table table-border'>
           <thead>
            <th>S.N</th>
            <th>Food Item Name</th>
            <th>Item Qty Sold</th>
           </thead>
           <tbody>
            {topFoods.map((item,index)=>(
                <tr key={index}><td>{index+1}</td><td>{item.food__item_name}</td><td>{item.total_quantity}</td></tr>
            ))}
           </tbody>
         </table>
     </div>

    </div>
  )
}
