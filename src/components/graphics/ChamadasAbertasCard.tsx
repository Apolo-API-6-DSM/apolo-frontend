export default function ChamadasAbertasCard() {
  const chamadasAbertas = 28;

  return (
    <div className="bg-white p-4 rounded-2xl shadow text-center">
      <h2 className="text-lg font-semibold mb-2">Chamadas Abertas</h2>
      <p className="text-3xl font-bold text-red-500">{chamadasAbertas}</p>
    </div>
  );
}
