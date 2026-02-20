import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Settings, Shield, Database, Bell, FileText, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminSettings({ currentUser }) {
  const queryClient = useQueryClient();
  const [localValues, setLocalValues] = useState({});
  const [saved, setSaved] = useState(false);

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ['systemSettings'],
    queryFn: () => base44.entities.SystemSetting.list(),
  });

  // Sync entity data into local state
  useEffect(() => {
    const map = {};
    settings.forEach(s => { map[s.setting_key] = s.setting_value; });
    setLocalValues(map);
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      for (const [key, value] of Object.entries(localValues)) {
        const existing = settings.find(s => s.setting_key === key);
        if (existing) {
          await base44.entities.SystemSetting.update(existing.id, { setting_value: String(value), updated_by_email: currentUser?.email });
        } else {
          await base44.entities.SystemSetting.create({ setting_key: key, setting_value: String(value), updated_by_email: currentUser?.email });
        }
      }
      await base44.entities.AuditLog.create({ user_email: currentUser?.email, user_name: currentUser?.full_name, action: 'update', entity_type: 'SystemSetting', description: 'Updated system settings', severity: 'warning' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systemSettings'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  const FIELD_GROUPS = [
    {
      label: 'General', icon: Settings,
      fields: [
        { key: 'app_name', label: 'Application Name', type: 'text' },
        { key: 'compliance_threshold', label: 'Compliance Threshold (%)', type: 'number' },
        { key: 'inspection_interval_days', label: 'Inspection Interval (days)', type: 'number' },
        { key: 'max_upload_size_mb', label: 'Max Upload Size (MB)', type: 'number' },
      ],
    },
    {
      label: 'POPIA & Retention', icon: Shield,
      fields: [
        { key: 'inactive_shop_retention_years', label: 'Inactive Shop Retention (years)', type: 'number' },
        { key: 'audit_log_retention_years', label: 'Audit Log Retention (years)', type: 'number' },
      ],
    },
    {
      label: 'Notifications', icon: Bell,
      fields: [
        { key: 'notify_on_export', label: 'Notify admins on export', type: 'boolean' },
        { key: 'notify_on_bulk_delete', label: 'Notify admins on bulk delete', type: 'boolean' },
      ],
    },
  ];

  if (isLoading) return <div className="text-center py-12 text-slate-400"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />Loading settings…</div>;

  return (
    <div className="space-y-6">
      {FIELD_GROUPS.map(group => {
        const Icon = group.icon;
        return (
          <div key={group.label} className="bg-[#e8ecf1] rounded-3xl shadow-[8px_8px_16px_#c5c9ce,-8px_-8px_16px_#ffffff] p-6">
            <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Icon className="w-5 h-5 text-[#0ea5e9]" /> {group.label}
            </h2>
            <div className="space-y-4">
              {group.fields.map(field => (
                <div key={field.key} className="flex items-center gap-4 flex-wrap">
                  <label className="w-64 text-sm font-medium text-slate-700 flex-shrink-0">{field.label}</label>
                  {field.type === 'boolean' ? (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div
                        className={`w-10 h-6 rounded-full relative transition-all ${localValues[field.key] === 'true' ? 'bg-[#0ea5e9]' : 'bg-slate-300'}`}
                        onClick={() => setLocalValues(v => ({ ...v, [field.key]: v[field.key] === 'true' ? 'false' : 'true' }))}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${localValues[field.key] === 'true' ? 'left-5' : 'left-1'}`} />
                      </div>
                      <span className="text-sm text-slate-500">{localValues[field.key] === 'true' ? 'Enabled' : 'Disabled'}</span>
                    </label>
                  ) : (
                    <Input
                      type={field.type}
                      value={localValues[field.key] ?? ''}
                      onChange={e => setLocalValues(v => ({ ...v, [field.key]: e.target.value }))}
                      className="max-w-xs bg-[#e8ecf1] border-0 shadow-[inset_4px_4px_8px_#c5c9ce,inset_-4px_-4px_8px_#ffffff] rounded-xl"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="flex items-center gap-3">
        <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="bg-gradient-to-r from-[#0ea5e9] to-[#3b82f6] text-white border-0 rounded-xl shadow-[4px_4px_8px_#c5c9ce] gap-2">
          {saveMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : <><FileText className="w-4 h-4" /> Save Settings</>}
        </Button>
        {saved && <span className="text-sm text-emerald-600 flex items-center gap-1"><Check className="w-4 h-4" /> Saved to database</span>}
      </div>

      <div className="bg-[#e8ecf1] rounded-3xl shadow-[8px_8px_16px_#c5c9ce,-8px_-8px_16px_#ffffff] p-6">
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-500" /> POPIA Compliance Status
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {['Consent management', 'Data minimization', 'Purpose specification', 'Security safeguards', 'Data subject rights', 'Audit logging & accountability'].map(item => (
            <div key={item} className="flex items-center gap-2 text-sm text-slate-700">
              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> {item}
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 rounded-2xl bg-[#e8ecf1] shadow-[inset_3px_3px_6px_#c5c9ce,inset_-3px_-3px_6px_#ffffff] text-sm text-slate-600 space-y-1">
          <p><strong>Active shop data:</strong> Indefinite (while business operates)</p>
          <p><strong>Inactive shop data:</strong> {localValues['inactive_shop_retention_years'] || 7} years (tax compliance)</p>
          <p><strong>Audit logs:</strong> {localValues['audit_log_retention_years'] || 5} years (regulatory requirement)</p>
          <p><strong>User accounts:</strong> 1 year after last login</p>
        </div>
      </div>
    </div>
  );
}