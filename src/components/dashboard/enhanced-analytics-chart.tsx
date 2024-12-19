import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TimeRange } from '@/types/analytics';

interface EnhancedAnalyticsChartProps {
  data: {
    date: string;
    disfluencyRate: number;
    benchmark?: number;
  }[];
  onTimeRangeChange: (range: TimeRange) => void;
  timeRange: TimeRange;
  showBenchmark: boolean;
  onToggleBenchmark: () => void;
}

export const EnhancedAnalyticsChart = ({
  data,
  onTimeRangeChange,
  timeRange,
  showBenchmark,
  onToggleBenchmark,
}: EnhancedAnalyticsChartProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Fluency Progress</CardTitle>
          <div className="space-x-2">
            <Button
              variant={timeRange === 'week' ? 'default' : 'outline'}
              onClick={() => onTimeRangeChange('week')}
              size="sm"
            >
              Week
            </Button>
            <Button
              variant={timeRange === 'month' ? 'default' : 'outline'}
              onClick={() => onTimeRangeChange('month')}
              size="sm"
            >
              Month
            </Button>
            <Button
              variant={timeRange === 'all' ? 'default' : 'outline'}
              onClick={() => onTimeRangeChange('all')}
              size="sm"
            >
              All Time
            </Button>
            <Button
              variant={showBenchmark ? 'default' : 'outline'}
              onClick={onToggleBenchmark}
              size="sm"
            >
              Benchmark
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
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
                formatter={(value: number, name: string) => [
                  `${value.toFixed(1)} per minute`,
                  name === 'disfluencyRate' ? 'Your Rate' : 'Benchmark'
                ]}
                contentStyle={{
                  background: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="disfluencyRate"
                name="Your Rate"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
              {showBenchmark && (
                <Line
                  type="monotone"
                  dataKey="benchmark"
                  name="Benchmark"
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};