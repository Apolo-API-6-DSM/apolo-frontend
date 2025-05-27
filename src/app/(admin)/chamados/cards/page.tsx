import React, { Suspense } from "react";
import RelatorioCards from "./relatorioCards";

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando relatório de cards...</div>}>
      <RelatorioCards />
    </Suspense>
  );
}
