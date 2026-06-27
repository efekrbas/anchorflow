import React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
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
import { TrendingUp } from 'lucide-react';

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
      <Card className="bg-transparent border-0 text-white shadow-none">
        <CardHeader className="pb-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-stellar-500/15 to-purple-500/10 border border-white/10 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-stellar-400" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
              </svg>
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Balance History</CardTitle>
              <CardDescription className="text-zinc-500">Connect wallet to view history</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-[140px] flex flex-col items-center justify-center gap-3">
          <div className="flex gap-1 items-end h-[60px]">
            {[24, 35, 20, 50, 32, 45, 28].map((height, i) => (
              <div 
                key={i} 
                className="w-6 bg-white/5 rounded-sm" 
                style={{ height: `${height}px` }}
              ></div>
            ))}
          </div>
          <p className="text-xs font-medium text-zinc-600">Connect your wallet to see trend</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-transparent border-0 text-white shadow-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-stellar-500/15 to-purple-500/10 border border-white/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-stellar-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Balance History</CardTitle>
              <CardDescription className="text-zinc-400">Total balance trend — last 7 days</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-emerald-400" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 6l-9.5 9.5-5-5L1 18" />
              <path d="M17 6h6v6" />
            </svg>
            <span className="text-xs font-semibold text-emerald-400">+25%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3381FF" stopOpacity={0.25}/>
                  <stop offset="50%" stopColor="#3381FF" stopOpacity={0.08}/>
                  <stop offset="100%" stopColor="#3381FF" stopOpacity={0}/>
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 500 }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
                width={50}
              />
              <ChartTooltip 
                content={<ChartTooltipContent indicator="line" />} 
                cursor={{ stroke: 'rgba(51, 129, 255, 0.2)', strokeWidth: 1 }}
              />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="#3381FF" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#colorBalance)"
                filter="url(#glow)"
                dot={false}
                activeDot={{ r: 5, fill: '#3381FF', stroke: '#0F172A', strokeWidth: 2, filter: 'url(#glow)' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default DashboardChart;
