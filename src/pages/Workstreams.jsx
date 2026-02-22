/**
 * Copyright © 2026 Kwahlelwa Group (Pty) Ltd.
 * All Rights Reserved.
 */
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, Users, MapPin, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const MUNICIPALITIES = ['KwaDukuza', 'Mandeni', 'Ndwedwe', 'Maphumulo', 'Multiple', 'N/A'];

const EMPTY_FORM = {
  name: '',
  description: '',
  municipality: 'Multiple',
  status: 'active',
  coordinator_name: '',
  coordinator_email: '',
};

function WorkstreamForm({ initial, onSave, onCancel, loading }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const set = field => e => setForm(f => ({ ...f, [field]: e.target ? e.target.value : e }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-slate-400 text-xs uppercase tracking-wider mb-1 block">Name *</label>
          <Input value={form.name} onChange={set('name')} placeholder="e.g. ILEMBE" className="bg-slate-800 border-slate-700 text-white" />
        </div>
        <div>
          <label className="text-slate-400 text-xs uppercase tracking-wider mb-1 block">Status</label>
          <Select value={form.status} onValueChange={set('status')}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <label className="text-slate-400 text-xs uppercase tracking-wider mb-1 block">Description</label>
        <Input value={form.description} onChange={set('description')} placeholder="Brief description..." className="bg-slate-800 border-slate-700 text-white" />
      </div>
      <div>
        <label className="text-slate-400 text-xs uppercase tracking-wider mb-1 block">Municipality</label>
        <Select value={form.municipality} onValueChange={set('municipality')}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {MUNICIPALITIES.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-slate-400 text-xs uppercase tracking-wider mb-1 block">Coordinator Name</label>
          <Input value={form.coordinator_name} onChange={set('coordinator_name')} placeholder="Full name" className="bg-slate-800 border-slate-700 text-white" />
        </div>
        <div>
          <label className="text-slate-400 text-xs uppercase tracking-wider mb-1 block">Coordinator Email</label>
          <Input value={form.coordinator_email} onChange={set('coordinator_email')} placeholder="email@example.com" className="bg-slate-800 border-slate-700 text-white" />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" onClick={onCancel} className="border-slate-700 text-slate-300 hover:bg-slate-800">
          <X className="w-4 h-4 mr-1" /> Cancel
        </Button>
        <Button onClick={() => onSave(form)} disabled={loading || !form.name.trim()} className="bg-cyan-600 hover:bg-cyan-700">
          <Save className="w-4 h-4 mr-1" /> {loading ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </div>
  );
}

export default function Workstreams() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { data: workstreams = [], isLoading } = useQuery({
    queryKey: ['workstreams'],
    queryFn: () => base44.entities.Workstream.list('-created_date'),
  });

  const { data: participants = [] } = useQuery({
    queryKey: ['participants-ws'],
    queryFn: () => base44.entities.Participant.list('-created_date', 2000),
  });

  const participantCounts = participants.reduce((acc, p) => {
    if (p.workstream_id) acc[p.workstream_id] = (acc[p.workstream_id] || 0) + 1;
    return acc;
  }, {});

  const createMutation = useMutation({
    mutationFn: data => base44.entities.Workstream.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workstreams'] });
      setShowCreate(false);
      toast.success('Workstream created');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Workstream.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workstreams'] });
      setEditingId(null);
      toast.success('Workstream updated');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: id => base44.entities.Workstream.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workstreams'] });
      setDeleteId(null);
      toast.success('Workstream deleted');
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-6 pb-24 lg:pb-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Workstreams</h1>
          <p className="text-slate-400 mt-1">{workstreams.length} workstream{workstreams.length !== 1 ? 's' : ''} configured</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="bg-cyan-600 hover:bg-cyan-700 gap-2">
          <Plus className="w-4 h-4" /> New Workstream
        </Button>
      </motion.div>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Create Workstream</DialogTitle>
          </DialogHeader>
          <WorkstreamForm
            onSave={data => createMutation.mutate(data)}
            onCancel={() => setShowCreate(false)}
            loading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingId} onOpenChange={open => !open && setEditingId(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Workstream</DialogTitle>
          </DialogHeader>
          <WorkstreamForm
            initial={editingData}
            onSave={data => updateMutation.mutate({ id: editingId, data })}
            onCancel={() => setEditingId(null)}
            loading={updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Workstream?</DialogTitle>
          </DialogHeader>
          <p className="text-slate-400 text-sm">This cannot be undone. Participants linked to this workstream will lose their assignment.</p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)} className="border-slate-700 text-slate-300">Cancel</Button>
            <Button onClick={() => deleteMutation.mutate(deleteId)} disabled={deleteMutation.isPending} className="bg-red-600 hover:bg-red-700">
              {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cards */}
      {isLoading ? (
        <div className="text-center text-slate-400 py-20">Loading…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {workstreams.map((ws, i) => (
              <motion.div
                key={ws.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50 hover:border-cyan-500/40 transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-white text-xl">{ws.name}</CardTitle>
                        {ws.description && <p className="text-slate-400 text-sm mt-1">{ws.description}</p>}
                      </div>
                      <Badge className={ws.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-500/20 text-slate-400'}>
                        {ws.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Users className="w-4 h-4 text-cyan-400" />
                        <span className="font-semibold">{participantCounts[ws.id] || 0}</span>
                        <span className="text-slate-500">participants</span>
                      </div>
                      {ws.municipality && (
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="text-xs">{ws.municipality}</span>
                        </div>
                      )}
                    </div>
                    {ws.coordinator_name && (
                      <p className="text-slate-500 text-xs">Coordinator: <span className="text-slate-300">{ws.coordinator_name}</span></p>
                    )}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-700/50">
                      <Link to={createPageUrl(`Participants`)} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full border-slate-700 text-slate-300 hover:bg-slate-700 text-xs">
                          View Participants
                        </Button>
                      </Link>
                      <Button
                        variant="ghost" size="icon"
                        onClick={() => { setEditingId(ws.id); setEditingData({ ...ws }); }}
                        className="text-slate-400 hover:text-cyan-400 hover:bg-slate-700"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost" size="icon"
                        onClick={() => setDeleteId(ws.id)}
                        className="text-slate-400 hover:text-red-400 hover:bg-slate-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}