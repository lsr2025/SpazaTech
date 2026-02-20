import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from 'lucide-react';

export default function AdminAuditLogs() {
  return (
    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-400" />
          Audit Logs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-400 text-sm">Audit log functionality coming soon.</p>
      </CardContent>
    </Card>
  );
}