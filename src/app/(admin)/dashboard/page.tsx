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
import { DashboardDateProvider, useDashboardDate } from "@/components/graphics/DashboardDateContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiSearch } from "react-icons/fi";

function DashboardDateFilter() {
  const { selectedDate, setSelectedDate } = useDashboardDate();
  const [tempDate, setTempDate] = React.useState<Date | null>(selectedDate);

  // Atualiza o campo temporário quando o filtro global muda (ex: ao limpar)
  React.useEffect(() => {
    setTempDate(selectedDate);
  }, [selectedDate]);

  const handlePesquisar = () => {
    setSelectedDate(tempDate);
  };

  const handleLimpar = () => {
    const today = new Date();
    setTempDate(today);
    setSelectedDate(today);
  };

  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="text-gray-700 font-medium">Filtro</span>
      <div className="relative flex items-center">
        <DatePicker
          selected={tempDate}
          onChange={setTempDate}
          dateFormat="dd/MM/yyyy"
          className="bg-white border border-gray-300 rounded px-2 py-1 text-sm w-[120px]"
          maxDate={new Date()}
        />
      </div>
      <button
        className="ml-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
        onClick={handlePesquisar}
        type="button"
      >
        Pesquisar
      </button>
      <button
        className="ml-1 px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition"
        onClick={handleLimpar}
        type="button"
      >
        Limpar
      </button>
    </div>
  );
}

export default function Dashboard() {
  return (
    <DashboardDateProvider>
      <DashboardDataProvider>
        <div className="flex justify-end">
          <DashboardDateFilter />
        </div>
        <div className="flex flex-col space-y-6">
          <div className="col-span-12 space-y-6 xl:col-span-7 align-center">
            <EcommerceMetrics />
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <TempoMedioFechamentoCard />
            <ResponsaveisAtivosCard />
          </div> */}
          </div>

          <div className="col-span-12 space-y-6 xl:col-span-7">
            <MonthlySalesChart />
          </div>


          <div className="grid grid-cols-12 gap-4 md:gap-6">

            <div className="col-span-12 xl:col-span-6">
              <DemographicCard />
            </div>

            <div className="col-span-12 xl:col-span-6">
              <PizzaTipoChamadoChart />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12 xl:col-span-6">
              <MonthlyTarget />
            </div>

            <div className="col-span-12 xl:col-span-6">
              <RecentOrders />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
            <EmocaoPorDiaChart />
            <ChamadoPorDiaChart />
          </div>

        </div>

      </DashboardDataProvider>
    </DashboardDateProvider>
  );
}