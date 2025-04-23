"use client";

import React from "react";
import dynamic from "next/dynamic";

// Import dinâmico dos gráficos
const BarChartOne = dynamic(() => import("@/components/charts/bar/BarChartOne"), {
  ssr: false,
  loading: () => <div className="h-[180px] w-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
});

const PieChartOne = dynamic(() => import("@/components/charts/pieChartOne/PieChartOne"), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
});

const PieChartTwo = dynamic(() => import("@/components/charts/pieChartTwo/PieChartTwo"), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
});

export default function DashboardCharts() {
  return (
    <>
      {/* Gráfico de barras ocupando a largura total */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] mb-4 md:mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Teste</h3>
        <BarChartOne />
      </div>

      {/* Gráficos de pizza lado a lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Sentimentos</h3>
          <PieChartOne />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Teste</h3>
          <PieChartTwo />
        </div>
      </div>
    </>
  );
}