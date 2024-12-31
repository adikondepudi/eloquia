// /src/components/client/client-goals-section.tsx
import { useState } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, Calendar, CheckCircle2, Timer } from 'lucide-react';
import { TherapyGoal } from '@/types/enhanced-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ClientGoalsSectionProps {
  goals: TherapyGoal[];
  onAddGoal: (goal: Omit<TherapyGoal, 'id' | 'clientId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onUpdateGoal: (goalId: string, updates: Partial<TherapyGoal>) => Promise<void>;
}

export function ClientGoalsSection({
  goals,
  onAddGoal,
  onUpdateGoal
}: ClientGoalsSectionProps) {
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    description: '',
    category: 'fluency' as TherapyGoal['category'],
    status: 'not_started' as TherapyGoal['status'],
    targetDate: format(new Date().setMonth(new Date().getMonth() + 1), 'yyyy-MM-dd'),
    progress: 0,
    notes: []
  });

  const getStatusColor = (status: TherapyGoal['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/15 text-green-700 border-green-600/20';
      case 'in_progress':
        return 'bg-blue-500/15 text-blue-700 border-blue-600/20';
      case 'not_started':
        return 'bg-yellow-500/15 text-yellow-700 border-yellow-600/20';
      case 'cancelled':
        return 'bg-red-500/15 text-red-700 border-red-600/20';
      default:
        return 'bg-gray-500/15 text-gray-700 border-gray-600/20';
    }
  };

  const getCategoryIcon = (category: TherapyGoal['category']) => {
    switch (category) {
      case 'fluency':
        return <Target className="h-4 w-4" />;
      case 'articulation':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'voice':
        return <Timer className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const handleAddGoal = async () => {
    await onAddGoal(newGoal);
    setIsAddingGoal(false);
    setNewGoal({
      description: '',
      category: 'fluency',
      status: 'not_started',
      targetDate: format(new Date().setMonth(new Date().getMonth() + 1), 'yyyy-MM-dd'),
      progress: 0,
      notes: []
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Therapy Goals</h3>
        <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  placeholder="Enter goal description"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={newGoal.category}
                  onValueChange={(value) => setNewGoal({ ...newGoal, category: value as TherapyGoal['category'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fluency">Fluency</SelectItem>
                    <SelectItem value="articulation">Articulation</SelectItem>
                    <SelectItem value="voice">Voice</SelectItem>
                    <SelectItem value="language">Language</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Date</label>
                <Input
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                />
              </div>
              <Button onClick={handleAddGoal} className="w-full">
                Add Goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        <AnimatePresence>
          {goals.map((goal) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(goal.category)}
                      <CardTitle className="text-lg">{goal.description}</CardTitle>
                    </div>
                    <Badge className={getStatusColor(goal.status)}>
                      {goal.status.replace('_', ' ').charAt(0).toUpperCase() + 
                       goal.status.slice(1).replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Target Date:</span>
                        <span>{format(new Date(goal.targetDate), 'MMM d, yyyy')}</span>
                      </div>
                      <span className="text-muted-foreground">
                        Progress: {goal.progress}%
                      </span>
                    </div>
                    <Progress value={goal.progress} />
                    {goal.notes.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Notes:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {goal.notes.map((note, index) => (
                            <li key={index}>{note}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateGoal(goal.id, {
                          status: goal.status === 'completed' ? 'in_progress' : 'completed'
                        })}
                      >
                        {goal.status === 'completed' ? 'Reopen' : 'Mark Complete'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newProgress = Math.min(100, goal.progress + 10);
                          onUpdateGoal(goal.id, { progress: newProgress });
                        }}
                      >
                        Update Progress
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}