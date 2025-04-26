export default function TempoMedioFechamentoCard() {
    const tempoMedio = "2 dias 6h";
  
    return (
      <div className="bg-white p-4 rounded-2xl shadow text-center">
        <h2 className="text-lg font-semibold mb-2">Tempo Médio de Fechamento</h2>
        <p className="text-3xl font-bold text-blue-600">{tempoMedio}</p>
      </div>
    );
  }
  