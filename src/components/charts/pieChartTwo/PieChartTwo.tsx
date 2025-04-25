"use client";
import React from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function PieChartTwo() {
  const options: ApexOptions = {
    chart: {
      type: 'pie',
    },
    labels: ['Reclamaçao', 'Pedido de Suporte', 'Dúvida'],
    colors: ['#FF6384', '#36A2EB', '#FFCE56'],
    legend: {
      position: 'bottom'
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  const series = [10, 80, 10];

  return (
    <div>
      <ReactApexChart 
        options={options} 
        series={series} 
        type="pie" 
        height={300} 
      />
    </div>
  );
}