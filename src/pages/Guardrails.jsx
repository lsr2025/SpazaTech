/**
 * Copyright © 2026 Kwahlelwa Group (Pty) Ltd.
 * All Rights Reserved.
 * AfriEconomy Tech™ — Application Security Guardrails
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckSquare, Package, Code, Key, GitBranch, AlertTriangle, TestTube, Lock } from 'lucide-react';

const sections = [
  {
    id: 'A',
    title: 'Runtime & Framework',
    icon: Code,
    color: 'from-blue-500 to-blue-700',
    items: [
      { id: 'A1', label: 'Supported Runtime', detail: 'Application targets React 18.x (^18.2.0) and Deno for backend functions. No unsupported runtimes.' },
      { id: 'A2', label: 'Runtime End-of-Life', detail: 'Runtime versions must not be within 6 months of EOL. Reviewed quarterly.' },
      { id: 'A3', label: 'No Deprecated Frameworks', detail: 'Do not introduce frameworks flagged as deprecated by their maintainers.' },
      { id: 'A4', label: 'No Obsolete Language Features', detail: 'ES2020+ syntax required. No var, no legacy CommonJS require() in frontend. Backend uses Deno ESM imports.' },
    ]
  },
  {
    id: 'B',
    title: 'Third-Party Dependencies',
    icon: Package,
    color: 'from-purple-500 to-purple-700',
    items: [
      { id: 'B1', label: 'Documented Dependency List', detail: 'All dependencies appear in package.json. No ad-hoc CDN script tags in production.' },
      { id: 'B2', label: 'Pinned Version Numbers', detail: 'All packages use semver with caret (^). No "latest", "*", or unversioned entries.' },
      { id: 'B3', label: 'No Abandoned Packages', detail: 'Packages with no maintenance activity for >24 months are prohibited unless formally risk-accepted.' },
      { id: 'B4', label: 'No Critical CVEs', detail: 'Run npm audit before every release. No unresolved Critical or High severity CVEs in production.' },
      { id: 'B5', label: 'No Floating Versions', detail: '"latest" or "*" as a version string is strictly prohibited.' },
    ]
  },
  {
    id: 'C',
    title: 'Secure Coding Practices',
    icon: Shield,
    color: 'from-green-500 to-green-700',
    items: [
      { id: 'C1', label: 'Parameterized Queries', detail: 'All data access goes through the Base44 SDK (base44.entities.*). No raw query string construction.' },
      { id: 'C2', label: 'No Dynamic SQL', detail: 'Dynamic string concatenation for queries is strictly prohibited.' },
      { id: 'C3', label: 'Server-Side Validation', detail: 'All critical validation must occur in backend functions (Deno). Client-side is UX-only.' },
      { id: 'C4', label: 'No Custom Cryptography', detail: 'Use platform-provided auth (Base44 Auth). Do not implement custom encryption, hashing, or token generation.' },
      { id: 'C5', label: 'No Custom Auth Logic', detail: 'Authentication and session management are handled exclusively by the Base44 platform.' },
      { id: 'C6', label: 'No Sensitive Data in Logs', detail: 'Never log passwords, ID numbers, signatures, API keys, or personal identifiers. console.log must be removed before production merge.' },
      { id: 'C7', label: 'No Stack Traces Exposed', detail: 'Backend functions must catch errors and return generic messages. Stack traces must never reach the frontend.' },
      { id: 'C8', label: 'Debug Mode Off in Production', detail: 'No debug: true, devtools: true, or development-only flags in production builds.' },
    ]
  },
  {
    id: 'D',
    title: 'Configuration & Secrets',
    icon: Key,
    color: 'from-yellow-500 to-orange-600',
    items: [
      { id: 'D1', label: 'No Hardcoded Credentials', detail: 'API keys, tokens, passwords, and secrets must never appear in source code.' },
      { id: 'D2', label: 'No Hardcoded Paths/Ports', detail: 'Environment-specific values (URLs, ports, bucket paths) must be in environment variables.' },
      { id: 'D3', label: 'Config Separated from Logic', detail: 'All secrets stored in the Base44 platform\'s secrets manager.' },
      { id: 'D4', label: 'Secrets Not in Repository', detail: '.env files with real values must never be committed. Use .env.example with placeholder values only.' },
    ]
  },
  {
    id: 'E',
    title: 'Version Control & Deployment',
    icon: GitBranch,
    color: 'from-teal-500 to-teal-700',
    items: [
      { id: 'E1', label: 'Approved Repository', detail: 'All code changes made through the Base44 platform editor or approved Git integration only.' },
      { id: 'E2', label: 'No Direct Production Edits', detail: 'Changes to production must go through the standard deployment pipeline. No manual file edits on live environment.' },
      { id: 'E3', label: 'Environment Separation', detail: 'Production and development/test environments are strictly separated. Test data must not enter production.' },
      { id: 'E4', label: 'Reproducible Builds', detail: 'The application must be fully reproducible from the repository without manual steps.' },
    ]
  },
  {
    id: 'F',
    title: 'Vulnerability Management',
    icon: AlertTriangle,
    color: 'from-red-500 to-red-700',
    items: [
      { id: 'F1', label: 'Issue Tracking', detail: 'All identified vulnerabilities must be logged in the project issue tracker with description and affected component.' },
      { id: 'F2', label: 'Severity Ratings', detail: 'Every vulnerability assigned a severity: Critical / High / Medium / Low using CVSS or equivalent.' },
      { id: 'F3', label: 'Critical Resolution Gate', detail: 'No release may proceed with unresolved Critical vulnerabilities. High requires documented risk acceptance.' },
      { id: 'F4', label: 'Root Cause Review', detail: 'Recurring vulnerability patterns must trigger a formal root cause analysis.' },
    ],
    extra: (
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-700">
              <th className="text-left p-2 text-slate-300 rounded-tl">Severity</th>
              <th className="text-left p-2 text-slate-300 rounded-tr">Resolution Target</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-600"><td className="p-2"><Badge className="bg-red-600">Critical</Badge></td><td className="p-2 text-slate-300">Before next release (blocking)</td></tr>
            <tr className="border-t border-slate-600"><td className="p-2"><Badge className="bg-orange-500">High</Badge></td><td className="p-2 text-slate-300">Within 7 days or risk-accepted</td></tr>
            <tr className="border-t border-slate-600"><td className="p-2"><Badge className="bg-yellow-500 text-black">Medium</Badge></td><td className="p-2 text-slate-300">Within 30 days</td></tr>
            <tr className="border-t border-slate-600"><td className="p-2"><Badge variant="outline" className="text-slate-300">Low</Badge></td><td className="p-2 text-slate-300">Next maintenance cycle</td></tr>
          </tbody>
        </table>
      </div>
    )
  },
  {
    id: 'G',
    title: 'Security Testing',
    icon: TestTube,
    color: 'from-indigo-500 to-indigo-700',
    items: [
      { id: 'G1', label: 'Static Analysis', detail: 'Run npm audit and linting (eslint with security rules) on every PR. Significant findings must be addressed.' },
      { id: 'G2', label: 'Findings Addressed', detail: 'All Critical and High static analysis findings must be resolved before merge.' },
      { id: 'G3', label: 'Security Review', detail: 'Features handling PII (ID numbers, photos, signatures, financial data) require a security review before release.' },
      { id: 'G4', label: 'Non-Production Testing', detail: 'All testing, including penetration testing, performed in the non-production environment only.' },
    ],
    extra: (
      <div className="mt-4 p-3 bg-slate-700 rounded-lg text-sm text-slate-300">
        <p className="font-semibold text-white mb-2">PII Fields Requiring Extra Review:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>owner_id_number</li>
          <li>owner_photo_url, shop_photo_url, owner_signature_url, fieldworker_signature_url</li>
          <li>bank_name, monthly_turnover</li>
          <li>All employee demographic fields</li>
        </ul>
      </div>
    )
  },
  {
    id: 'H',
    title: 'Secure Design Principles',
    icon: Lock,
    color: 'from-slate-500 to-slate-700',
    items: [
      { id: 'H1', label: 'Disable Unused Services', detail: 'Remove or disable any backend functions, integrations, or endpoints not actively used in production.' },
      { id: 'H2', label: 'Minimal Exposed Endpoints', detail: 'Backend functions must only expose routes required for current functionality. No "future use" endpoints in production.' },
      { id: 'H3', label: 'Least Privilege', detail: 'Backend functions use user-scoped SDK calls by default. base44.asServiceRole is used only when explicitly required and justified.' },
      { id: 'H4', label: 'No Client-Side Validation Only', detail: 'Form validation in the UI is supplementary. Critical business rules are computed server-side or via the SDK.' },
    ]
  },
];

export default function Guardrails() {
  const [checked, setChecked] = useState({});

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));

  const allItems = sections.flatMap(s => s.items);
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const progress = Math.round((checkedCount / allItems.length) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 p-6 shadow-xl">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Security Guardrails</h1>
            </div>
            <p className="text-slate-400 text-sm">AfriEconomy Tech™ — Kwahlelwa Group (Pty) Ltd</p>
            <p className="text-slate-500 text-xs mt-1">Mandatory standards for all contributors. Complete before every production release.</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{progress}%</div>
            <div className="text-slate-400 text-sm">{checkedCount} / {allItems.length} checks</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Sections */}
      {sections.map(section => {
        const Icon = section.icon;
        const sectionChecked = section.items.filter(i => checked[i.id]).length;
        return (
          <Card key={section.id} className="bg-slate-800 border-slate-700 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${section.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <CardTitle className="text-white text-base">
                    {section.id}. {section.title}
                  </CardTitle>
                </div>
                <Badge variant="outline" className={`text-xs ${sectionChecked === section.items.length ? 'border-green-500 text-green-400' : 'border-slate-500 text-slate-400'}`}>
                  {sectionChecked}/{section.items.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {section.items.map(item => (
                <div
                  key={item.id}
                  onClick={() => toggle(item.id)}
                  className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all border ${
                    checked[item.id]
                      ? 'bg-green-900/30 border-green-700'
                      : 'bg-slate-700/40 border-slate-600 hover:border-slate-400'
                  }`}
                >
                  <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border transition-all ${
                    checked[item.id] ? 'bg-green-500 border-green-500' : 'border-slate-500'
                  }`}>
                    {checked[item.id] && <CheckSquare className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">{item.id}</span>
                      <span className={`text-sm font-semibold ${checked[item.id] ? 'text-green-400 line-through' : 'text-white'}`}>
                        {item.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
              {section.extra}
            </CardContent>
          </Card>
        );
      })}

      {/* Footer */}
      <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-700">
        <p>© 2026 Kwahlelwa Group (Pty) Ltd. All Rights Reserved.</p>
        <p>AfriEconomy Tech™ is a trademark of Kwahlelwa Group. Patent Pending.</p>
      </div>
    </div>
  );
}