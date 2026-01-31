'use client';

import { useState } from 'react';
import { useStore } from '@/store';
import { Sidebar } from '@/components/layout/Sidebar';
import { ToastContainer } from '@/components/ui/Toast';
import { Card, Badge, Button, Input, Select, Modal, Checkbox, EmptyState, Tabs } from '@/components/ui/index';
import { motion } from 'framer-motion';
import {
  Music,
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  Edit,
  Eye,
  FileText,
  X,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { formatDate, getWriterCapacityLabel, cn } from '@/lib/utils';
import type { Work, WorkStatus, VersionType } from '@/types';

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'pending', label: 'Pending' },
  { value: 'registered', label: 'Registered' },
  { value: 'conflict', label: 'Conflict' },
];

const versionOptions = [
  { value: '', label: 'All Versions' },
  { value: 'ORI', label: 'Original' },
  { value: 'MOD', label: 'Modified' },
];

export default function WorksPage() {
  const {
    sidebarCollapsed,
    works,
    writers,
    selectedWorkIds,
    toggleWorkSelection,
    selectAllWorks,
    clearWorkSelection,
    deleteWork,
    workFilters,
    setWorkFilters,
    clearWorkFilters,
    getFilteredWorks,
    addToast,
  } = useStore();

  const [showFilters, setShowFilters] = useState(false);
  const [viewingWork, setViewingWork] = useState<Work | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  const [showCWRModal, setShowCWRModal] = useState(false);

  const filteredWorks = getFilteredWorks();

  const isAllSelected = filteredWorks.length > 0 && 
    filteredWorks.every((w) => selectedWorkIds.includes(w.id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      clearWorkSelection();
    } else {
      selectAllWorks(filteredWorks.map((w) => w.id));
    }
  };

  const handleDeleteSelected = () => {
    if (confirm(`Delete ${selectedWorkIds.length} works?`)) {
      selectedWorkIds.forEach((id) => deleteWork(id));
      addToast({
        type: 'success',
        title: 'Works deleted',
        message: `${selectedWorkIds.length} works have been deleted.`,
      });
      clearWorkSelection();
    }
  };

  const handleGenerateCWR = () => {
    if (selectedWorkIds.length === 0) {
      addToast({
        type: 'warning',
        title: 'No works selected',
        message: 'Please select works to generate CWR file.',
      });
      return;
    }
    setShowCWRModal(true);
  };

  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'writers', label: 'Writers', count: viewingWork?.writerShares?.length || 0 },
    { id: 'publishers', label: 'Publishers', count: viewingWork?.publisherShares?.length || 0 },
    { id: 'recordings', label: 'Recordings', count: viewingWork?.recordings?.length || 0 },
    { id: 'registrations', label: 'Registrations', count: viewingWork?.registrations?.length || 0 },
    { id: 'alternates', label: 'Alternate Titles', count: viewingWork?.alternateTitles?.length || 0 },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-violet-950/20 via-black to-cyan-950/10 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.1),transparent_50%)] pointer-events-none" />
      
      <Sidebar />
      <ToastContainer />

      <main
        className="relative transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
      >
        <div className="p-8 max-w-[1600px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-2"
              >
                <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                  <Music className="w-5 h-5 text-violet-400" />
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  Musical Works
                </h1>
              </motion.div>
              <p className="text-zinc-500 text-lg">
                Manage your catalog of {works.length} musical works
              </p>
            </div>
            <div className="flex items-center gap-3">
              {selectedWorkIds.length > 0 && (
                <>
                  <Button variant="ghost" onClick={clearWorkSelection}>
                    Clear ({selectedWorkIds.length})
                  </Button>
                  <Button variant="secondary" onClick={handleDeleteSelected} leftIcon={<Trash2 className="w-4 h-4" />}>
                    Delete
                  </Button>
                  <Button onClick={handleGenerateCWR} leftIcon={<FileText className="w-4 h-4" />} glow>
                    Generate CWR
                  </Button>
                </>
              )}
              {selectedWorkIds.length === 0 && (
                <Link href="/works/new">
                  <Button leftIcon={<Plus className="w-4 h-4" />} glow>Add Work</Button>
                </Link>
              )}
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="p-5 mb-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by title, work ID, or ISWC..."
                  value={workFilters.search || ''}
                  onChange={(e) => setWorkFilters({ search: e.target.value })}
                  leftIcon={<Search className="w-4 h-4" />}
                />
              </div>
              <Button
                variant={showFilters ? 'primary' : 'secondary'}
                onClick={() => setShowFilters(!showFilters)}
                leftIcon={<Filter className="w-4 h-4" />}
              >
                Filters
              </Button>
              {(workFilters.status || workFilters.versionType || workFilters.hasIswc !== undefined) && (
                <Button variant="ghost" onClick={clearWorkFilters}>
                  Clear
                </Button>
              )}
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-5 pt-5 border-t border-white/5 grid grid-cols-4 gap-4"
              >
                <Select
                  label="Status"
                  options={statusOptions}
                  value={workFilters.status || ''}
                  onChange={(e) => setWorkFilters({ status: e.target.value as WorkStatus || undefined })}
                />
                <Select
                  label="Version Type"
                  options={versionOptions}
                  value={workFilters.versionType || ''}
                  onChange={(e) => setWorkFilters({ versionType: e.target.value as VersionType || undefined })}
                />
                <Select
                  label="ISWC Status"
                  options={[
                    { value: '', label: 'All' },
                    { value: 'true', label: 'Has ISWC' },
                    { value: 'false', label: 'No ISWC' },
                  ]}
                  value={workFilters.hasIswc === undefined ? '' : String(workFilters.hasIswc)}
                  onChange={(e) => setWorkFilters({ hasIswc: e.target.value === '' ? undefined : e.target.value === 'true' })}
                />
                <Select
                  label="Writer"
                  options={[
                    { value: '', label: 'All Writers' },
                    ...writers.map((w) => ({
                      value: w.id,
                      label: `${w.lastName}, ${w.firstName}`,
                    })),
                  ]}
                  value={workFilters.writerId || ''}
                  onChange={(e) => setWorkFilters({ writerId: e.target.value || undefined })}
                />
              </motion.div>
            )}
          </Card>

          {/* Works Table */}
          <Card padding="none" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-5 py-4 text-left">
                      <Checkbox
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Work ID
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      ISWC
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Writers
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Updated
                    </th>
                    <th className="px-5 py-4 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredWorks.map((work) => (
                    <motion.tr
                      key={work.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={cn(
                        'group transition-colors',
                        selectedWorkIds.includes(work.id) 
                          ? 'bg-violet-500/5' 
                          : 'hover:bg-white/[0.02]'
                      )}
                    >
                      <td className="px-5 py-4">
                        <Checkbox
                          checked={selectedWorkIds.includes(work.id)}
                          onChange={() => toggleWorkSelection(work.id)}
                        />
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-mono text-sm text-zinc-500">
                          {work.workId}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setViewingWork(work)}
                          className="font-medium text-white hover:text-violet-400 text-left transition-colors"
                        >
                          {work.title}
                        </button>
                        {(work.alternateTitles || []).length > 0 && (
                          <p className="text-xs text-zinc-600 mt-0.5">
                            +{work.alternateTitles.length} alt titles
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {work.iswc ? (
                          <span className="font-mono text-sm text-zinc-400">{work.iswc}</span>
                        ) : (
                          <span className="text-zinc-600">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-0.5">
                          {(work.writerShares || []).slice(0, 2).map((ws) => (
                            <span key={ws.writerId} className="text-sm text-zinc-300">
                              {ws.writer?.lastName}, {ws.writer?.firstName?.charAt(0)}.
                              {ws.writer?.isControlled && (
                                <span className="ml-1 text-violet-400">●</span>
                              )}
                            </span>
                          ))}
                          {(work.writerShares || []).length > 2 && (
                            <span className="text-xs text-zinc-600">
                              +{(work.writerShares || []).length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={work.versionType === 'ORI' ? 'default' : 'cyan'}>
                          {work.versionType}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <Badge
                          variant={
                            work.status === 'registered'
                              ? 'success'
                              : work.status === 'pending'
                              ? 'warning'
                              : work.status === 'conflict'
                              ? 'error'
                              : 'default'
                          }
                          dot
                        >
                          {work.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-sm text-zinc-500">
                        {formatDate(work.updatedAt)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setViewingWork(work)}
                            className="p-2 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <Link href={`/works/${work.id}/edit`}>
                            <button className="p-2 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                          </Link>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredWorks.length === 0 && (
              <EmptyState
                icon={<Music className="w-12 h-12" />}
                title="No works found"
                description={workFilters.search ? 'Try adjusting your search or filters' : 'Add your first musical work to get started'}
                action={
                  !workFilters.search && (
                    <Link href="/works/new">
                      <Button leftIcon={<Plus className="w-4 h-4" />}>Add Work</Button>
                    </Link>
                  )
                }
              />
            )}
          </Card>
        </div>
      </main>

      {/* Work Detail Modal */}
      <Modal
        isOpen={!!viewingWork}
        onClose={() => setViewingWork(null)}
        title={viewingWork?.title}
        size="xl"
      >
        {viewingWork && (
          <div>
            <div className="px-6 py-4 border-b border-white/5">
              <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
            </div>

            <div className="p-6">
              {activeTab === 'details' && (
                <div className="grid grid-cols-2 gap-6">
                  <InfoBlock label="Work ID" value={viewingWork.workId} mono />
                  <InfoBlock label="ISWC" value={viewingWork.iswc || '—'} mono />
                  <InfoBlock label="Version Type" value={viewingWork.versionType === 'ORI' ? 'Original' : 'Modified'} />
                  <InfoBlock label="Status" value={
                    <Badge
                      variant={
                        viewingWork.status === 'registered' ? 'success'
                          : viewingWork.status === 'pending' ? 'warning'
                          : viewingWork.status === 'conflict' ? 'error'
                          : 'default'
                      }
                      dot
                    >
                      {viewingWork.status}
                    </Badge>
                  } />
                  <InfoBlock label="Language" value={viewingWork.language || '—'} />
                  <InfoBlock label="Created" value={formatDate(viewingWork.createdAt)} />
                  <InfoBlock label="Updated" value={formatDate(viewingWork.updatedAt)} />
                </div>
              )}

              {activeTab === 'writers' && (
                <div className="space-y-3">
                  {(viewingWork.writerShares || []).length === 0 ? (
                    <EmptyState title="No writers" description="Add writers when editing this work" />
                  ) : (
                    (viewingWork.writerShares || []).map((ws) => (
                      <div
                        key={ws.writerId}
                        className="p-4 rounded-xl bg-white/[0.02] border border-white/5"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-white">
                              {ws.writer?.firstName} {ws.writer?.lastName}
                              {ws.writer?.isControlled && (
                                <Badge variant="violet" className="ml-2">Controlled</Badge>
                              )}
                            </p>
                            <p className="text-sm text-zinc-500">
                              IPI: {ws.writer?.ipiNameNumber || 'N/A'} • {getWriterCapacityLabel(ws.capacity)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-zinc-400">PR: {ws.prOwnership}%</p>
                            <p className="text-sm text-zinc-400">MR: {ws.mrOwnership}%</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'publishers' && (
                <div className="space-y-3">
                  {(viewingWork.publisherShares || []).length === 0 ? (
                    <EmptyState title="No publishers" description="Add publishers when editing this work" />
                  ) : (
                    (viewingWork.publisherShares || []).map((ps) => (
                      <div
                        key={ps.publisherId}
                        className="p-4 rounded-xl bg-white/[0.02] border border-white/5"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-white">{ps.publisher?.name}</p>
                            <p className="text-sm text-zinc-500">
                              IPI: {ps.publisher?.ipiNameNumber || 'N/A'} • Role: {ps.role}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-zinc-400">PR: {ps.prCollection}%</p>
                            <p className="text-sm text-zinc-400">MR: {ps.mrCollection}%</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'recordings' && (
                <div className="space-y-3">
                  {(viewingWork.recordings || []).length === 0 ? (
                    <EmptyState title="No recordings" description="Link recordings to this work" />
                  ) : (
                    (viewingWork.recordings || []).map((rec) => (
                      <div
                        key={rec.id}
                        className="p-4 rounded-xl bg-white/[0.02] border border-white/5"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-white">{rec.title}</p>
                            <p className="text-sm text-zinc-500">
                              {rec.artists?.map(a => a.lastName).join(', ') || 'Unknown Artist'} • {(() => {
                                const dur = Number(rec.duration);
                                if (!Number.isFinite(dur) || dur <= 0) return '—';
                                const mins = Math.floor(dur / 60);
                                const secs = Math.floor(dur % 60);
                                return `${mins}:${String(secs).padStart(2, '0')}`;
                              })()}
                            </p>
                          </div>
                          {rec.isrc && (
                            <span className="font-mono text-sm text-zinc-500">{rec.isrc}</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'registrations' && (
                <div className="space-y-3">
                  {(viewingWork.registrations || []).length === 0 ? (
                    <EmptyState title="No registrations" description="Generate a CWR file to register this work" />
                  ) : (
                    (viewingWork.registrations || []).map((reg) => (
                      <div
                        key={reg.id}
                        className="p-4 rounded-xl bg-white/[0.02] border border-white/5"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-white">
                              {reg.societyName || reg.societyCode}
                            </p>
                            <p className="text-sm text-zinc-500">
                              {reg.transactionType} • CWR {reg.cwrVersion}
                            </p>
                          </div>
                          <Badge
                            variant={
                              reg.status === 'RA' ? 'success'
                                : reg.status === 'pending' ? 'warning'
                                : 'error'
                            }
                            dot
                          >
                            {reg.status}
                          </Badge>
                        </div>
                        {reg.registrationNumber && (
                          <p className="mt-2 text-sm text-zinc-400">
                            Registration #: <span className="font-mono">{reg.registrationNumber}</span>
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'alternates' && (
                <div className="space-y-3">
                  {(viewingWork.alternateTitles || []).length === 0 ? (
                    <EmptyState title="No alternate titles" description="Add alternate titles when editing this work" />
                  ) : (
                    (viewingWork.alternateTitles || []).map((alt) => (
                      <div
                        key={alt.id}
                        className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between"
                      >
                        <p className="font-medium text-white">{alt.title}</p>
                        <Badge variant="default">{alt.type}</Badge>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-white/5 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setViewingWork(null)}>
                Close
              </Button>
              <Link href={`/works/${viewingWork.id}/edit`}>
                <Button leftIcon={<Edit className="w-4 h-4" />}>Edit Work</Button>
              </Link>
            </div>
          </div>
        )}
      </Modal>

      {/* CWR Generation Modal */}
      <Modal
        isOpen={showCWRModal}
        onClose={() => setShowCWRModal(false)}
        title="Generate CWR File"
        size="md"
      >
        <CWRGenerationForm
          workIds={selectedWorkIds}
          onClose={() => {
            setShowCWRModal(false);
            clearWorkSelection();
          }}
        />
      </Modal>
    </div>
  );
}

function InfoBlock({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div>
      <p className="text-sm text-zinc-500 mb-1">{label}</p>
      <div className={cn('text-white', mono && 'font-mono')}>
        {value}
      </div>
    </div>
  );
}

function CWRGenerationForm({ workIds, onClose }: { workIds: string[]; onClose: () => void }) {
  const { works, publisherSettings, addCWRExport, addToast } = useStore();
  const [version, setVersion] = useState<'2.1' | '2.2' | '3.0' | '3.1'>('2.2');
  const [transactionType, setTransactionType] = useState<'NWR' | 'REV'>('NWR');
  const [recipient, setRecipient] = useState('ASCAP');
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedWorks = works.filter((w) => workIds.includes(w.id));

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const { generateCWR } = await import('@/lib/cwr-generator');
      if (!publisherSettings) {
        addToast({
          type: 'error',
          title: 'Missing publisher settings',
          message: 'Set your Publisher Settings (delivery code) before generating CWR.',
        });
        return;
      }
      const result = generateCWR(selectedWorks, publisherSettings, {
        version,
        transactionType,
        recipientSociety: recipient,
        submitterCode: publisherSettings.deliveryCode,
        workIds,
      });

      const blob = new Blob([result.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addCWRExport({
        filename: result.filename,
        version,
        transactionType,
        workIds,
        workCount: selectedWorks.length,
        recipientSociety: recipient,
        status: 'draft',
      });

      addToast({
        type: 'success',
        title: 'CWR file generated',
        message: `${result.filename} has been downloaded.`,
      });

      onClose();
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Generation failed',
        message: 'Failed to generate CWR file.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <p className="text-sm text-zinc-400 mb-3">
          Generating CWR for {selectedWorks.length} works
        </p>
        <div className="flex flex-wrap gap-2">
          {selectedWorks.slice(0, 5).map((w) => (
            <Badge key={w.id} variant="default">{w.title}</Badge>
          ))}
          {selectedWorks.length > 5 && (
            <Badge variant="default">+{selectedWorks.length - 5} more</Badge>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <Select
          label="CWR Version"
          options={[
            { value: '2.1', label: 'CWR 2.1' },
            { value: '2.2', label: 'CWR 2.2 (Recommended)' },
            { value: '3.0', label: 'CWR 3.0' },
            { value: '3.1', label: 'CWR 3.1' },
          ]}
          value={version}
          onChange={(e) => setVersion(e.target.value as typeof version)}
        />

        <Select
          label="Transaction Type"
          options={[
            { value: 'NWR', label: 'NWR - New Work Registration' },
            { value: 'REV', label: 'REV - Revision' },
          ]}
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value as typeof transactionType)}
        />

        <Select
          label="Recipient Society"
          options={[
            { value: 'ASCAP', label: 'ASCAP' },
            { value: 'BMI', label: 'BMI' },
            { value: 'SESAC', label: 'SESAC' },
            { value: 'MLC', label: 'The MLC' },
            { value: 'SGAE', label: 'SGAE' },
            { value: 'PRS', label: 'PRS' },
            { value: 'GEMA', label: 'GEMA' },
            { value: 'SACEM', label: 'SACEM' },
          ]}
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-white/5">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleGenerate} isLoading={isGenerating} leftIcon={<Download className="w-4 h-4" />} glow>
          Generate & Download
        </Button>
      </div>
    </div>
  );
}
