import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnvironmentFactor } from '@/types/analytics';

interface EnvironmentInsightsProps {
  factors?: EnvironmentFactor[];
}

export const EnvironmentInsights = ({ factors = [] }: EnvironmentInsightsProps) => {
  if (!factors || factors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Environment Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            No environment insights available yet
          </p>
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
        <div className="space-y-4">
          {factors.map((factor, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium capitalize">
                  {factor.type.replace('_', ' ')}
                </span>
                <span className={`text-sm ${factor.impact > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {factor.impact > 0 ? '+' : ''}{factor.impact}% impact
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {factor.recommendation}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};