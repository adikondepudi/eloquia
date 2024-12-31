import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Radar, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

interface AnalyticsData {
  sessionData: {
    date: string;
    disfluencyRate: number;
    confidenceScore: number;
    duration: number;
  }[];
  disfluencyTypes: {
    type: string;
    count: number;
    trend: number;
  }[];
  problemAreas: {
    word: string;
    frequency: number;
    improvement: number;
  }[];
  environmentalFactors: {
    factor: string;
    correlation: number;
    sessions: number;
  }[];
  progressMetrics: {
    category: string;
    current: number;
    target: number;
    improvement: number;
  }[];
}

interface AdvancedAnalyticsProps {
  clientId: string;
  data: AnalyticsData;
  timeRange: 'week' | 'month' | 'quarter' | 'year';
  onTimeRangeChange: (range: 'week' | 'month' | 'quarter' | 'year') => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const AdvancedAnalytics = ({
  clientId,
  data,
  timeRange,
  onTimeRangeChange
}: AdvancedAnalyticsProps) => {
  const [activeSection, setActiveSection] = useState<string>('overview');

  const formatDate = (dateStr: string) => format(new Date(dateStr), 'MMM d');

  return (
    <div className="space-y-6">
      {/* Time Range Selection */}
      <div className="flex justify-end space-x-2">
        {['week', 'month', 'quarter', 'year'].map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? 'default' : 'outline'}
            size="sm"
            onClick={() => onTimeRangeChange(range as any)}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </Button>
        ))}
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {data.progressMetrics.map((metric) => (
              <div key={metric.category} className="space-y-2">
                <p className="text-sm font-medium">{metric.category}</p>
                <div className="flex justify-between text-sm">
                  <span>{metric.current.toFixed(1)}</span>
                  <span className="text-muted-foreground">Target: {metric.target}</span>
                </div>
                <Progress value={(metric.current / metric.target) * 100} />
                <p className="text-xs text-muted-foreground">
                  {metric.improvement > 0 ? '+' : ''}{metric.improvement}% improvement
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Session Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Session Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.sessionData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  className="text-sm"
                />
                <YAxis yAxisId="left" className="text-sm" />
                <YAxis yAxisId="right" orientation="right" className="text-sm" />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    value.toFixed(2),
                    name === 'disfluencyRate' ? 'Disfluency Rate' : 'Confidence'
                  ]}
                  labelFormatter={(label) => formatDate(label as string)}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="disfluencyRate"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="confidenceScore"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Disfluency Distribution */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Disfluency Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.disfluencyTypes}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => entry.type}
                  >
                    {data.disfluencyTypes.map((entry, index) => (
                      <Cell key={entry.type} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {data.disfluencyTypes.map((type) => (
                <div key={type.type} className="flex items-center gap-2">
                  <Badge variant="outline" className="w-full justify-between">
                    {type.type}
                    <span className={type.trend > 0 ? 'text-red-500' : 'text-green-500'}>
                      {type.trend > 0 ? '+' : ''}{type.trend}%
                    </span>
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Problem Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.problemAreas}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="word" className="text-sm" />
                  <YAxis className="text-sm" />
                  <Tooltip />
                  <Bar dataKey="frequency" fill="hsl(var(--primary))">
                    {data.problemAreas.map((entry, index) => (
                      <Cell 
                        key={entry.word}
                        fill={entry.improvement > 0 ? 'hsl(var(--primary))' : 'hsl(var(--destructive))'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Environmental Factors */}
      <Card>
        <CardHeader>
          <CardTitle>Environmental Impact Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data.environmentalFactors}>
                <PolarGrid className="stroke-muted" />
                <PolarAngleAxis dataKey="factor" className="text-sm" />
                <PolarRadiusAxis className="text-sm" />
                <Radar
                  name="Correlation"
                  dataKey="correlation"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {data.environmentalFactors.map((factor) => (
              <div key={factor.factor} className="flex items-center justify-between">
                <span className="text-sm">{factor.factor}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {factor.sessions} sessions
                  </span>
                  <Badge variant={factor.correlation > 0.5 ? 'destructive' : 'default'}>
                    {(factor.correlation * 100).toFixed(0)}% impact
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedAnalytics;