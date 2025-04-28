export default function ChamadasAbertasCard() {
  const chamadasAbertas = 28;

  return (
    <div className="bg-white dark:bg-gray-800 text-center rounded-md p-3 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow duration-150 flex flex-col gap-2" >
      <h2 className="text-lg dark:text-white font-semibold mb-2">Chamadas Abertas</h2>
      <p className="text-3xl font-bold text-red-500">{chamadasAbertas}</p>
    </div>
  );
}
