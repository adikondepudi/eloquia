// /components/dashboard/metrics-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricsCardProps {
  title: string;
  value: string;
  description: string;
  isLoading?: boolean;
}

export const MetricsCard = ({ 
  title, 
  value, 
  description, 
  isLoading = false 
}: MetricsCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${isLoading ? 'animate-pulse' : ''}`}>
          {isLoading ? (
            <div className="h-8 w-24 bg-muted rounded" />
          ) : (
            value
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {isLoading ? (
            <div className="h-4 w-32 bg-muted rounded" />
          ) : (
            description
          )}
        </p>
      </CardContent>
    </Card>
  );
};