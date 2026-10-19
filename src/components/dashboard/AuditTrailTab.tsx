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
  Lock
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
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-rose-700 uppercase tracking-wider mb-1">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Immutable Governance & Regulatory Compliance Ledger</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Audit Logs & Data Traceability Registry
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Mandatory compliance tracking: Every attendance finalization, grade adjustment, and roster change is sealed with actor ID and timestamp.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>IMMUTABLE WRITE-ONLY LOG</span>
            </span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search actor, action, or target entity..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <select
              value={selectedActionFilter}
              onChange={(e) => setSelectedActionFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              <option value="ALL">All Logged Actions</option>
              {actions.map(act => (
                <option key={act} value={act}>{act}</option>
              ))}
            </select>
          </div>

          <span className="text-xs font-mono text-slate-500">
            Showing <span className="font-semibold text-slate-900">{filteredLogs.length}</span> audited events
          </span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3">Timestamp (UTC)</th>
                <th className="px-4 py-3">Authorizing Actor</th>
                <th className="px-4 py-3">Action Type</th>
                <th className="px-4 py-3">Target Entity</th>
                <th className="px-4 py-3">Audit Details & Diff Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-4 py-3 font-mono text-slate-500 whitespace-nowrap text-[11px]">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{log.timestamp.replace('T', ' ').substring(0, 19)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-700">
                        {log.actorName[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{log.actorName}</p>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                          {log.actorRole.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      log.action.includes('CORRECTED') || log.action.includes('ADJUSTMENT') 
                        ? 'bg-amber-100 text-amber-900' 
                        : log.action.includes('FINALIZED') || log.action.includes('PUBLISHED')
                        ? 'bg-purple-100 text-purple-900'
                        : 'bg-blue-100 text-blue-900'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-700 font-medium">
                    {log.target}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <div className="space-y-1">
                      {log.payload.reason && (
                        <p className="font-medium text-slate-800 text-[11px] italic">
                          &quot;{log.payload.reason}&quot;
                        </p>
                      )}
                      {log.payload.previous && (
                        <div className="text-[10px] font-mono bg-rose-50 border border-rose-200 text-rose-800 p-1.5 rounded">
                          <span className="font-bold">Prior State: </span>
                          {JSON.stringify(log.payload.previous)}
                        </div>
                      )}
                      {log.payload.current && (
                        <div className="text-[10px] font-mono bg-emerald-50 border border-emerald-200 text-emerald-800 p-1.5 rounded">
                          <span className="font-bold">Recorded State: </span>
                          {JSON.stringify(log.payload.current)}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500 text-xs">
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
