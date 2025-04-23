"use client";
import React, { useState, useEffect } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

// Dados de vendas diárias (simulados - VOCÊ PRECISA SUBSTITUIR PELOS SEUS DADOS REAIS)
const dailySalesData = [
  { date: "2024-01-01", sales: 50 },
  { date: "2024-01-01", sales: 60 },
  { date: "2024-01-02", sales: 75 },
  { date: "2024-01-08", sales: 40 },
  { date: "2024-01-08", sales: 55 },
  { date: "2024-01-15", sales: 80 },
  { date: "2024-02-03", sales: 90 },
  { date: "2024-03-10", sales: 100 },
  { date: "2024-03-17", sales: 110 },
  { date: "2024-04-01", sales: 120 },
  { date: "2024-04-08", sales: 130 },
  { date: "2024-05-05", sales: 140 },
  { date: "2024-06-12", sales: 150 },
  { date: "2024-07-19", sales: 160 },
  { date: "2024-08-26", sales: 170 },
  { date: "2024-09-02", sales: 180 },
  { date: "2024-10-09", sales: 190 },
  { date: "2024-11-16", sales: 200 },
  { date: "2024-12-23", sales: 210 },
];

export default function BarChartOne() {
  const [period, setPeriod] = useState("month");
  const [chartData, setChartData] = useState({
    series: [{ name: "Sales", data: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112] }],
    options: { xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] } },
  });

  const processData = (data: { date: string; sales: number }[], selectedPeriod: string) => {
    const aggregatedData: { [key: string]: number } = {};
    const categories: string[] = [];

    data.forEach((item) => {
      const date = new Date(item.date);
      let key: string = "";

      switch (selectedPeriod) {
        case "day":
          key = format(date, "dd/MM/yyyy", { locale: ptBR });
          break;
        case "week":
          const start = startOfWeek(date, { weekStartsOn: 0 });
          const end = endOfWeek(date, { weekStartsOn: 0 });
          key = `${format(start, "dd/MM", { locale: ptBR })} - ${format(end, "dd/MM", { locale: ptBR })}`;
          break;
        case "month":
          key = format(date, "MMM", { locale: ptBR });
          break;
        case "quarter":
          const quarter = Math.floor((date.getMonth() + 3) / 3);
          key = `T${quarter} ${date.getFullYear()}`;
          break;
        default:
          key = format(date, "MMM", { locale: ptBR });
          break;
      }

      aggregatedData[key] = (aggregatedData[key] || 0) + item.sales;
    });

    for (const key in aggregatedData) {
      categories.push(key);
    }

    setChartData({
      series: [{ name: "Sales", data: Object.values(aggregatedData) }],
      options: { xaxis: { categories: categories } },
    });
  };

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
  };

  useEffect(() => {
    processData(dailySalesData, period);
  }, [period]);

  const options: ApexOptions = {
    ...chartData.options, // Merge as categorias dinâmicas
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      x: {
        show: true,
      },
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };
  const series = chartData.series;

  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded-md text-sm ${
            period === "day" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => handlePeriodChange("day")}
        >
          Dia
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm ${
            period === "week" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => handlePeriodChange("week")}
        >
          Semana
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm ${
            period === "month" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => handlePeriodChange("month")}
        >
          Mês
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm ${
            period === "quarter" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => handlePeriodChange("quarter")}
        >
          Trimestre
        </button>
      </div>
      <div id="chartOne" className="min-w-[1000px]">
        <ReactApexChart options={options} series={series} type="bar" height={180} />
      </div>
    </div>
  );
}