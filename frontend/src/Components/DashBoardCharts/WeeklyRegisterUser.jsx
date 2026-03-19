import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const WeeklyRegisterUser = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    try {
      fetch("http://localhost:8000/api/weekly-registered-new-users")
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
      <h5 className="pb-2 text-primary text-center">Weekly Sales</h5>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="new_user" stroke="green" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
};

export default WeeklyRegisterUser;