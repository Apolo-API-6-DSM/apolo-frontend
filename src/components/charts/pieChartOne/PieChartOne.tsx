"use client";
import React from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function PieChartOne() {
  const options: ApexOptions = {
    chart: {
      type: 'pie',
    },
    labels: ['Positivo', 'Negativo', 'Neutro'],
    colors: ['#465FFF', '#6C5CE7', '#00B894'],
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

  const series = [20, 10, 70];

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