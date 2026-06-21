'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, FileText, Activity, Key, Check } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function ComplianceCenter() {
  const [activeSection, setActiveSection] = useState<'audit' | 'consent' | 'security'>('audit');

  // Premium compliance datasets
  const auditLogs = [
    { id: 'AUD-302', action: 'Biomarker Telemetry Decrypted', user: 'US-DEV-49A1', date: new Date(Date.now() - 1000 * 60 * 5).toISOString(), status: 'SUCCESS' },
    { id: 'AUD-305', action: 'Signed PDF Report Rendered', user: 'US-USER-082', date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), status: 'SUCCESS' },
    { id: 'AUD-308', action: 'SHA-256 Signature Generated', user: 'URO-SYSTEM', date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), status: 'SUCCESS' },
    { id: 'AUD-312', action: 'Clinical Dashboard Session Created', user: 'US-OPER-012', date: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), status: 'SUCCESS' },
  ];

  const consentActivity = [
    { id: 'CON-902', action: 'HIPAA Disclosure signed', user: 'Patient: Elena Vance', date: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), state: 'COMPLIANT' },
    { id: 'CON-905', action: 'Data Authorization extended', user: 'Patient: Marcus Thorne', date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), state: 'COMPLIANT' },
    { id: 'CON-908', action: 'End-user agreement signed', user: 'Operator: Sarah Connor', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), state: 'COMPLIANT' },
  ];

  const securityEvents = [
    { id: 'SEC-042', event: 'CLI Cryptographic Keys Rotation', origin: 'URO-CORE-INGEST', date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), severity: 'nominal' },
    { id: 'SEC-048', event: 'Authorized Command Level Access', origin: 'Admin Console (US-ADM-01)', date: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), severity: 'nominal' },
    { id: 'SEC-054', event: 'Database TLS Certificate Verification', origin: 'Database Sync Ingest', date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), severity: 'nominal' },
  ];

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.015)] select-none space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB]/60 pb-5">
        <div>
          <h3 className="font-display font-medium text-lg text-[#111827] tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#16A085]" />
            Security & HIPAA Compliance Center
          </h3>
          <p className="text-xs text-[#6B7280] font-light mt-0.5">
            Trace immutable audit logs, user clinical consents, and cryptographic security events.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'audit', label: 'Audit Logs', icon: Activity },
            { id: 'consent', label: 'Consent Activity', icon: FileText },
            { id: 'security', label: 'Security Stream', icon: Key },
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isSelected = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as 'audit' | 'consent' | 'security')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all duration-200 shrink-0 ${
                  isSelected
                    ? 'bg-[#111827] border-[#111827] text-white'
                    : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] hover:border-[#9CA3AF]'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Content */}
      <div className="space-y-4 min-h-[220px]">
        <AnimatePresence mode="wait">
          
          {/* Audit Logs tab */}
          {activeSection === 'audit' && (
            <motion.div
              key="audit"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              {auditLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 rounded-xl border border-[#E5E7EB] bg-[#FAFAF8]/50 text-xs font-mono">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[#9CA3AF]">{log.id}</span>
                      <span className="text-[#111827] font-semibold">{log.action}</span>
                    </div>
                    <p className="text-[10px] text-[#6B7280] font-light">
                      Initiated by: {log.user}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-[#16A085] bg-[#16A085]/5 px-2 py-0.5 rounded border border-[#16A085]/10">
                      <Check className="w-3 h-3" />
                      {log.status}
                    </span>
                    <p className="text-[9px] text-[#9CA3AF]">{formatDate(log.date)}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Consent Tracking tab */}
          {activeSection === 'consent' && (
            <motion.div
              key="consent"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              {consentActivity.map((con) => (
                <div key={con.id} className="flex items-center justify-between p-4 rounded-xl border border-[#E5E7EB] bg-[#FAFAF8]/50 text-xs font-mono">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[#9CA3AF]">{con.id}</span>
                      <span className="text-[#111827] font-semibold">{con.action}</span>
                    </div>
                    <p className="text-[10px] text-[#6B7280] font-light">
                      Signed: {con.user}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-[#16A085] bg-[#16A085]/5 px-2 py-0.5 rounded border border-[#16A085]/10">
                      <Check className="w-3 h-3" />
                      {con.state}
                    </span>
                    <p className="text-[9px] text-[#9CA3AF]">{formatDate(con.date)}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Security Event Stream tab */}
          {activeSection === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              {securityEvents.map((sec) => (
                <div key={sec.id} className="flex items-center justify-between p-4 rounded-xl border border-[#E5E7EB] bg-[#FAFAF8]/50 text-xs font-mono">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[#9CA3AF]">{sec.id}</span>
                      <span className="text-[#111827] font-semibold">{sec.event}</span>
                    </div>
                    <p className="text-[10px] text-[#6B7280] font-light">
                      Origin: {sec.origin}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-[#0F7AF3] bg-[#0F7AF3]/5 px-2 py-0.5 rounded border border-[#0F7AF3]/10">
                      NOMINAL
                    </span>
                    <p className="text-[9px] text-[#9CA3AF]">{formatDate(sec.date)}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
