import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Apolo - Importações Realizadas"
};

export default function ImportacaoRealizada() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Importações realizadas" />
      <div className="space-y-6">
        <ComponentCard title="Todas suas importações">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </div>
  );
}
