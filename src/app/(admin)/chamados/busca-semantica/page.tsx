// app/(admin)/chamados/busca-semantica/page.tsx

import React, { Suspense } from "react";
import RelatorioChamados from "./relatorioChamados"; // ajuste o caminho se estiver em outra pasta

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando relatório...</div>}>
      <RelatorioChamados />
    </Suspense>
  );
}
