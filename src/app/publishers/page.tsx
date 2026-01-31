'use client';

import { useState } from 'react';
import { useStore } from '@/store';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, Badge, Button, Input, Modal, Select, EmptyState } from '@/components/ui/index';
import { motion } from 'framer-motion';
import { Building2, Plus, Search, Edit, Trash2 } from 'lucide-react';
import type { Publisher } from '@/types';
import { formatDate } from '@/lib/utils';

export default function PublishersPage() {
  const { publishers, societies, addPublisher, updatePublisher, deletePublisher, addToast } = useStore();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPublisher, setEditingPublisher] = useState<Publisher | null>(null);

  const filteredPublishers = publishers.filter(
    (p) =>
      (p.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
      p.ipiNameNumber?.includes(search)
  );

  const handleDelete = (id: string) => {
    if (confirm('Delete this publisher?')) {
      deletePublisher(id);
      addToast({ type: 'success', title: 'Publisher deleted' });
    }
  };

  return (
    <PageLayout
      title="Publishers"
      description={`Manage ${publishers.length} publishing entities`}
      icon={Building2}
      actions={
        <Button onClick={() => { setEditingPublisher(null); setShowModal(true); }} leftIcon={<Plus className="w-4 h-4" />} glow>
          Add Publisher
        </Button>
      }
    >
      <Card className="p-5 mb-6">
        <Input
          placeholder="Search by name or IPI..."
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
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">IPI Number</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">PRO</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">MRO</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredPublishers.map((publisher, idx) => (
                <motion.tr
                  key={`${publisher.id ?? publisher.publisherId ?? publisher.name ?? 'publisher'}-${idx}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-emerald-400" />
                      </div>
                      <p className="font-medium text-white">{publisher.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-zinc-400">{publisher.ipiNameNumber || '—'}</span>
                  </td>
                  <td className="px-6 py-4"><Badge variant="default">{publisher.prAffiliation?.name || publisher.prAffiliation?.code || '—'}</Badge></td>
                  <td className="px-6 py-4"><Badge variant="default">{publisher.mrAffiliation?.name || publisher.mrAffiliation?.code || '—'}</Badge></td>
                  <td className="px-6 py-4"><Badge variant="info">{publisher.role}</Badge></td>
                  <td className="px-6 py-4">
                    <Badge variant={publisher.isControlled ? 'success' : 'default'} dot>
                      {publisher.isControlled ? 'Controlled' : 'External'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-500">{formatDate(publisher.createdAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setEditingPublisher(publisher); setShowModal(true); }}
                        className="p-2 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(publisher.id)}
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

        {filteredPublishers.length === 0 && (
          <EmptyState
            icon={<Building2 className="w-12 h-12" />}
            title="No publishers found"
            description={search ? 'Try a different search term' : 'Add your first publisher to get started'}
            action={
              !search && (
                <Button onClick={() => { setEditingPublisher(null); setShowModal(true); }} leftIcon={<Plus className="w-4 h-4" />}>
                  Add Publisher
                </Button>
              )
            }
          />
        )}
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingPublisher ? 'Edit Publisher' : 'Add Publisher'} size="lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const proCode = (form.elements.namedItem('pro') as HTMLSelectElement).value;
            const mroCode = (form.elements.namedItem('mro') as HTMLSelectElement).value;
            const data = {
              name: (form.elements.namedItem('name') as HTMLInputElement).value,
              ipiNameNumber: (form.elements.namedItem('ipi') as HTMLInputElement).value || undefined,
              prAffiliation: proCode ? societies.find(s => s.code === proCode) : undefined,
              mrAffiliation: mroCode ? societies.find(s => s.code === mroCode) : undefined,
              role: (form.elements.namedItem('role') as HTMLSelectElement).value as Publisher['role'],
              isControlled: (form.elements.namedItem('controlled') as HTMLInputElement).checked,
            };
            const dataWithDefaults = {
              // Required-by-store fields (draft-safe defaults)
              publisherId: '',
              publishingShareIds: [],
              ...data,
            };
            if (editingPublisher) {
              updatePublisher(editingPublisher.id, data);
              addToast({ type: 'success', title: 'Publisher updated' });
            } else {
              addPublisher(dataWithDefaults as any);
              addToast({ type: 'success', title: 'Publisher added' });
            }
            setShowModal(false);
          }}
          className="p-6 space-y-5"
        >
          <Input label="Name" name="name" defaultValue={editingPublisher?.name || ''} required />
          <Input label="IPI Name Number" name="ipi" defaultValue={editingPublisher?.ipiNameNumber || ''} />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="PR Society"
              name="pro"
              options={[{ value: '', label: 'Select...' }, ...societies.map((s) => ({ value: s.code, label: `${s.code} - ${s.name}` }))]}
              defaultValue={editingPublisher?.prAffiliation?.code || ''}
            />
            <Select
              label="MR Society"
              name="mro"
              options={[{ value: '', label: 'Select...' }, ...societies.map((s) => ({ value: s.code, label: `${s.code} - ${s.name}` }))]}
              defaultValue={editingPublisher?.mrAffiliation?.code || ''}
            />
          </div>
          <Select
            label="Publisher Role"
            name="role"
            options={[
              { value: 'OP', label: 'Original Publisher' },
              { value: 'AM', label: 'Administrator' },
              { value: 'SE', label: 'Sub-Publisher (Exclusive)' },
              { value: 'AQ', label: 'Acquirer' },
            ]}
            defaultValue={editingPublisher?.role || 'OP'}
          />
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="controlled" defaultChecked={editingPublisher?.isControlled} className="w-4 h-4 rounded bg-white/5 border-white/20 text-violet-600" />
            <span className="text-sm text-zinc-300">Controlled Publisher</span>
          </label>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" glow>{editingPublisher ? 'Update Publisher' : 'Add Publisher'}</Button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  );
}
