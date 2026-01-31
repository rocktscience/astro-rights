'use client';

import { useState } from 'react';
import { useStore } from '@/store';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, Button, Input, Modal, EmptyState } from '@/components/ui/index';
import { motion } from 'framer-motion';
import { CircleDot, Plus, Search, Edit, Trash2 } from 'lucide-react';
import type { Label } from '@/types';
import { formatDate } from '@/lib/utils';

export default function LabelsPage() {
  const { labels, addLabel, updateLabel, deleteLabel, addToast } = useStore();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingLabel, setEditingLabel] = useState<Label | null>(null);

  const filteredLabels = labels.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Delete this label?')) {
      deleteLabel(id);
      addToast({ type: 'success', title: 'Label deleted' });
    }
  };

  return (
    <PageLayout
      title="Labels"
      description={`Manage ${labels.length} record labels`}
      icon={CircleDot}
      actions={
        <Button onClick={() => { setEditingLabel(null); setShowModal(true); }} leftIcon={<Plus className="w-4 h-4" />} glow>
          Add Label
        </Button>
      }
    >
      <Card className="p-5 mb-6">
        <Input
          placeholder="Search by name..."
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
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLabels.map((label) => (
                <motion.tr
                  key={label.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20 flex items-center justify-center">
                        <CircleDot className="w-5 h-5 text-amber-400" />
                      </div>
                      <p className="font-medium text-white">{label.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-500">{formatDate(label.createdAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setEditingLabel(label); setShowModal(true); }}
                        className="p-2 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(label.id)}
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

        {filteredLabels.length === 0 && (
          <EmptyState
            icon={<CircleDot className="w-12 h-12" />}
            title="No labels found"
            description={search ? 'Try a different search term' : 'Add your first label to get started'}
            action={
              !search && (
                <Button onClick={() => { setEditingLabel(null); setShowModal(true); }} leftIcon={<Plus className="w-4 h-4" />}>
                  Add Label
                </Button>
              )
            }
          />
        )}
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingLabel ? 'Edit Label' : 'Add Label'} size="md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const data = { name: (form.elements.namedItem('name') as HTMLInputElement).value };
            if (editingLabel) {
              updateLabel(editingLabel.id, data);
              addToast({ type: 'success', title: 'Label updated' });
            } else {
              addLabel(data);
              addToast({ type: 'success', title: 'Label added' });
            }
            setShowModal(false);
          }}
          className="p-6 space-y-5"
        >
          <Input label="Name" name="name" defaultValue={editingLabel?.name || ''} required />
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" glow>{editingLabel ? 'Update Label' : 'Add Label'}</Button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  );
}
