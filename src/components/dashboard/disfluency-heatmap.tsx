// /components/dashboard/disfluency-heatmap.tsx
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { TimeRange } from '@/types/analytics';

interface HeatmapData {
  hour: number;
  weekday: number;
  value: number;
}

interface DisfluencyHeatmapProps {
  data: HeatmapData[];
  onViewChange: (view: TimeRange) => void;
  currentView: TimeRange;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export const DisfluencyHeatmap = ({
  data,
  onViewChange,
  currentView
}: DisfluencyHeatmapProps) => {
  const getColor = (value: number) => {
    // Scale from light blue to dark blue based on value
    const intensity = Math.min(255, Math.floor((value / 10) * 255));
    return `rgb(${255 - intensity}, ${255 - intensity}, 255)`;
  };

  const getValue = (hour: number, weekday: number) => {
    const point = data.find(d => d.hour === hour && d.weekday === weekday);
    return point?.value || 0;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Disfluency Patterns</CardTitle>
          <div className="space-x-2">
            <Button
              variant={currentView === 'week' ? 'default' : 'outline'}
              onClick={() => onViewChange('week')}
              size="sm"
            >
              Week
            </Button>
            <Button
              variant={currentView === 'month' ? 'default' : 'outline'}
              onClick={() => onViewChange('month')}
              size="sm"
            >
              Month
            </Button>
            <Button
              variant={currentView === 'all' ? 'default' : 'outline'}
              onClick={() => onViewChange('all')}
              size="sm"
            >
              All Time
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Hour labels */}
            <div className="flex mb-2">
              <div className="w-16" /> {/* Spacer for day labels */}
              {HOURS.map(hour => (
                <div key={hour} className="w-8 text-center text-xs text-muted-foreground">
                  {hour}
                </div>
              ))}
            </div>
            
            {/* Heatmap grid */}
            {DAYS.map((day, dayIndex) => (
              <div key={day} className="flex items-center mb-1">
                <div className="w-16 text-sm text-muted-foreground">{day}</div>
                {HOURS.map(hour => (
                  <motion.div
                    key={`${day}-${hour}`}
                    className="w-8 h-8 m-px rounded"
                    style={{ backgroundColor: getColor(getValue(hour, dayIndex)) }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: (dayIndex * 24 + hour) * 0.01 }}
                    whileHover={{
                      scale: 1.2,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <div className="group relative">
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 px-2 py-1 bg-background border rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">
                        {getValue(hour, dayIndex).toFixed(1)} disfluencies/min
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}
            
            {/* Legend */}
            <div className="mt-4 flex items-center justify-end">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">Lower</span>
                <div className="flex">
                  {[0, 2, 4, 6, 8, 10].map(value => (
                    <div
                      key={value}
                      className="w-6 h-4"
                      style={{ backgroundColor: getColor(value) }}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">Higher</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};