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
import { ptBR } from "date-fns/locale/pt-BR";

function DashboardDateFilter() {
  const { selectedRange, setSelectedRange } = useDashboardDate();
  const [range, setRange] = React.useState<{ start: Date | null; end: Date | null }>(selectedRange);

  React.useEffect(() => {
    setRange(selectedRange);
  }, [selectedRange]);

  const handlePesquisar = () => {
    setSelectedRange(range);
  };

  const handleLimpar = () => {
    const today = new Date();
    setRange({ start: today, end: null });
    setSelectedRange({ start: today, end: null });
  };

  return (
    <div className="mb-4 flex items-end gap-3">
      <div className="flex gap-4">
        <div className="flex flex-col">
          <label className="text-xs mb-1 text-gray-600 dark:text-white">Início</label>
          <DatePicker
            selected={range.start}
            onChange={date => setRange(r => ({ ...r, start: date }))}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="dd/MM/yyyy HH:mm"
            placeholderText="Data/Hora Início"
            className="bg-white dark:text-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-52 z-[1000]"
            maxDate={new Date()}
            isClearable
            locale={ptBR}
            popperClassName="z-[1000]"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs mb-1 text-gray-600 dark:text-white">Fim</label>
          <DatePicker
            selected={range.end}
            onChange={date => setRange(r => ({ ...r, end: date }))}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="dd/MM/yyyy HH:mm"
            placeholderText="Data/Hora Fim"
            className="bg-white dark:text-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-52 z-[1000]"
            maxDate={new Date()}
            isClearable
            locale={ptBR}
            popperClassName="z-[1000]"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition w-28"
          onClick={handlePesquisar}
          type="button"
        >
          Pesquisar
        </button>
        <button
          className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition w-28"
          onClick={handleLimpar}
          type="button"
        >
          Limpar
        </button>
      </div>
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