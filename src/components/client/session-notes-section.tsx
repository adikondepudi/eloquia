import { useState } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Plus, CalendarIcon, Clock, MessageSquare } from 'lucide-react';
import { SessionNote, SessionQuality, CreateSessionNoteInput } from '@/types/session-notes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SessionNotesSectionProps {
  clientId: string;
  therapistId: string;
  notes: SessionNote[];
  onNoteCreate: (note: CreateSessionNoteInput) => Promise<void>;
}

const QUALITY_OPTIONS: { value: SessionQuality; label: string }[] = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'challenging', label: 'Challenging' },
];

export function SessionNotesSection({
  clientId,
  therapistId,
  notes,
  onNoteCreate,
}: SessionNotesSectionProps) {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState<Omit<CreateSessionNoteInput, 'clientId' | 'therapistId'>>({
    date: format(new Date(), 'yyyy-MM-dd'),
    duration: 30,
    primaryFocus: '',
    observations: '',
    quality: 'good',
    progress: '',
  });

  const handleSubmit = async () => {
    await onNoteCreate({
      clientId,
      therapistId,
      ...newNote,
    });

    setIsAddingNote(false);
    setNewNote({
      date: format(new Date(), 'yyyy-MM-dd'),
      duration: 30,
      primaryFocus: '',
      observations: '',
      quality: 'good',
      progress: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Session Notes</h3>
        <Dialog open={isAddingNote} onOpenChange={setIsAddingNote}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Session Note</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Session Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newNote.date}
                    onChange={(e) => setNewNote({ ...newNote, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min={1}
                    value={newNote.duration}
                    onChange={(e) => setNewNote({ ...newNote, duration: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="focus">Primary Focus</Label>
                <Input
                  id="focus"
                  value={newNote.primaryFocus}
                  onChange={(e) => setNewNote({ ...newNote, primaryFocus: e.target.value })}
                  placeholder="Main focus of the session"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observations">Notable Observations</Label>
                <Textarea
                  id="observations"
                  value={newNote.observations}
                  onChange={(e) => setNewNote({ ...newNote, observations: e.target.value })}
                  placeholder="Key observations from the session"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quality">Session Quality</Label>
                <Select
                  value={newNote.quality}
                  onValueChange={(value: SessionQuality) => 
                    setNewNote({ ...newNote, quality: value })
                  }
                >
                  <SelectTrigger id="quality">
                    <SelectValue placeholder="Select session quality" />
                  </SelectTrigger>
                  <SelectContent>
                    {QUALITY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="progress">Overall Progress</Label>
                <Textarea
                  id="progress"
                  value={newNote.progress}
                  onChange={(e) => setNewNote({ ...newNote, progress: e.target.value })}
                  placeholder="Summary of progress and achievements"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setIsAddingNote(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Save Note</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {notes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No session notes yet</p>
            </CardContent>
          </Card>
        ) : (
          notes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium">
                      {note.primaryFocus}
                    </CardTitle>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {format(new Date(note.date), 'MMM d, yyyy')}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {note.duration} min
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Observations</h4>
                    <p className="text-sm text-muted-foreground">{note.observations}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium mb-1">Session Quality</h4>
                      <span className="text-sm capitalize text-muted-foreground">
                        {note.quality}
                      </span>
                    </div>
                    <div className="text-right">
                      <h4 className="font-medium mb-1">Progress</h4>
                      <p className="text-sm text-muted-foreground">{note.progress}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}