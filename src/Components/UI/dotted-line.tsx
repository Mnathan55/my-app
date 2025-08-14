"use client";

import {
  CartesianGrid,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  Area,
  ResponsiveContainer,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../Components/UI/chart";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface DottedLineChartProps {
  coinId: string;
  currency: string;
}

const TIME_RANGES = [
  { label: "1D", value: 1 },
  { label: "7D", value: 7 },
  { label: "1M", value: 30 },
  { label: "3M", value: 90 },
  { label: "1Y", value: 365 },
  { label: "YTD", value: 366 }, // special case
];

export function DottedLineChart({ coinId, currency }: DottedLineChartProps) {
  const [days, setDays] = useState<number>(7);
  const [chartData, setChartData] = useState<
    { date: string; fullDate: Date; price: number }[]
  >([]);
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [liveTime, setLiveTime] = useState<string | null>(null);
  const [hoverPrice, setHoverPrice] = useState<number | null>(null);
  const [hoverTime, setHoverTime] = useState<string | null>(null);

  // Format date/time for display
  const formatDateTime = (date: Date) => {
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  // Fetch chart data
  useEffect(() => {
    async function fetchData() {
      try {
        let url = "";

        if (days === 366) {
          const currentYear = new Date().getFullYear();
          const from = Math.floor(
            new Date(`${currentYear}-01-01`).getTime() / 1000
          );
          const to = Math.floor(Date.now() / 1000);
          url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart/range?vs_currency=${currency}&from=${from}&to=${to}`;
        } else {
          url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        const formattedData = data.prices.map(
          ([timestamp, price]: [number, number]) => {
            const dateObj = new Date(timestamp);
            const label = `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;
            return {
              date: label,
              fullDate: dateObj,
              price: Number(price.toFixed(2)),
            };
          }
        );

        setChartData(formattedData);
        if (formattedData.length > 0) {
          const lastPoint = formattedData[formattedData.length - 1];
          setLivePrice(lastPoint.price);
          setLiveTime(formatDateTime(lastPoint.fullDate));
        }
      } catch (error) {
        console.error("Error fetching chart data", error);
      }
    }

    fetchData();
  }, [coinId, currency, days]);

  const chartConfig = {
    price: {
      label: "Price",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  return (
    <div className="w-full bg-[#111] max-w-5xl mx-auto p-0 md:p-2 space-y-6">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center p-2 md:p-0 justify-between gap-4">
        <h2 className="text-2xl px-3 font-semibold">
          {coinId.toUpperCase()} Price Chart
        </h2>
      </div>

      {/* Live / Hover Price Display */}
      <div className="text-left text-white px-3">
        <div className="text-2xl font-bold">
          {hoverPrice !== null ? hoverPrice : livePrice}{" "}
          {currency.toUpperCase()}
        </div>
        <div className="text-sm text-gray-500">
          {hoverTime !== null ? hoverTime : liveTime}
        </div>
      </div>

      {/* Chart Body */}
      <div className="w-full h-[400px] rounded-xl p-4">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ left: 0, right: 0, top: 10, bottom: 10 }}
              onMouseMove={(state) => {
                if (state.isTooltipActive && state.activePayload) {
                  const payload = state.activePayload[0]?.payload;
                  if (payload) {
                    setHoverPrice(payload.price);
                    setHoverTime(formatDateTime(payload.fullDate));
                  }
                }
              }}
              onMouseLeave={() => {
                setHoverPrice(null);
                setHoverTime(null);
              }}
            >
              <defs>
                <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0165FC" stopOpacity={0.7} />
                  <stop offset="20%" stopColor="#0165FC" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#000000" stopOpacity={0.3} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} horizontal={false} />
              <XAxis dataKey="date" hide />
              <YAxis hide domain={["dataMin * 0.98", "dataMax * 1.02"]} />

              <ChartTooltip
                cursor
                content={<ChartTooltipContent hideLabel />}
              />

              <Area
                type="linear"
                dataKey="price"
                stroke="#0165FC"
                strokeWidth={2}
                fill="url(#fillGradient)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      {/* Time Range Buttons */}
      <div className="relative flex flex-row justify-between w-full h-fit px-20 mt-4">
        {TIME_RANGES.map(({ label, value }) => (
          <button
            key={label}
            onClick={() => setDays(value as number)}
            className={cn(
              "px-auto py-1 text-md text-white rounded-4xl transition cursor-pointer",
              value === days ? "bg-[#111]/80 text-white" : "hover:bg-gray-400"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
