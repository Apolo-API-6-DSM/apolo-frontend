"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const EmocaoPorDiaChart = () => {
  // Sample data based on your JSON
  const data = [
    {
      data: "09/02",
      positivo: 40,
      neutro: 60,
      negativo: 30
    },
    // In a real app, you would map through the full array of data
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="mb-2">
        <h3 className="text-base font-bold text-gray-800">Emoções Por Dia</h3>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
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
            <Bar dataKey="positivo" fill="#4CAF50" name="Positivo" />
            <Bar dataKey="neutro" fill="#2196F3" name="Neutro" />
            <Bar dataKey="negativo" fill="#F44336" name="Negativo" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EmocaoPorDiaChart;