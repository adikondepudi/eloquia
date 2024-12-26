// /components/dashboard/speech-naturalness.tsx
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface MetricScore {
  category: string;
  score: number;
  change: number;
  details: {
    label: string;
    value: number;
  }[];
}

interface SpeechNaturalnessProps {
  metrics: MetricScore[];
}

export const SpeechNaturalness = ({ metrics }: SpeechNaturalnessProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Speech Naturalness</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{metric.category}</h4>
                  <p className="text-sm text-muted-foreground">
                    Score: {metric.score.toFixed(1)}/10
                  </p>
                </div>
                <div className={`text-sm ${metric.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </div>
              </div>

              <Progress value={metric.score * 10} className="h-2" />

              <div className="grid grid-cols-2 gap-4">
                {metric.details.map((detail, detailIndex) => (
                  <motion.div
                    key={detail.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index * 0.1) + (detailIndex * 0.05) }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{detail.label}</span>
                      <span>{detail.value.toFixed(1)}/10</span>
                    </div>
                    <Progress value={detail.value * 10} className="h-1" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};