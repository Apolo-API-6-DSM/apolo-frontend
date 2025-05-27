"use client";

import React from "react";
import MonthlySalesChartHome from "@/components/graphics/MonthlySalesChartHome";
import { PizzaTipoChamadoChartHome } from "@/components/graphics/PizzaTipoChamadoChartHome";
import DemographicCardHome from "@/components/graphics/DemographicCardHome";

export default function DashboardCharts() {

  return (
    <section className="space-y-6">
      {/* Gráfico de Barras */}
      <ChartCard title="Chamados por Dia">
        <MonthlySalesChartHome />
      </ChartCard>

      {/* Gráficos de Pizza */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard title="Sentimentos">
          <div className="h-[250px]"> {/* Diminuí a altura */}
            <DemographicCardHome />
          </div>
        </ChartCard>

        <ChartCard title="Status dos Chamados">
          <div className="h-[250px]"> {/* Diminuí a altura */}
            <PizzaTipoChamadoChartHome />
          </div>
        </ChartCard>
      </div>
    </section>
  );
}

// Componente reutilizável para cartão de gráficos
function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">{title}</h3>
      {children}
    </div>
  );
}
