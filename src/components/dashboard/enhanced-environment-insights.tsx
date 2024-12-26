// /components/dashboard/enhanced-environment-insights.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Volume2, Clock, Timer } from 'lucide-react';
import { EnvironmentFactor } from '@/types/analytics';

interface EnhancedEnvironmentInsightsProps {
  factors: EnvironmentFactor[];
}

export const EnhancedEnvironmentInsights = ({ factors = [] }: EnhancedEnvironmentInsightsProps) => {
  const [expandedFactor, setExpandedFactor] = useState<string | null>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case 'noise':
        return <Volume2 className="w-5 h-5" />;
      case 'time_of_day':
        return <Clock className="w-5 h-5" />;
      case 'duration':
        return <Timer className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getDetailedRecommendations = (type: string) => {
    switch (type) {
      case 'noise':
        return [
          'Find a quiet room for practice sessions',
          'Use noise-canceling headphones if available',
          'Practice during off-peak hours',
          'Consider acoustic treatment for your practice space'
        ];
      case 'time_of_day':
        return [
          'Schedule important conversations during your peak hours',
          'Practice consistently at your optimal time',
          'Gradually extend practice to other times of day',
          'Track performance variations throughout the day'
        ];
      case 'duration':
        return [
          'Break long sessions into smaller chunks',
          'Take regular breaks every 15-20 minutes',
          'Use timer to maintain optimal session length',
          'Gradually increase duration as stamina improves'
        ];
      default:
        return [];
    }
  };

  if (!factors || factors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Environment Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.p 
            className="text-center text-muted-foreground py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No environment insights available yet
          </motion.p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Environment Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {factors.map((factor, index) => (
            <motion.div
              key={factor.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getIcon(factor.type)}
                    <span className="font-medium capitalize">
                      {factor.type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-sm ${factor.impact > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {factor.impact > 0 ? '+' : ''}{factor.impact}% impact
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedFactor(
                        expandedFactor === factor.type ? null : factor.type
                      )}
                    >
                      {expandedFactor === factor.type ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {factor.recommendation}
                </p>
                <AnimatePresence>
                  {expandedFactor === factor.type && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 space-y-2">
                        <h4 className="text-sm font-medium">Detailed Recommendations:</h4>
                        <ul className="list-disc list-inside space-y-2">
                          {getDetailedRecommendations(factor.type).map((rec, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="text-sm text-muted-foreground"
                            >
                              {rec}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
};