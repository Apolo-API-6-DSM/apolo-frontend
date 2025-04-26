import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const data = [
  { name: "Positivo", value: 20 },
  { name: "Neutro", value: 70 },
  { name: "Negativo", value: 10 },
];

const COLORS = ["#22c55e", "#facc15", "#ef4444"];

export default function PizzaEmocoesChart() {
  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Emoções</h2>
      <div className="flex justify-center">
        <PieChart width={300} height={250}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend layout="horizontal" align="center" verticalAlign="bottom" />
        </PieChart>
      </div>
    </div>
  );
}
