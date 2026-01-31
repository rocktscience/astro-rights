'use client';

import { useState } from 'react';
import { useStore } from '@/store';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, Badge, Button, Input, Modal, Select, EmptyState } from '@/components/ui/index';
import { motion } from 'framer-motion';
import { Album, Plus, Search, Edit, Trash2 } from 'lucide-react';
import type { Release } from '@/types';
import { formatDate } from '@/lib/utils';

export default function ReleasesPage() {
  const { releases, labels, artists, addRelease, updateRelease, deleteRelease, addToast } = useStore();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRelease, setEditingRelease] = useState<Release | null>(null);

  const filteredReleases = releases.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.upc?.includes(search) ||
      r.catalogNumber?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Delete this release?')) {
      deleteRelease(id);
      addToast({ type: 'success', title: 'Release deleted' });
    }
  };

  return (
    <PageLayout
      title="Releases"
      description={`Manage ${releases.length} album and single releases`}
      icon={Album}
      actions={
        <Button onClick={() => { setEditingRelease(null); setShowModal(true); }} leftIcon={<Plus className="w-4 h-4" />} glow>
          Add Release
        </Button>
      }
    >
      <Card className="p-5 mb-6">
        <Input
          placeholder="Search by title, UPC, or catalog number..."
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
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">UPC</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Catalog #</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Label</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Release Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredReleases.map((release) => (
                <motion.tr
                  key={release.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 border border-indigo-500/20 flex items-center justify-center">
                        <Album className="w-5 h-5 text-indigo-400" />
                      </div>
                      <p className="font-medium text-white">{release.title}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-zinc-400">{release.upc || '—'}</span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">{release.catalogNumber || '—'}</td>
                  <td className="px-6 py-4 text-zinc-300">{release.label?.name || '—'}</td>
                  <td className="px-6 py-4 text-sm text-zinc-500">{release.releaseDate ? formatDate(release.releaseDate) : '—'}</td>
                  <td className="px-6 py-4">
                    <Badge variant={release.releaseType === 'album' ? 'violet' : release.releaseType === 'single' ? 'cyan' : 'default'}>
                      {release.releaseType}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setEditingRelease(release); setShowModal(true); }}
                        className="p-2 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(release.id)}
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

        {filteredReleases.length === 0 && (
          <EmptyState
            icon={<Album className="w-12 h-12" />}
            title="No releases found"
            description={search ? 'Try a different search term' : 'Add your first release to get started'}
            action={
              !search && (
                <Button onClick={() => { setEditingRelease(null); setShowModal(true); }} leftIcon={<Plus className="w-4 h-4" />}>
                  Add Release
                </Button>
              )
            }
          />
        )}
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingRelease ? 'Edit Release' : 'Add Release'} size="lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const data = {
              title: (form.elements.namedItem('title') as HTMLInputElement).value,
              upc: (form.elements.namedItem('upc') as HTMLInputElement).value || undefined,
              catalogNumber: (form.elements.namedItem('catalog') as HTMLInputElement).value || undefined,
              labelId: (form.elements.namedItem('label') as HTMLSelectElement).value || undefined,
              releaseDate: (form.elements.namedItem('date') as HTMLInputElement).value ? new Date((form.elements.namedItem('date') as HTMLInputElement).value) : undefined,
              releaseType: (form.elements.namedItem('type') as HTMLSelectElement).value as Release['releaseType'],
              recordingIds: [],
            };
            if (editingRelease) {
              updateRelease(editingRelease.id, data);
              addToast({ type: 'success', title: 'Release updated' });
            } else {
              addRelease(data as Omit<Release, 'id' | 'createdAt' | 'updatedAt'>);
              addToast({ type: 'success', title: 'Release added' });
            }
            setShowModal(false);
          }}
          className="p-6 space-y-5"
        >
          <Input label="Title" name="title" defaultValue={editingRelease?.title || ''} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="UPC" name="upc" defaultValue={editingRelease?.upc || ''} />
            <Input label="Catalog Number" name="catalog" defaultValue={editingRelease?.catalogNumber || ''} />
          </div>
          <Select
            label="Label"
            name="label"
            options={[{ value: '', label: 'Select...' }, ...labels.map((l) => ({ value: l.id, label: l.name }))]}
            defaultValue={editingRelease?.labelId || ''}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Release Date" name="date" type="date" defaultValue={editingRelease?.releaseDate ? new Date(editingRelease.releaseDate).toISOString().split('T')[0] : ''} />
            <Select
              label="Type"
              name="type"
              options={[
                { value: 'album', label: 'Album' },
                { value: 'single', label: 'Single' },
                { value: 'ep', label: 'EP' },
                { value: 'compilation', label: 'Compilation' },
              ]}
              defaultValue={editingRelease?.releaseType || 'album'}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" glow>{editingRelease ? 'Update Release' : 'Add Release'}</Button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  );
}
