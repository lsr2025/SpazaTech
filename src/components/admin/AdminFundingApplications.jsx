import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { DollarSign, Search, CheckCircle2, XCircle, Clock, Eye, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

const STATUS_COLORS = {
  draft: 'bg-slate-100 text-slate-600',
  submitted: 'bg-blue-100 text-blue-700',
  under_review: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
  disbursed: 'bg-purple-100 text-purple-700',
};

const STATUS_ICONS = { approved: CheckCircle2, rejected: XCircle, under_review: Clock, disbursed: DollarSign };

export default function AdminFundingApplications({ currentUser }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [reviewNotes, setReviewNotes] = useState({});
  const queryClient = useQueryClient();

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['fundingApplications'],
    queryFn: () => base44.entities.FundingApplication.list('-created_date'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.FundingApplication.update(id, data),
    onSuccess: async (_, { id, data }) => {
      await base44.entities.AuditLog.create({ user_email: currentUser?.email, user_name: currentUser?.full_name, action: 'update', entity_type: 'FundingApplication', entity_id: id, description: `Updated funding application status to "${data.status}"`, severity: 'info' });
      queryClient.invalidateQueries({ queryKey: ['fundingApplications'] });
    },
  });

  const handleStatusChange = (app, newStatus) => {
    updateMutation.mutate({ id: app.id, data: { status: newStatus, reviewer_email: currentUser?.email, reviewer_name: currentUser?.full_name, review_date: new Date().toISOString().split('T')[0], review_notes: reviewNotes[app.id] || '' } });
  };

  const filtered = applications.filter(a => {
    const matchSearch = a.shop_name?.toLowerCase().includes(search.toLowerCase()) || a.owner_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = { total: applications.length, submitted: applications.filter(a => a.status === 'submitted').length, approved: applications.filter(a => a.status === 'approved').length, disbursed: applications.filter(a => a.status === 'disbursed').length };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'from-[#0ea5e9] to-[#3b82f6]' },
          { label: 'Awaiting Review', value: stats.submitted, color: 'from-amber-500 to-orange-500' },
          { label: 'Approved', value: stats.approved, color: 'from-emerald-500 to-teal-500' },
          { label: 'Disbursed', value: stats.disbursed, color: 'from-purple-500 to-violet-500' },
        ].map(s => (
          <div key={s.label} className="bg-[#e8ecf1] rounded-2xl shadow-[6px_6px_12px_#c5c9ce,-6px_-6px_12px_#ffffff] p-4 text-center">
            <div className={`text-2xl font-bold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-[#e8ecf1] rounded-3xl shadow-[8px_8px_16px_#c5c9ce,-8px_-8px_16px_#ffffff] p-6">
        <div className="flex flex-wrap items-center gap-3 mb-0">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mr-auto">
            <DollarSign className="w-5 h-5 text-[#0ea5e9]" /> Funding Applications
            <Badge className="bg-slate-200 text-slate-600">{filtered.length}</Badge>
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-[#e8ecf1] border-0 shadow-[inset_4px_4px_8px_#c5c9ce,inset_-4px_-4px_8px_#ffffff] rounded-xl w-44" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-xl bg-[#e8ecf1] shadow-[inset_3px_3px_6px_#c5c9ce,inset_-3px_-3px_6px_#ffffff] text-slate-700 border-0 outline-none text-sm">
            <option value="all">All Status</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="disbursed">Disbursed</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-10 text-slate-400"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-slate-400 bg-[#e8ecf1] rounded-3xl shadow-[8px_8px_16px_#c5c9ce,-8px_-8px_16px_#ffffff]">No funding applications found</div>
        ) : filtered.map(app => {
          const isExpanded = expanded === app.id;
          return (
            <div key={app.id} className="bg-[#e8ecf1] rounded-2xl shadow-[6px_6px_12px_#c5c9ce,-6px_-6px_12px_#ffffff] overflow-hidden">
              <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setExpanded(isExpanded ? null : app.id)}>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{app.shop_name}</p>
                  <p className="text-xs text-slate-500">{app.owner_name} · {app.funding_type?.replace(/_/g, ' ')} · R{app.amount_requested?.toLocaleString() || '—'}</p>
                </div>
                <Badge className={`${STATUS_COLORS[app.status] || 'bg-slate-100 text-slate-600'} flex-shrink-0`}>{app.status?.replace(/_/g, ' ')}</Badge>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
              </div>
              {isExpanded && (
                <div className="border-t border-slate-200 p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-slate-500">Applied:</span> <span className="font-medium">{app.application_date || '—'}</span></div>
                    <div><span className="text-slate-500">NEF Eligible:</span> <span className="font-medium">{app.nef_eligible ? 'Yes' : 'No'}</span></div>
                    <div><span className="text-slate-500">Amount Requested:</span> <span className="font-medium">R{app.amount_requested?.toLocaleString() || '—'}</span></div>
                    <div><span className="text-slate-500">Amount Approved:</span> <span className="font-medium">{app.amount_approved ? `R${app.amount_approved.toLocaleString()}` : '—'}</span></div>
                  </div>
                  {app.review_notes && <p className="text-sm text-slate-600 bg-[#e8ecf1] rounded-xl px-3 py-2 shadow-[inset_2px_2px_4px_#c5c9ce]">{app.review_notes}</p>}
                  <textarea
                    placeholder="Add review notes…"
                    value={reviewNotes[app.id] || ''}
                    onChange={e => setReviewNotes(v => ({ ...v, [app.id]: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-[#e8ecf1] shadow-[inset_3px_3px_6px_#c5c9ce,inset_-3px_-3px_6px_#ffffff] border-0 outline-none text-sm resize-none h-20"
                  />
                  <div className="flex flex-wrap gap-2">
                    {['under_review', 'approved', 'rejected', 'disbursed'].filter(s => s !== app.status).map(s => (
                      <Button key={s} size="sm" onClick={() => handleStatusChange(app, s)} disabled={updateMutation.isPending} className={`rounded-xl border-0 text-xs ${s === 'approved' ? 'bg-emerald-500 text-white' : s === 'rejected' ? 'bg-red-500 text-white' : s === 'disbursed' ? 'bg-purple-500 text-white' : 'bg-[#e8ecf1] text-slate-700 shadow-[3px_3px_6px_#c5c9ce,-3px_-3px_6px_#ffffff]'}`}>
                        Mark {s.replace(/_/g, ' ')}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}