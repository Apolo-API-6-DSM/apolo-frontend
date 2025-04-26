"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const ChamadoPorDiaChart = () => {
  const data = [
    {
      data: "09/02",
      abertos: 20,
      fechados: 30
    },
    // In a real app, you would map through the full array of data
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="mb-2">
        <h3 className="text-base font-bold text-gray-800">Chamados Por Dia</h3>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="abertos" fill="#8884d8" name="Abertos" />
            <Bar dataKey="fechados" fill="#82ca9d" name="Fechados" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChamadoPorDiaChart;