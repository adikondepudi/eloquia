// /src/components/client/client-recordings-section.tsx
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Download, Clock, File, ChevronDown, ChevronUp, Mic } from 'lucide-react';
import { Recording, Annotation } from '@/types/enhanced-client';
import { enhancedMockApiClient } from '@/lib/enhanced-mock-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

interface ClientRecordingsSectionProps {
  clientId: string;
  recordings: Recording[];
  onRecordingUpdate: (recordingId: string) => void;
}

export function ClientRecordingsSection({
  clientId,
  recordings,
  onRecordingUpdate
}: ClientRecordingsSectionProps) {
  const [expandedRecording, setExpandedRecording] = useState<string | null>(null);
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);
  const [annotations, setAnnotations] = useState<Record<string, Annotation[]>>({});
  const [newAnnotation, setNewAnnotation] = useState({
    content: '',
    type: 'observation' as const,
    category: 'fluency' as const,
    timestamp: 0
  });

  useEffect(() => {
    const loadAnnotations = async (recordingId: string) => {
      if (!annotations[recordingId]) {
        const response = await enhancedMockApiClient.getRecordingAnnotations(recordingId);
        if (!response.error) {
          setAnnotations(prev => ({
            ...prev,
            [recordingId]: response.data
          }));
        }
      }
    };

    if (expandedRecording) {
      loadAnnotations(expandedRecording);
    }
  }, [expandedRecording, annotations]);

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const handleAddAnnotation = async (recordingId: string) => {
    if (!newAnnotation.content.trim()) return;

    const response = await enhancedMockApiClient.addAnnotation({
      ...newAnnotation,
      recordingId,
      therapistId: 'th_1',
      tags: []
    });

    if (!response.error) {
      setAnnotations(prev => ({
        ...prev,
        [recordingId]: [...(prev[recordingId] || []), response.data]
      }));
      setNewAnnotation({
        content: '',
        type: 'observation',
        category: 'fluency',
        timestamp: 0
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Recordings</h3>
      </div>

      <div className="grid gap-4">
        <AnimatePresence>
          {recordings.map((recording) => (
            <motion.div
              key={recording.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card>
                <CardHeader
                  className="cursor-pointer"
                  onClick={() => setExpandedRecording(
                    expandedRecording === recording.id ? null : recording.id
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Mic className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{recording.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(recording.uploadedAt), 'MMM d, yyyy - h:mm a')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-muted-foreground">
                        {formatDuration(recording.duration)}
                      </div>
                      {expandedRecording === recording.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                {expandedRecording === recording.id && (
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Button variant="outline" size="sm">
                            <Play className="h-4 w-4 mr-2" />
                            Play
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <File className="h-4 w-4" />
                          {formatFileSize(recording.fileSize)}
                        </div>
                      </div>

                      {recording.analysisResults && (
                        <div className="space-y-4">
                          <h4 className="font-medium">Analysis Results</h4>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Disfluency Rate</span>
                                <span>{recording.analysisResults.disfluencyRate.toFixed(1)}/min</span>
                              </div>
                              <Progress
                                value={Math.min(100, recording.analysisResults.disfluencyRate * 10)}
                              />
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Confidence Score</span>
                                <span>{(recording.analysisResults.confidenceScore * 100).toFixed(1)}%</span>
                              </div>
                              <Progress
                                value={recording.analysisResults.confidenceScore * 100}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h5 className="text-sm font-medium">Improvements</h5>
                            <ul className="list-disc list-inside text-sm text-muted-foreground">
                              {recording.analysisResults.improvements.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-2">
                            <h5 className="text-sm font-medium">Areas of Concern</h5>
                            <ul className="list-disc list-inside text-sm text-muted-foreground">
                              {recording.analysisResults.areas_of_concern.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Annotations Section */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Annotations</h4>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                Add Annotation
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Add Annotation</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Timestamp</label>
                                  <div className="flex items-center gap-2">
                                    <Input
                                      type="number"
                                      min={0}
                                      max={recording.duration}
                                      value={newAnnotation.timestamp}
                                      onChange={(e) => setNewAnnotation({
                                        ...newAnnotation,
                                        timestamp: parseInt(e.target.value) || 0
                                      })}
                                    />
                                    <span className="text-sm text-muted-foreground">seconds</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Note</label>
                                  <Textarea
                                    value={newAnnotation.content}
                                    onChange={(e) => setNewAnnotation({
                                      ...newAnnotation,
                                      content: e.target.value
                                    })}
                                    placeholder="Enter annotation details..."
                                  />
                                </div>
                                <Button
                                  className="w-full"
                                  onClick={() => handleAddAnnotation(recording.id)}
                                >
                                  Add Annotation
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>

                        <div className="space-y-4">
                          {annotations[recording.id]?.map((annotation) => (
                            <div
                              key={annotation.id}
                              className="flex items-start gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
                            >
                              <div className="flex-shrink-0">
                                <Badge variant="outline">
                                  {formatDuration(annotation.timestamp)}
                                </Badge>
                              </div>
                              <div className="space-y-1 flex-grow">
                                <p className="text-sm">{annotation.content}</p>
                                <div className="flex items-center gap-2">
                                  <Badge className={`${annotation.type === 'observation' ? 'bg-blue-500/15 text-blue-700' : 'bg-green-500/15 text-green-700'}`}>
                                    {annotation.type}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {format(new Date(annotation.createdAt), 'MMM d, h:mm a')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}