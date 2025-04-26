// app/dashboard/page.tsx
"use client";

import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import { DashboardDataProvider } from "@/components/ecommerce/DataProvider";
import PizzaEmocoesChart from "@/components/ecommerce/PizzaEmocoesChart";
import { PizzaTipoChamadoChart } from "@/components/ecommerce/PizzaTipoChamadoChart";
import ResponsaveisAtivosCard from "@/components/ecommerce/ResponsaveisAtivosChart";
import TempoMedioFechamentoCard from "@/components/ecommerce/TempoMedioFechamentoChart";
import ChamadasAbertasCard from "@/components/ecommerce/ChamadasAbertasCard";

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

    </DashboardDataProvider>
  );
}