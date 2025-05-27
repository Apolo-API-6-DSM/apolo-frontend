import React, { Suspense } from "react";
import ListagemChamados from "./listagemChamados";

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando relatório de cards...</div>}>
      <ListagemChamados />
    </Suspense>
  );
}
