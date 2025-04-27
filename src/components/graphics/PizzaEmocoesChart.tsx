import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const data = [
  { name: "Positivo", value: 20 },
  { name: "Neutro", value: 70 },
  { name: "Negativo", value: 10 },
];

const COLORS = ["#22c55e", "#facc15", "#ef4444"];

export default function PizzaEmocoesChart() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow duration-150 flex flex-col gap-2" >
      <h2 className="text-xl dark:text-white font-bold mb-4 text-center">Emoções - %</h2>
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
