'use client';

import { useState } from 'react';
import { useStore } from '@/store';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, Badge, Button, Input, Modal, Select, EmptyState } from '@/components/ui/index';
import { motion } from 'framer-motion';
import { FileSignature, Plus, Search, Edit, Trash2 } from 'lucide-react';
import type { Agreement } from '@/types';
import { formatDate } from '@/lib/utils';

export default function AgreementsPage() {
  const { agreements, writers, publishers, addAgreement, updateAgreement, deleteAgreement, addToast } = useStore();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAgreement, setEditingAgreement] = useState<Agreement | null>(null);

  const filteredAgreements = agreements.filter(
    (a) => a.title?.toLowerCase().includes(search.toLowerCase()) || 
           a.agreementNumber?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Delete this agreement?')) {
      deleteAgreement(id);
      addToast({ type: 'success', title: 'Agreement deleted' });
    }
  };

  const getWriterName = (writerId?: string) => {
    if (!writerId) return '-';
    const writer = writers.find(w => w.id === writerId);
    return writer ? `${writer.firstName} ${writer.lastName}` : '-';
  };

  const getPublisherName = (publisherId?: string) => {
    if (!publisherId) return '-';
    const publisher = publishers.find(p => p.id === publisherId);
    return publisher?.name || '-';
  };

  return (
    <PageLayout
      title="Agreements"
      description={`Manage ${agreements.length} publishing agreements`}
      icon={FileSignature}
      actions={
        <Button onClick={() => { setEditingAgreement(null); setShowModal(true); }} leftIcon={<Plus className="w-4 h-4" />} glow>
          Add Agreement
        </Button>
      }
    >
      <Card className="p-5 mb-6">
        <Input
          placeholder="Search agreements..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </Card>

      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Agreement</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Writer</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Publisher</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Admin Fee</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredAgreements.map((agreement) => (
                <motion.tr
                  key={agreement.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500/20 to-pink-600/10 border border-pink-500/20 flex items-center justify-center">
                        <FileSignature className="w-5 h-5 text-pink-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{agreement.title}</p>
                        {agreement.agreementNumber && (
                          <p className="text-xs text-zinc-500 font-mono">{agreement.agreementNumber}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={
                      agreement.type === 'publishing' ? 'violet' :
                      agreement.type === 'co-publishing' ? 'cyan' :
                      agreement.type === 'sub-publishing' ? 'warning' : 'default'
                    }>
                      {agreement.type === 'publishing' ? 'Publishing' :
                       agreement.type === 'co-publishing' ? 'Co-Pub' :
                       agreement.type === 'sub-publishing' ? 'Sub-Pub' :
                       agreement.type === 'administration' ? 'Admin' : 
                       agreement.type === 'recording' ? 'Recording' : agreement.type}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-zinc-300">{getWriterName(agreement.writerId)}</td>
                  <td className="px-6 py-4 text-zinc-300">{getPublisherName(agreement.publisherId)}</td>
                  <td className="px-6 py-4 text-zinc-300">{agreement.adminFee ? `${agreement.adminFee}%` : '-'}</td>
                  <td className="px-6 py-4">
                    <Badge variant={agreement.status === 'active' ? 'success' : agreement.status === 'expired' ? 'error' : agreement.status === 'draft' ? 'warning' : 'default'} dot>
                      {agreement.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-500">
                    {agreement.termStartDate ? formatDate(agreement.termStartDate) : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setEditingAgreement(agreement); setShowModal(true); }}
                        className="p-2 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(agreement.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAgreements.length === 0 && (
          <EmptyState
            icon={<FileSignature className="w-12 h-12" />}
            title="No agreements found"
            description={search ? 'Try a different search term' : 'Add your first agreement to get started'}
            action={
              !search && (
                <Button onClick={() => { setEditingAgreement(null); setShowModal(true); }} leftIcon={<Plus className="w-4 h-4" />}>
                  Add Agreement
                </Button>
              )
            }
          />
        )}
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingAgreement ? 'Edit Agreement' : 'Add Agreement'} size="lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const data = {
              title: (form.elements.namedItem('title') as HTMLInputElement).value,
              agreementNumber: (form.elements.namedItem('agreementNumber') as HTMLInputElement).value || undefined,
              type: (form.elements.namedItem('type') as HTMLSelectElement).value as Agreement['type'],
              status: (form.elements.namedItem('status') as HTMLSelectElement).value as Agreement['status'],
              writerId: (form.elements.namedItem('writerId') as HTMLSelectElement).value || undefined,
              publisherId: (form.elements.namedItem('publisherId') as HTMLSelectElement).value || undefined,
              adminFee: Number((form.elements.namedItem('adminFee') as HTMLInputElement).value) || undefined,
              prShare: Number((form.elements.namedItem('prShare') as HTMLInputElement).value) || undefined,
              mrShare: Number((form.elements.namedItem('mrShare') as HTMLInputElement).value) || undefined,
              termStartDate: (form.elements.namedItem('termStartDate') as HTMLInputElement).value ? new Date((form.elements.namedItem('termStartDate') as HTMLInputElement).value) : undefined,
              termEndDate: (form.elements.namedItem('termEndDate') as HTMLInputElement).value ? new Date((form.elements.namedItem('termEndDate') as HTMLInputElement).value) : undefined,
              territories: editingAgreement?.territories || [],
            };
            if (editingAgreement) {
              updateAgreement(editingAgreement.id, data);
              addToast({ type: 'success', title: 'Agreement updated' });
            } else {
              addAgreement(data);
              addToast({ type: 'success', title: 'Agreement added' });
            }
            setShowModal(false);
          }}
          className="p-6 space-y-5"
        >
          <div className="grid grid-cols-2 gap-4">
            <Input label="Title" name="title" defaultValue={editingAgreement?.title || ''} required />
            <Input label="Agreement Number" name="agreementNumber" defaultValue={editingAgreement?.agreementNumber || ''} placeholder="e.g. AGR-2024-001" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Type"
              name="type"
              options={[
                { value: 'publishing', label: 'Publishing' },
                { value: 'co-publishing', label: 'Co-Publishing' },
                { value: 'administration', label: 'Administration' },
                { value: 'sub-publishing', label: 'Sub-Publishing' },
                { value: 'recording', label: 'Recording' },
              ]}
              defaultValue={editingAgreement?.type || 'publishing'}
            />
            <Select
              label="Status"
              name="status"
              options={[
                { value: 'active', label: 'Active' },
                { value: 'draft', label: 'Draft' },
                { value: 'expired', label: 'Expired' },
                { value: 'terminated', label: 'Terminated' },
              ]}
              defaultValue={editingAgreement?.status || 'draft'}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Writer"
              name="writerId"
              options={[
                { value: '', label: 'Select writer...' },
                ...writers.map(w => ({ value: w.id, label: `${w.firstName} ${w.lastName}` }))
              ]}
              defaultValue={editingAgreement?.writerId || ''}
            />
            <Select
              label="Publisher"
              name="publisherId"
              options={[
                { value: '', label: 'Select publisher...' },
                ...publishers.map(p => ({ value: p.id, label: p.name }))
              ]}
              defaultValue={editingAgreement?.publisherId || ''}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Admin Fee (%)" name="adminFee" type="number" min={0} max={100} defaultValue={editingAgreement?.adminFee || ''} placeholder="e.g. 15" />
            <Input label="PR Share (%)" name="prShare" type="number" min={0} max={100} defaultValue={editingAgreement?.prShare || ''} placeholder="Performance" />
            <Input label="MR Share (%)" name="mrShare" type="number" min={0} max={100} defaultValue={editingAgreement?.mrShare || ''} placeholder="Mechanical" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Term Start Date" 
              name="termStartDate" 
              type="date" 
              defaultValue={editingAgreement?.termStartDate ? new Date(editingAgreement.termStartDate).toISOString().split('T')[0] : ''} 
            />
            <Input 
              label="Term End Date" 
              name="termEndDate" 
              type="date" 
              defaultValue={editingAgreement?.termEndDate ? new Date(editingAgreement.termEndDate).toISOString().split('T')[0] : ''} 
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" glow>{editingAgreement ? 'Update Agreement' : 'Add Agreement'}</Button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  );
}
