"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

type ChartDataProps = {
  data: { name: string; value: number }[];
};

const COLORS = {
  positivo: "#10B981", // Verde
  neutro: "#3B82F6",   // Azul
  negativo: "#EF4444", // Vermelho
};

export default function PieChartOne({ data }: ChartDataProps) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            innerRadius={60}
            paddingAngle={5}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.name.toLowerCase() === "positivo"
                    ? COLORS.positivo
                    : entry.name.toLowerCase() === "neutro"
                    ? COLORS.neutro
                    : COLORS.negativo
                }
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
