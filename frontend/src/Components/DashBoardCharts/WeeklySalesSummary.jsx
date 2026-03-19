import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const WeeklySalesSummary = () => {
  const [salesData, setSalesData] = useState([]);
  useEffect(() => {
    try {
      fetch("http://localhost:8000/api/weekly-sales-summary")
        .then((res) => res.json())
        .then((data) => setSalesData(data))
        .catch((error) => {
          toast.error(error);
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <div className="card p-3 shadow">
      <h5 className="pb-2 text-primary text-center">Wy Sales</h5>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="sales" fill="green" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklySalesSummary;
