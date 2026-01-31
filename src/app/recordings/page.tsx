'use client';

import { useState } from 'react';
import { useStore } from '@/store';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, Badge, Button, Input, Modal, Select, EmptyState } from '@/components/ui/index';
import { motion } from 'framer-motion';
import { Disc3, Plus, Search, Edit, Trash2 } from 'lucide-react';
import type { Recording } from '@/types';
import { formatDate, cn } from '@/lib/utils';

export default function RecordingsPage() {
  const { recordings, artists, labels, works, addRecording, updateRecording, deleteRecording, addToast } = useStore();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRecording, setEditingRecording] = useState<Recording | null>(null);

  const filteredRecordings = recordings.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.isrc?.toLowerCase().includes(search.toLowerCase()) ||
      r.artists?.some(a => a.lastName.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = (id: string) => {
    if (confirm('Delete this recording?')) {
      deleteRecording(id);
      addToast({ type: 'success', title: 'Recording deleted' });
    }
  };

  return (
    <PageLayout
      title="Recordings"
      description={`Manage ${recordings.length} sound recordings`}
      icon={Disc3}
      actions={
        <Button onClick={() => { setEditingRecording(null); setShowModal(true); }} leftIcon={<Plus className="w-4 h-4" />} glow>
          Add Recording
        </Button>
      }
    >
      <Card className="p-5 mb-6">
        <Input
          placeholder="Search by title, ISRC, or artist..."
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
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">ISRC</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Artist</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Label</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Work</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredRecordings.map((recording) => (
                <motion.tr
                  key={recording.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/20 flex items-center justify-center">
                        <Disc3 className="w-5 h-5 text-cyan-400" />
                      </div>
                      <p className="font-medium text-white">{recording.title}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-zinc-400">{recording.isrc || '—'}</span>
                  </td>
                  <td className="px-6 py-4 text-zinc-300">{recording.artists?.map(a => a.lastName).join(', ') || '—'}</td>
                  <td className="px-6 py-4 text-zinc-300">{recording.label?.name || '—'}</td>
                  <td className="px-6 py-4 text-zinc-400">
                    {recording.duration ? `${Math.floor(recording.duration / 60)}:${String(recording.duration % 60).padStart(2, '0')}` : '—'}
                  </td>
                  <td className="px-6 py-4">
                    {recording.workId ? (
                      <Badge variant="violet">{works.find(w => w.id === recording.workId)?.title || 'Linked'}</Badge>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setEditingRecording(recording); setShowModal(true); }}
                        className="p-2 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(recording.id)}
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

        {filteredRecordings.length === 0 && (
          <EmptyState
            icon={<Disc3 className="w-12 h-12" />}
            title="No recordings found"
            description={search ? 'Try a different search term' : 'Add your first recording to get started'}
            action={
              !search && (
                <Button onClick={() => { setEditingRecording(null); setShowModal(true); }} leftIcon={<Plus className="w-4 h-4" />}>
                  Add Recording
                </Button>
              )
            }
          />
        )}
      </Card>

      <RecordingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        recording={editingRecording}
        artists={artists}
        labels={labels}
        works={works}
        onSave={(data) => {
          if (editingRecording) {
            updateRecording(editingRecording.id, data);
            addToast({ type: 'success', title: 'Recording updated' });
          } else {
            addRecording(data as Omit<Recording, 'id' | 'createdAt' | 'updatedAt'>);
            addToast({ type: 'success', title: 'Recording added' });
          }
          setShowModal(false);
        }}
      />
    </PageLayout>
  );
}

interface RecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  recording: Recording | null;
  artists: Array<{ id: string; firstName?: string; lastName: string }>;
  labels: Array<{ id: string; name: string }>;
  works: Array<{ id: string; title: string }>;
  onSave: (data: Partial<Recording>) => void;
}

function RecordingModal({ isOpen, onClose, recording, artists, labels, works, onSave }: RecordingModalProps) {
  const [formData, setFormData] = useState<Partial<Recording>>(
    recording || { title: '', isrc: '', duration: 0, artistIds: [], labelId: '', workId: '' }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={recording ? 'Edit Recording' : 'Add Recording'} size="lg">
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <Input
          label="Title"
          value={formData.title || ''}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="ISRC"
            value={formData.isrc || ''}
            onChange={(e) => setFormData({ ...formData, isrc: e.target.value })}
            placeholder="XX-XXX-00-00000"
          />
          <Input
            label="Duration (seconds)"
            type="number"
            value={formData.duration || 0}
            onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Artist"
            options={[{ value: '', label: 'Select...' }, ...artists.map((a) => ({ value: a.id, label: `${a.firstName || ''} ${a.lastName}`.trim() }))]}
            value={formData.artistIds?.[0] || ''}
            onChange={(e) => setFormData({ ...formData, artistIds: e.target.value ? [e.target.value] : [] })}
          />
          <Select
            label="Label"
            options={[{ value: '', label: 'Select...' }, ...labels.map((l) => ({ value: l.id, label: l.name }))]}
            value={formData.labelId || ''}
            onChange={(e) => setFormData({ ...formData, labelId: e.target.value || undefined })}
          />
        </div>

        <Select
          label="Linked Work"
          options={[{ value: '', label: 'No linked work' }, ...works.map((w) => ({ value: w.id, label: w.title }))]}
          value={formData.workId || ''}
          onChange={(e) => setFormData({ ...formData, workId: e.target.value || undefined })}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" glow>{recording ? 'Update Recording' : 'Add Recording'}</Button>
        </div>
      </form>
    </Modal>
  );
}
