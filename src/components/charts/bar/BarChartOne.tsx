"use client";

import React, { useState, useMemo } from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Label,
    CartesianGrid,
    LabelList,
} from "recharts";

type ChartDataProps = {
    data?: { name: string; quantidade: number }[];
};

export default function BarChartOne({ data }: ChartDataProps) {
    const [period, setPeriod] = useState<"day" | "week" | "month" | "quarter">("day");

    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    const getDaysInMonth = (month: number, year: number) => {
        return new Date(year, month, 0).getDate();
    };

    // Gera dados FIXOS ao carregar (e não muda depois!)
    const fixedData = useMemo(() => {
        const daysInMonth = getDaysInMonth(currentMonth, currentYear);

        const random = (seed: number) => {
            const x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };

        // Gera dados diários para todos os dias do mês
        const dayData = Array.from({ length: daysInMonth }, (_, i) => ({
            name: `${i + 1}`, // Garante que todos os dias (1 a daysInMonth) sejam gerados
            quantidade: Math.floor(50 + random(i + 1) * 50),
        }));

        // Calcula o total de abril (ou mês atual)
        const aprilTotal = dayData.reduce((sum, day) => sum + day.quantidade, 0);

        // Gera dados semanais somando os dias correspondentes
        const weekData = Array.from({ length: 4 }, (_, i) => {
            const startDay = i * 7;
            const endDay = Math.min(startDay + 7, daysInMonth);
            const quantidade = dayData
                .slice(startDay, endDay)
                .reduce((sum, day) => sum + day.quantidade, 0);
            return { name: `Semana ${i + 1}`, quantidade };
        });

        // Gera dados mensais com base no total de abril
        const monthData = Array.from({ length: 12 }, (_, i) => ({
            name: `${i + 1}`,
            quantidade: i + 1 === currentMonth
                ? aprilTotal
                : Math.floor(aprilTotal + random(i + 1) * 100 - 50), // Valores próximos ao total de abril
        }));

        // Gera dados trimestrais somando os meses correspondentes
        const quarterData = Array.from({ length: 4 }, (_, i) => {
            const startMonth = i * 3;
            const endMonth = startMonth + 3;
            const quantidade = monthData
                .slice(startMonth, endMonth)
                .reduce((sum, month) => sum + month.quantidade, 0);
            return { name: `Q${i + 1}`, quantidade };
        });

        return { day: dayData, week: weekData, month: monthData, quarter: quarterData };
    }, [currentMonth, currentYear]);

    const handlePeriodChange = (newPeriod: "day" | "week" | "month" | "quarter") => {
        setPeriod(newPeriod);
    };

    return (
        <div className="w-full h-[320px]">
            <style jsx>{`
                .recharts-legend-wrapper .recharts-legend-item {
                    margin-top: 20px; /* Ajuste o valor da margem conforme necessário */
                }
            `}</style>
            {/* Seletor de Período */}
            <div className="flex items-center gap-2 mb-4">
                {["day", "week", "month", "quarter"].map((p) => (
                    <button
                        key={p}
                        onClick={() => handlePeriodChange(p as any)}
                        className={`px-3 py-1 rounded-full text-sm ${
                            period === p
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white/70"
                        }`}
                    >
                        {p === "day" && "Dia"}
                        {p === "week" && "Semana"}
                        {p === "month" && "Mês"}
                        {p === "quarter" && "Trimestre"}
                    </button>
                ))}
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={fixedData[period]}
                    margin={{ top: 30, right: 30, left: 30, bottom: 40 }}
                    barSize={30}
                >
                    <CartesianGrid strokeDasharray="3 3" /> {/* Adiciona linhas pontilhadas horizontais */}
                    <XAxis dataKey="name" interval={0} style={{ fontSize: '12px' }}>
                        <Label
                            value={period === "day" ? `Dias de ${currentMonth}/${currentYear}` : "Período"}
                            offset={-10}
                            position="insideBottom"
                        />
                    </XAxis>
                    <YAxis tickCount={10}> {/* Aumenta o número de divisões horizontais */}
                        <Label
                            value="Chamados"
                            angle={-90}
                            position="insideLeft"
                            style={{ textAnchor: "middle" }}
                            dx={10}
                            dy={10}
                        />
                    </YAxis>
                    <Tooltip />
                    <Bar dataKey="quantidade" fill="#4F46E5">
                        <LabelList dataKey="quantidade" position="top" style={{ fontSize: '12px', fill: '#000' }} /> {/* Adiciona os valores acima das barras */}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}