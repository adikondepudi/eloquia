// /components/dashboard/recent-uploads.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AudioRecording } from "@/types/upload";
import { formatDistanceToNow } from 'date-fns';

interface RecentUploadsProps {
  recordings: AudioRecording[];
  isLoading?: boolean;
}

export const RecentUploads = ({ recordings, isLoading = false }: RecentUploadsProps) => {
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Uploads</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                <div className="space-y-2">
                  <div className="h-5 w-40 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-4 w-16 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : recordings.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No recordings yet. Upload your first recording to get started!
          </div>
        ) : (
          <div className="space-y-4">
            {recordings.map((recording) => (
              <div
                key={recording.id}
                className="flex items-center justify-between border-b pb-2 last:border-0"
              >
                <div>
                  <p className="font-medium">{recording.filename}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(recording.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <span className="text-sm">
                  {formatDuration(recording.duration)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};