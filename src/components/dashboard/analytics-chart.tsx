// /components/dashboard/analytics-chart.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
  date: string;
  disfluencyRate: number;
}

interface AnalyticsChartProps {
  data: DataPoint[];
}

export const AnalyticsChart = ({ data }: AnalyticsChartProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
            className="text-sm"
          />
          <YAxis
            label={{
              value: 'Disfluencies/min',
              angle: -90,
              position: 'insideLeft',
              className: 'text-sm'
            }}
            className="text-sm"
          />
          <Tooltip
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
            formatter={(value: number) => [`${value.toFixed(1)} per minute`, 'Rate']}
            contentStyle={{
              background: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px'
            }}
          />
          <Line
            type="monotone"
            dataKey="disfluencyRate"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};