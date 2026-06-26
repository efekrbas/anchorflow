import React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { day: "Mon", balance: 4000 },
  { day: "Tue", balance: 4100 },
  { day: "Wed", balance: 3800 },
  { day: "Thu", balance: 4500 },
  { day: "Fri", balance: 4800 },
  { day: "Sat", balance: 4900 },
  { day: "Sun", balance: 5000 },
];

const chartConfig = {
  balance: {
    label: "XLM Balance",
    color: "#3381FF",
  },
};

const DashboardChart = ({ address }) => {
  if (!address) {
    return (
      <Card className="bg-zinc-950/50 border-white/10 text-white mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Balance History</CardTitle>
          <CardDescription className="text-zinc-500">Connect wallet to view history</CardDescription>
        </CardHeader>
        <CardContent className="h-[250px] flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-zinc-600" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18" />
              <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
            </svg>
          </div>
          <p className="text-sm font-medium text-zinc-500">Connect your wallet to see trend</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-zinc-950/50 border-white/10 text-white mb-6 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl">Balance History</CardTitle>
        <CardDescription className="text-zinc-400">Your total balance trend over the last 7 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3381FF" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3381FF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                dy={10}
              />
              <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="#3381FF" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorBalance)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default DashboardChart;
