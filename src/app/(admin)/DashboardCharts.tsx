"use client";

import React from "react";
import dynamic from "next/dynamic";
import MonthlySalesChartHome from "@/components/graphics/MonthlySalesChartHome";
import { PizzaTipoChamadoChartHome } from "@/components/graphics/PizzaTipoChamadoChartHome";
import DemographicCardHome from "@/components/graphics/DemographicCardHome";

// Tipagem dos dados para os gráficos
type ChartDataItem = { name: string; value: number };
type ChartDataProps = { data: ChartDataItem[] };

// Helper para carregar componentes de gráfico dinamicamente
const loadChart = (path: string) =>
  dynamic<ChartDataProps>(() => import(`@/components/charts/${path}`), {
    ssr: false,
    loading: () => (
      <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
    ),
  });

// Carregamento dinâmico dos gráficos
const BarChartOne = loadChart("bar/BarChartOne");
const PieChartOne = loadChart("pieChartOne/PieChartOne");
const PieChartTwo = loadChart("pieChartTwo/PieChartTwo");

export default function DashboardCharts() {
  // Dados mockados para os gráficos
  const barData: ChartDataItem[] = [
    { name: "Seg", value: 30 },
    { name: "Ter", value: 45 },
    { name: "Qua", value: 28 },
    { name: "Qui", value: 55 },
    { name: "Sex", value: 40 },
  ];

  const pieDataOne: ChartDataItem[] = [
    { name: "Positivo", value: 60 },
    { name: "Neutro", value: 25 },
    { name: "Negativo", value: 15 },
  ];

  const pieDataTwo: ChartDataItem[] = [
    { name: "Aberto", value: 70 },
    { name: "Fechado", value: 30 },
  ];

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
