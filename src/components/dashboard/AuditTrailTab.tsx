'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Clock, 
  User, 
  FileCode, 
  Filter, 
  CheckCircle,
  Database,
  Lock,
  ShieldCheck,
  Hash
} from 'lucide-react';
import { AuditLog, School } from '@/types';

interface AuditTrailTabProps {
  activeSchool: School;
  auditLogs: AuditLog[];
}

export function AuditTrailTab({ activeSchool, auditLogs }: AuditTrailTabProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedActionFilter, setSelectedActionFilter] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.payload.reason && log.payload.reason.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter = selectedActionFilter === 'ALL' || log.action === selectedActionFilter;

    return matchesSearch && matchesFilter;
  });

  const actions = Array.from(new Set(auditLogs.map(l => l.action)));

  return (
    <div className="space-y-6">
      {/* Title Card */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200/90 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>Immutable Governance & Regulatory Ledger</span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              Audit Trail & Cryptographic Traceability Register
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Strict multi-tenant audit compliance: Every attendance roll call, grade change, and roster ingestion is cryptographically signed with actor ID and timestamp.
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start md:self-center">
            <span className="text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>APPEND-ONLY IMMUTABLE LEDGER</span>
            </span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search actor, action, or target entity..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all shadow-xs"
              />
            </div>

            <select
              value={selectedActionFilter}
              onChange={(e) => setSelectedActionFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-xs cursor-pointer transition-all"
            >
              <option value="ALL">All Event Types</option>
              {actions.map(act => (
                <option key={act} value={act}>{act}</option>
              ))}
            </select>
          </div>

          <span className="text-xs font-mono text-slate-500 bg-slate-100/80 px-3 py-1 rounded-full border border-slate-200/60 font-semibold">
            Showing <strong className="text-slate-900">{filteredLogs.length}</strong> audited ledger blocks
          </span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="glass-card rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100/70 text-slate-700 font-bold border-b border-slate-200/80 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Timestamp (UTC)</th>
                <th className="px-5 py-3.5">Authorizing Actor</th>
                <th className="px-5 py-3.5">Action Event</th>
                <th className="px-5 py-3.5">Target Entity</th>
                <th className="px-5 py-3.5">Compliance Diff Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-indigo-50/25 transition-colors">
                  <td className="px-5 py-4 text-slate-500 whitespace-nowrap text-[11px]">
                    <div className="flex items-center space-x-1.5 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{log.timestamp.replace('T', ' ').substring(0, 19)}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-sans">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-800 shrink-0">
                        {log.actorName[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{log.actorName}</p>
                        <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                          {log.actorRole.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1 border ${
                      log.action.includes('CORRECTED') || log.action.includes('ADJUSTMENT') 
                        ? 'bg-amber-100 text-amber-900 border-amber-300' 
                        : log.action.includes('FINALIZED') || log.action.includes('PUBLISHED')
                        ? 'bg-purple-100 text-purple-900 border-purple-300'
                        : 'bg-blue-100 text-blue-900 border-blue-300'
                    }`}>
                      <Hash className="w-3 h-3" />
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-800 font-semibold">
                    {log.target}
                  </td>
                  <td className="px-5 py-4 text-slate-600 font-sans">
                    <div className="space-y-1.5 max-w-lg">
                      {log.payload.reason && (
                        <p className="font-medium text-slate-800 text-xs italic">
                          &quot;{log.payload.reason}&quot;
                        </p>
                      )}
                      {log.payload.previous && (
                        <div className="text-[10px] font-mono bg-rose-50 border border-rose-200 text-rose-900 p-2 rounded-xl">
                          <span className="font-bold">Prior State: </span>
                          {JSON.stringify(log.payload.previous)}
                        </div>
                      )}
                      {log.payload.current && (
                        <div className="text-[10px] font-mono bg-emerald-50 border border-emerald-200 text-emerald-900 p-2 rounded-xl">
                          <span className="font-bold">Committed State: </span>
                          {JSON.stringify(log.payload.current)}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-slate-500 text-xs font-sans">
                    No matching audit log records found for the applied filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
