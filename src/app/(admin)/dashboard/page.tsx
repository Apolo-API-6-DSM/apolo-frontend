// app/dashboard/page.tsx
"use client";

import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/graphics/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/graphics/MonthlyTarget";
import MonthlySalesChart from "@/components/graphics/MonthlySalesChart";
import StatisticsChart from "@/components/graphics/StatisticsChart";
import RecentOrders from "@/components/graphics/RecentOrders";
import DemographicCard from "@/components/graphics/DemographicCard";
import { DashboardDataProvider } from "@/components/graphics/DataProvider";
import PizzaEmocoesChart from "@/components/graphics/PizzaEmocoesChart";
import { PizzaTipoChamadoChart } from "@/components/graphics/PizzaTipoChamadoChart";
import ResponsaveisAtivosCard from "@/components/graphics/ResponsaveisAtivosChart";
import TempoMedioFechamentoCard from "@/components/graphics/TempoMedioFechamentoChart";
import ChamadasAbertasCard from "@/components/graphics/ChamadasAbertasCard";
import EmocaoPorDiaChart from "@/components/graphics/EmocaoPorDiaChart";
import ChamadoPorDiaChart from "@/components/graphics/ChamadoPorDiaChart";

// Metadata needs to be in a separate file for App Router in client components
export default function Dashboard() {
  return (
    <DashboardDataProvider>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />
          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
        <PizzaEmocoesChart />
        <PizzaTipoChamadoChart />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <TempoMedioFechamentoCard />
        <ChamadasAbertasCard />
        <ResponsaveisAtivosCard />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
        <EmocaoPorDiaChart />
        <ChamadoPorDiaChart />
      </div>

    </DashboardDataProvider>
  );
}