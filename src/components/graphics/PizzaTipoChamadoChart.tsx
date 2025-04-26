import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const dataTipo = [
  { name: "Reclamação", value: 10 },
  { name: "Pedido de Suporte", value: 80 },
  { name: "Dúvida", value: 10 },
];

const COLORS_TIPO = ["#f87171", "#60a5fa", "#FFBF00"];

export function PizzaTipoChamadoChart() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow duration-150 flex flex-col gap-2" >
      <h2 className="text-xl dark:text-white font-bold mb-4 text-center">Tipo de Chamado - %</h2>
      <div className="flex justify-center">
        <PieChart width={300} height={250}>
          <Pie
            data={dataTipo}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
          >
            {dataTipo.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS_TIPO[index % COLORS_TIPO.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend layout="horizontal" align="center" verticalAlign="bottom" />
        </PieChart>
      </div>
    </div>
  );
}
