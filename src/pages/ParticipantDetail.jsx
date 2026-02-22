/**
 * Copyright © 2026 Kwahlelwa Group (Pty) Ltd.
 * All Rights Reserved.
 */
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Edit2, Save, X, User, Calendar, MapPin, Briefcase, Hash } from 'lucide-react';
import { motion } from 'framer-motion';

const WAGE_OPTIONS = [
  'Ordinary participant (full day)',
  'Ordinary Participant (half day)',
  'Field Supervisor',
  'District Co-Ordinator',
  'Thematic Co-Ordinator',
  'M&E administrator',
  'Other',
];

const STATUS_OPTIONS = ['active', 'inactive', 'on_leave'];

const WAGE_COLORS = {
  'Ordinary participant (full day)': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'Ordinary Participant (half day)': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Field Supervisor': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'District Co-Ordinator': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Thematic Co-Ordinator': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  'M&E administrator': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

const FieldRow = ({ icon: Icon, label, value, editing, children }) => (
  <div className="flex items-start gap-4 py-4 border-b border-slate-800 last:border-0">
    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon className="w-4 h-4 text-slate-400" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">{label}</p>
      {editing ? children : (
        <p className="text-white font-medium">{value || <span className="text-slate-600 italic">Not set</span>}</p>
      )}
    </div>
  </div>
);

export default function ParticipantDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  const queryClient = useQueryClient();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saved, setSaved] = useState(false);

  const { data: participant, isLoading } = useQuery({
    queryKey: ['participant', id],
    queryFn: () => base44.entities.Participant.filter({ id }),
    enabled: !!id,
    select: data => data[0],
  });

  useEffect(() => {
    if (participant) setForm({ ...participant });
  }, [participant]);

  const updateMutation = useMutation({
    mutationFn: data => base44.entities.Participant.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participant', id] });
      queryClient.invalidateQueries({ queryKey: ['participants'] });
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  const handleSave = () => {
    const { id: _id, created_date, updated_date, created_by, ...cleanData } = form;
    updateMutation.mutate(cleanData);
  };

  const handleCancel = () => {
    setForm({ ...participant });
    setEditing(false);
  };

  const set = field => e => setForm(f => ({ ...f, [field]: e.target ? e.target.value : e }));

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <p className="text-slate-400">Loading participant…</p>
    </div>
  );

  if (!participant) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <p className="text-slate-400">Participant not found.</p>
    </div>
  );

  const fullName = `${participant.firstname || ''} ${participant.surname || ''}`.trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-6 pb-24 lg:pb-6">
      {/* Back */}
      <Link to={createPageUrl('Participants')} className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors mb-6 text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Participants
      </Link>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-600 to-cyan-700 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-2xl">
                {participant.firstname?.charAt(0)}{participant.surname?.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{fullName}</h1>
              <p className="text-slate-400 text-sm mt-0.5">{participant.idnumber}</p>
              <Badge className={`mt-2 text-xs ${WAGE_COLORS[participant.currentWageLabel] || 'bg-slate-500/20 text-slate-400'}`}>
                {participant.currentWageLabel || 'N/A'}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {editing ? (
              <>
                <Button onClick={handleCancel} variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                  <X className="w-4 h-4 mr-1" /> Cancel
                </Button>
                <Button onClick={handleSave} size="sm" className="bg-cyan-600 hover:bg-cyan-700" disabled={updateMutation.isPending}>
                  <Save className="w-4 h-4 mr-1" /> {updateMutation.isPending ? 'Saving…' : 'Save'}
                </Button>
              </>
            ) : (
              <Button onClick={() => setEditing(true)} size="sm" className="bg-slate-700 hover:bg-slate-600 text-white">
                <Edit2 className="w-4 h-4 mr-1" /> Edit
              </Button>
            )}
          </div>
        </div>
        {saved && (
          <div className="mt-3 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm">
            ✓ Changes saved successfully
          </div>
        )}
      </motion.div>

      {/* Details Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white text-lg">Participant Details</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-slate-800">

            <FieldRow icon={Hash} label="ID Number" value={participant.idnumber} editing={editing}>
              <Input value={form.idnumber || ''} onChange={set('idnumber')} className="bg-slate-800 border-slate-700 text-white" />
            </FieldRow>

            <FieldRow icon={User} label="First Name" value={participant.firstname} editing={editing}>
              <Input value={form.firstname || ''} onChange={set('firstname')} className="bg-slate-800 border-slate-700 text-white" />
            </FieldRow>

            <FieldRow icon={User} label="Surname" value={participant.surname} editing={editing}>
              <Input value={form.surname || ''} onChange={set('surname')} className="bg-slate-800 border-slate-700 text-white" />
            </FieldRow>

            <FieldRow icon={Calendar} label="Contract Start Date" value={participant.contractStartDate} editing={editing}>
              <Input type="date" value={form.contractStartDate || ''} onChange={set('contractStartDate')} className="bg-slate-800 border-slate-700 text-white" />
            </FieldRow>

            <FieldRow icon={Briefcase} label="Role / Wage Label" value={participant.currentWageLabel} editing={editing}>
              <Select value={form.currentWageLabel || ''} onValueChange={set('currentWageLabel')}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {WAGE_OPTIONS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                </SelectContent>
              </Select>
            </FieldRow>

            <FieldRow icon={MapPin} label="Current Site Name" value={participant.currentSiteName} editing={editing}>
              <Input value={form.currentSiteName || ''} onChange={set('currentSiteName')} className="bg-slate-800 border-slate-700 text-white" />
            </FieldRow>

            <FieldRow icon={MapPin} label="Locality / Ward" value={participant.currentLocalityName} editing={editing}>
              <Input value={form.currentLocalityName || ''} onChange={set('currentLocalityName')} className="bg-slate-800 border-slate-700 text-white" />
            </FieldRow>

            <FieldRow icon={Briefcase} label="Status" value={participant.status} editing={editing}>
              <Select value={form.status || 'active'} onValueChange={set('status')}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {STATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>)}
                </SelectContent>
              </Select>
            </FieldRow>

          </CardContent>
        </Card>
      </motion.div>

      {/* Metadata */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-4">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <p className="text-slate-600 text-xs">Record ID: <span className="text-slate-500">{participant.id}</span></p>
            {participant.created_date && (
              <p className="text-slate-600 text-xs mt-1">Added: <span className="text-slate-500">{new Date(participant.created_date).toLocaleDateString()}</span></p>
            )}
            {participant.updated_date && (
              <p className="text-slate-600 text-xs mt-1">Last updated: <span className="text-slate-500">{new Date(participant.updated_date).toLocaleDateString()}</span></p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}