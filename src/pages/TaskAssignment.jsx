/**
 * Copyright © 2026 Kwahlelwa Group (Pty) Ltd.
 * All Rights Reserved.
 *
 * This source code is confidential and proprietary.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 *
 * Patent Pending - ZA Provisional Application
 */
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Plus,
  ArrowLeft,
  Loader2,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function TaskAssignment() {
  const [searchParams] = useSearchParams();
  const teamId = searchParams.get('team_id');
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    task_title: '',
    task_type: 'shop_profiling',
    description: '',
    assigned_to_type: 'team',
    assigned_agent_email: '',
    municipality: '',
    ward: '',
    due_date: '',
    priority: 'medium'
  });

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const { data: team } = useQuery({
    queryKey: ['team', teamId],
    queryFn: () => base44.entities.Team.get(teamId),
    enabled: !!teamId
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks', teamId],
    queryFn: async () => {
      if (teamId) {
        return await base44.entities.Task.filter({ assigned_team_id: teamId }, '-created_date', 100);
      } else {
        return await base44.entities.Task.filter({ supervisor_email: user.email }, '-created_date', 100);
      }
    },
    enabled: !!user?.email
  });

  const { data: agents = [] } = useQuery({
    queryKey: ['field-agents'],
    queryFn: () => base44.entities.FieldAgent.list('-created_date', 500)
  });

  const createTask = useMutation({
    mutationFn: async (data) => {
      const taskData = {
        ...data,
        supervisor_email: user.email,
        supervisor_name: user.full_name || user.email,
        status: 'assigned'
      };

      if (formData.assigned_to_type === 'team' && team) {
        taskData.assigned_team_id = team.id;
        taskData.assigned_team_name = team.team_name;
      } else if (formData.assigned_to_type === 'individual') {
        const agent = agents.find(a => a.user_email === formData.assigned_agent_email);
        taskData.assigned_agent_name = agent?.full_name || '';
      }

      return await base44.entities.Task.create(taskData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      resetForm();
    }
  });

  const resetForm = () => {
    setDialogOpen(false);
    setFormData({
      task_title: '',
      task_type: 'shop_profiling',
      description: '',
      assigned_to_type: 'team',
      assigned_agent_email: '',
      municipality: '',
      ward: '',
      due_date: '',
      priority: 'medium'
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createTask.mutate(formData);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400';
      case 'high': return 'bg-orange-500/20 text-orange-400';
      case 'medium': return 'bg-amber-500/20 text-amber-400';
      case 'low': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500/20 text-emerald-400';
      case 'in_progress': return 'bg-cyan-500/20 text-cyan-400';
      case 'assigned': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to={createPageUrl('TeamManagement')}>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Task Assignment</h1>
              {team && <p className="text-slate-400 text-sm">{team.team_name}</p>}
            </div>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700 gap-2">
                <Plus className="w-4 h-4" />
                Create Task
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Task</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Task Title</Label>
                  <Input
                    value={formData.task_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, task_title: e.target.value }))}
                    className="bg-slate-800 border-slate-700 text-white"
                    placeholder="e.g., Profile shops in Ward 3"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Task Type</Label>
                  <Select value={formData.task_type} onValueChange={(v) => setFormData(prev => ({ ...prev, task_type: v }))}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="shop_profiling">Shop Profiling</SelectItem>
                      <SelectItem value="inspection">Inspection</SelectItem>
                      <SelectItem value="follow_up">Follow Up</SelectItem>
                      <SelectItem value="data_capture">Data Capture</SelectItem>
                      <SelectItem value="verification">Verification</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-slate-800 border-slate-700 text-white"
                    placeholder="Detailed instructions..."
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Assign To</Label>
                  <Select value={formData.assigned_to_type} onValueChange={(v) => setFormData(prev => ({ ...prev, assigned_to_type: v }))}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="team">Entire Team</SelectItem>
                      <SelectItem value="individual">Individual Agent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.assigned_to_type === 'individual' && (
                  <div className="space-y-2">
                    <Label className="text-white">Select Agent</Label>
                    <Select value={formData.assigned_agent_email} onValueChange={(v) => setFormData(prev => ({ ...prev, assigned_agent_email: v }))}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue placeholder="Choose agent" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {agents.map(agent => (
                          <SelectItem key={agent.id} value={agent.user_email}>
                            {agent.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Municipality</Label>
                    <Select value={formData.municipality} onValueChange={(v) => setFormData(prev => ({ ...prev, municipality: v }))}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="KwaDukuza">KwaDukuza</SelectItem>
                        <SelectItem value="Mandeni">Mandeni</SelectItem>
                        <SelectItem value="Ndwedwe">Ndwedwe</SelectItem>
                        <SelectItem value="Maphumulo">Maphumulo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Ward</Label>
                    <Input
                      value={formData.ward}
                      onChange={(e) => setFormData(prev => ({ ...prev, ward: e.target.value }))}
                      className="bg-slate-800 border-slate-700 text-white"
                      placeholder="e.g., 3"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Due Date</Label>
                    <Input
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Priority</Label>
                    <Select value={formData.priority} onValueChange={(v) => setFormData(prev => ({ ...prev, priority: v }))}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={resetForm} className="border-slate-600">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!formData.task_title || createTask.isPending}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {createTask.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Task'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tasks List */}
        <div className="grid grid-cols-1 gap-4">
          {tasks.length === 0 ? (
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50">
              <CardContent className="p-12 text-center">
                <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg mb-2">No tasks assigned yet</p>
                <p className="text-slate-500 text-sm">Create your first task to get started</p>
              </CardContent>
            </Card>
          ) : (
            tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50 hover:border-cyan-500/50 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg mb-2">{task.task_title}</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge className={getStatusColor(task.status)}>
                            {task.status?.replace('_', ' ')}
                          </Badge>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Badge className="bg-slate-500/20 text-slate-400">
                            {task.task_type?.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {task.description && (
                      <p className="text-slate-300 text-sm mb-4">{task.description}</p>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-slate-400 text-xs mb-1">Assigned To</p>
                        <p className="text-white">{task.assigned_team_name || task.assigned_agent_name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs mb-1">Location</p>
                        <p className="text-white flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {task.municipality || 'N/A'}
                          {task.ward && ` - Ward ${task.ward}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs mb-1">Due Date</p>
                        <p className="text-white">{task.due_date || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs mb-1">Progress</p>
                        <p className="text-white">{task.progress_percentage || 0}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}