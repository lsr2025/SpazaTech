/**
 * Copyright © 2026 Kwahlelwa Group (Pty) Ltd.
 * All Rights Reserved.
 */
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users, ChevronRight, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const WAGE_COLORS = {
  'Ordinary participant (full day)': 'bg-cyan-500/20 text-cyan-400',
  'Ordinary Participant (half day)': 'bg-blue-500/20 text-blue-400',
  'Field Supervisor': 'bg-amber-500/20 text-amber-400',
  'District Co-Ordinator': 'bg-purple-500/20 text-purple-400',
  'Thematic Co-Ordinator': 'bg-rose-500/20 text-rose-400',
  'M&E administrator': 'bg-emerald-500/20 text-emerald-400',
};

export default function Participants() {
  const [search, setSearch] = useState('');
  const [filterWage, setFilterWage] = useState('all');
  const [filterLocality, setFilterLocality] = useState('all');

  const { data: participants = [], isLoading } = useQuery({
    queryKey: ['participants'],
    queryFn: () => base44.entities.Participant.list('-created_date', 1000),
  });

  const localities = [...new Set(participants.map(p => p.currentLocalityName).filter(Boolean))].sort();

  const filtered = participants.filter(p => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.firstname?.toLowerCase().includes(q) ||
      p.surname?.toLowerCase().includes(q) ||
      p.idnumber?.includes(q) ||
      p.currentLocalityName?.toLowerCase().includes(q);
    const matchWage = filterWage === 'all' || p.currentWageLabel === filterWage;
    const matchLocality = filterLocality === 'all' || p.currentLocalityName === filterLocality;
    return matchSearch && matchWage && matchLocality;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-6 pb-24 lg:pb-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-3xl font-bold text-white tracking-tight">Participants</h1>
        <p className="text-slate-400 mt-1">Enterprise iLembe & Msinsi Workstreams — {participants.length} total</p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search by name, ID or locality..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
          />
        </div>
        <Select value={filterWage} onValueChange={setFilterWage}>
          <SelectTrigger className="w-full md:w-56 bg-slate-800 border-slate-700 text-white">
            <Filter className="w-4 h-4 mr-2 text-slate-400" />
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all">All Roles</SelectItem>
            {Object.keys(WAGE_COLORS).map(w => (
              <SelectItem key={w} value={w}>{w}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterLocality} onValueChange={setFilterLocality}>
          <SelectTrigger className="w-full md:w-56 bg-slate-800 border-slate-700 text-white">
            <SelectValue placeholder="Locality" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 max-h-60 overflow-y-auto">
            <SelectItem value="all">All Localities</SelectItem>
            {localities.map(l => (
              <SelectItem key={l} value={l}>{l}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Count */}
      <p className="text-slate-500 text-sm mb-4">{filtered.length} participant{filtered.length !== 1 ? 's' : ''} found</p>

      {/* List */}
      {isLoading ? (
        <div className="text-center text-slate-400 py-20">Loading participants…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.01, 0.3) }}
            >
              <Link to={createPageUrl(`ParticipantDetail?id=${p.id}`)}>
                <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50 hover:border-cyan-500/50 transition-all cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-600 to-cyan-700 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold text-sm">
                            {p.firstname?.charAt(0)}{p.surname?.charAt(0)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-semibold truncate">{p.firstname} {p.surname}</p>
                          <p className="text-slate-500 text-xs truncate">{p.idnumber}</p>
                          <p className="text-slate-400 text-xs truncate">{p.currentLocalityName}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 ml-2 flex-shrink-0">
                        <Badge className={`text-xs ${WAGE_COLORS[p.currentWageLabel] || 'bg-slate-500/20 text-slate-400'}`}>
                          {p.currentWageLabel?.includes('Ordinary') ? 'Participant' : p.currentWageLabel || 'N/A'}
                        </Badge>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No participants found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}