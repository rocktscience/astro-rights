'use client';

import { useState } from 'react';
import { useStore } from '@/store';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, Badge, Button, Modal, EmptyState } from '@/components/ui/index';
import { motion } from 'framer-motion';
import { FileText, Download, Eye, Send, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { formatDate, formatRelativeTime } from '@/lib/utils';

export default function CWRExportsPage() {
  const { cwrExports, works, updateCWRExport, addToast } = useStore();
  const [viewingExport, setViewingExport] = useState<typeof cwrExports[0] | null>(null);

  const handleMarkSent = (id: string) => {
    updateCWRExport(id, { status: 'sent', sentAt: new Date() });
    addToast({ type: 'success', title: 'Export marked as sent' });
  };

  const handleMarkAcknowledged = (id: string) => {
    updateCWRExport(id, { status: 'acknowledged' });
    addToast({ type: 'success', title: 'Export marked as acknowledged' });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'acknowledged': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'sent': return <Send className="w-4 h-4 text-blue-400" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <PageLayout
      title="CWR Exports"
      description={`${cwrExports.length} CWR files generated`}
      icon={FileText}
    >
      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Filename</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Version</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Works</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Recipient</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {cwrExports.map((exp) => (
                <motion.tr
                  key={exp.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-400" />
                      </div>
                      <p className="font-mono text-sm text-white">{exp.filename}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4"><Badge variant="default">CWR {exp.version}</Badge></td>
                  <td className="px-6 py-4"><Badge variant={exp.transactionType === 'NWR' ? 'cyan' : 'warning'}>{exp.transactionType}</Badge></td>
                  <td className="px-6 py-4 text-zinc-300">{exp.workCount} works</td>
                  <td className="px-6 py-4 text-zinc-300">{exp.recipientSociety}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(exp.status)}
                      <Badge variant={
                        exp.status === 'acknowledged' ? 'success' :
                        exp.status === 'sent' ? 'info' : 'default'
                      }>
                        {exp.status}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-500">{formatRelativeTime(exp.createdAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setViewingExport(exp)}
                        className="p-2 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {exp.status === 'draft' && (
                        <button
                          onClick={() => handleMarkSent(exp.id)}
                          className="p-2 rounded-lg hover:bg-blue-500/10 text-zinc-500 hover:text-blue-400 transition-colors"
                          title="Mark as Sent"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      )}
                      {exp.status === 'sent' && (
                        <button
                          onClick={() => handleMarkAcknowledged(exp.id)}
                          className="p-2 rounded-lg hover:bg-emerald-500/10 text-zinc-500 hover:text-emerald-400 transition-colors"
                          title="Mark as Acknowledged"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {cwrExports.length === 0 && (
          <EmptyState
            icon={<FileText className="w-12 h-12" />}
            title="No CWR exports yet"
            description="Generate your first CWR file from the Works page by selecting works and clicking 'Generate CWR'"
          />
        )}
      </Card>

      <Modal
        isOpen={!!viewingExport}
        onClose={() => setViewingExport(null)}
        title="CWR Export Details"
        size="lg"
      >
        {viewingExport && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-zinc-500 mb-1">Filename</p>
                <p className="font-mono text-white">{viewingExport.filename}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-500 mb-1">Status</p>
                <Badge variant={
                  viewingExport.status === 'acknowledged' ? 'success' :
                  viewingExport.status === 'sent' ? 'info' : 'default'
                } dot>
                  {viewingExport.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-zinc-500 mb-1">Version</p>
                <p className="text-white">CWR {viewingExport.version}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-500 mb-1">Transaction Type</p>
                <p className="text-white">{viewingExport.transactionType}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-500 mb-1">Recipient</p>
                <p className="text-white">{viewingExport.recipientSociety}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-500 mb-1">Created</p>
                <p className="text-white">{formatDate(viewingExport.createdAt)}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-zinc-500 mb-3">Works Included ({viewingExport.workCount})</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {viewingExport.workIds.map((workId) => {
                  const work = works.find(w => w.id === workId);
                  return (
                    <div key={workId} className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                      <p className="text-white font-medium">{work?.title || 'Unknown Work'}</p>
                      <p className="text-sm text-zinc-500">{work?.workId}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
              <Button variant="secondary" onClick={() => setViewingExport(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </PageLayout>
  );
}
