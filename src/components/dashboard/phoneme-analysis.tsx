import { PhonemeAnalysis } from '@/types/analytics';

interface PhonemeAnalysisCardProps {
  phonemes: PhonemeAnalysis[];
}

export const PhonemeAnalysisCard = ({ phonemes }: PhonemeAnalysisCardProps) => {
  const sortedPhonemes = [...phonemes].sort((a, b) => b.errorRate - a.errorRate);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phoneme Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedPhonemes.slice(0, 5).map((phoneme) => (
            <div key={phoneme.phoneme} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">/{phoneme.phoneme}/</span>
                <span className="text-muted-foreground">
                  {phoneme.errorRate.toFixed(1)}% error rate
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${100 - phoneme.improvement}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {phoneme.improvement > 0
                  ? `${phoneme.improvement.toFixed(1)}% improvement`
                  : 'No improvement yet'}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};