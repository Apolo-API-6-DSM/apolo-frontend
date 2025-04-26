export default function ResponsaveisAtivosCard() {
    const ativos = 8;
  
    return (
      <div className="bg-white p-4 rounded-2xl shadow text-center">
        <h2 className="text-lg font-semibold mb-2">Responsáveis Ativos</h2>
        <p className="text-3xl font-bold text-green-600">{ativos}</p>
      </div>
    );
  }