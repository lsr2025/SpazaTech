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
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Users,
  Plus,
  MapPin,
  ArrowLeft,
  Loader2,
  Edit,
  UserPlus
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function TeamManagement() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  
  const [formData, setFormData] = useState({
    team_name: '',
    assigned_municipalities: [],
    assigned_wards: [],
    team_members: [],
    notes: ''
  });

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const { data: teams = [] } = useQuery({
    queryKey: ['teams', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      return await base44.entities.Team.filter({ supervisor_email: user.email }, '-created_date', 100);
    },
    enabled: !!user?.email
  });

  const { data: agents = [] } = useQuery({
    queryKey: ['field-agents'],
    queryFn: () => base44.entities.FieldAgent.list('-created_date', 500)
  });

  const createTeam = useMutation({
    mutationFn: async (data) => {
      return await base44.entities.Team.create({
        ...data,
        supervisor_email: user.email,
        supervisor_name: user.full_name || user.email,
        status: 'active'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      resetForm();
    }
  });

  const updateTeam = useMutation({
    mutationFn: async ({ id, data }) => {
      return await base44.entities.Team.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      resetForm();
    }
  });

  const resetForm = () => {
    setDialogOpen(false);
    setEditingTeam(null);
    setFormData({
      team_name: '',
      assigned_municipalities: [],
      assigned_wards: [],
      team_members: [],
      notes: ''
    });
  };

  const handleEdit = (team) => {
    setEditingTeam(team);
    setFormData({
      team_name: team.team_name,
      assigned_municipalities: team.assigned_municipalities || [],
      assigned_wards: team.assigned_wards || [],
      team_members: team.team_members || [],
      notes: team.notes || ''
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTeam) {
      updateTeam.mutate({ id: editingTeam.id, data: formData });
    } else {
      createTeam.mutate(formData);
    }
  };

  const toggleMunicipality = (mun) => {
    setFormData(prev => ({
      ...prev,
      assigned_municipalities: prev.assigned_municipalities.includes(mun)
        ? prev.assigned_municipalities.filter(m => m !== mun)
        : [...prev.assigned_municipalities, mun]
    }));
  };

  const toggleTeamMember = (agent) => {
    setFormData(prev => {
      const exists = prev.team_members.find(m => m.agent_email === agent.user_email);
      if (exists) {
        return {
          ...prev,
          team_members: prev.team_members.filter(m => m.agent_email !== agent.user_email)
        };
      } else {
        return {
          ...prev,
          team_members: [
            ...prev.team_members,
            {
              agent_email: agent.user_email,
              agent_name: agent.full_name,
              role: 'member'
            }
          ]
        };
      }
    });
  };

  const municipalities = ['KwaDukuza', 'Mandeni', 'Ndwedwe', 'Maphumulo'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to={createPageUrl('HRDashboard')}>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Team Management</h1>
              <p className="text-slate-400 text-sm">Organize field agents into teams</p>
            </div>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700 gap-2" onClick={() => setEditingTeam(null)}>
                <Plus className="w-4 h-4" />
                Create Team
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingTeam ? 'Edit Team' : 'Create New Team'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Team Name</Label>
                  <Input
                    value={formData.team_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, team_name: e.target.value }))}
                    className="bg-slate-800 border-slate-700 text-white"
                    placeholder="e.g., KwaDukuza Team A"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Assigned Municipalities</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {municipalities.map(mun => (
                      <div
                        key={mun}
                        onClick={() => toggleMunicipality(mun)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          formData.assigned_municipalities.includes(mun)
                            ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                      >
                        {mun}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Ward Numbers (comma-separated)</Label>
                  <Input
                    value={formData.assigned_wards.join(', ')}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      assigned_wards: e.target.value.split(',').map(w => w.trim()).filter(Boolean)
                    }))}
                    className="bg-slate-800 border-slate-700 text-white"
                    placeholder="e.g., 1, 2, 3"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Team Members ({formData.team_members.length} selected)</Label>
                  <div className="max-h-48 overflow-y-auto border border-slate-700 rounded-lg p-2 space-y-1">
                    {agents.map(agent => (
                      <div
                        key={agent.id}
                        onClick={() => toggleTeamMember(agent)}
                        className={`p-2 rounded cursor-pointer transition-all ${
                          formData.team_members.find(m => m.agent_email === agent.user_email)
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <UserPlus className="w-4 h-4" />
                          <span className="text-sm">{agent.full_name}</span>
                          <span className="text-xs text-slate-500">({agent.municipality})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Notes</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="bg-slate-800 border-slate-700 text-white"
                    placeholder="Additional notes about this team..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={resetForm} className="border-slate-600">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!formData.team_name || createTeam.isPending || updateTeam.isPending}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {(createTeam.isPending || updateTeam.isPending) ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : editingTeam ? 'Update Team' : 'Create Team'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.length === 0 ? (
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50 col-span-2">
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg mb-2">No teams created yet</p>
                <p className="text-slate-500 text-sm">Create your first team to organize field agents</p>
              </CardContent>
            </Card>
          ) : (
            teams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50 hover:border-cyan-500/50 transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white text-lg">{team.team_name}</CardTitle>
                        <Badge className={
                          team.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-400 mt-2'
                            : 'bg-slate-500/20 text-slate-400 mt-2'
                        }>
                          {team.status}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(team)}
                        className="text-slate-400 hover:text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-slate-400 text-xs mb-2">Team Members</p>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-cyan-400" />
                        <span className="text-white font-semibold">
                          {team.team_members?.length || 0} agents
                        </span>
                      </div>
                    </div>

                    {team.assigned_municipalities && team.assigned_municipalities.length > 0 && (
                      <div>
                        <p className="text-slate-400 text-xs mb-2">Coverage Area</p>
                        <div className="flex flex-wrap gap-1">
                          {team.assigned_municipalities.map(mun => (
                            <Badge key={mun} className="bg-cyan-500/20 text-cyan-400 text-xs">
                              {mun}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {team.assigned_wards && team.assigned_wards.length > 0 && (
                      <div>
                        <p className="text-slate-400 text-xs mb-1">Wards</p>
                        <p className="text-slate-300 text-sm">{team.assigned_wards.join(', ')}</p>
                      </div>
                    )}

                    <Link to={createPageUrl(`TaskAssignment?team_id=${team.id}`)}>
                      <Button className="w-full bg-red-600 hover:bg-red-700 mt-3">
                        Assign Tasks
                      </Button>
                    </Link>
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