import React, { Suspense } from "react";
import Chamados from "./chamados";

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando chamados...</div>}>
      <Chamados />
    </Suspense>
  );
}
