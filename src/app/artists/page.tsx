'use client';

import { useState } from 'react';
import { useStore } from '@/store';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, Badge, Button, Input, Modal, EmptyState } from '@/components/ui/index';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mic2, Plus, Search, Edit, Trash2, Upload } from 'lucide-react';
import type { Artist } from '@/types';
import { formatDate } from '@/lib/utils';

const getArtistName = (artist: Artist) => {
  if (artist.firstName) {
    return `${artist.firstName} ${artist.lastName}`;
  }
  return artist.lastName;
};

export default function ArtistsPage() {
  const { artists, addArtist, updateArtist, deleteArtist, addToast } = useStore();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);

  const filteredArtists = artists.filter(
    (a) =>
      (getArtistName(a) ?? '').toLowerCase().includes(search.toLowerCase()) ||
      a.isni?.includes(search)
  );

  const handleDelete = (id: string) => {
    if (confirm('Delete this artist?')) {
      deleteArtist(id);
      addToast({ type: 'success', title: 'Artist deleted' });
    }
  };

  return (
    <PageLayout
      title="Artists"
      description={`Manage ${artists.length} performing artists`}
      icon={Mic2}
      actions={
        <>
          <Button onClick={() => { setEditingArtist(null); setShowModal(true); }} leftIcon={<Plus className="w-4 h-4" />} glow>
            Add Artist
          </Button>
          <Link href="/import">
            <Button variant="ghost" leftIcon={<Upload className="w-4 h-4" />}>Import</Button>
          </Link>
        </>
      }
    >
      <Card className="p-5 mb-6">
        <Input
          placeholder="Search by name or ISNI..."
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
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">ISNI</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">IPN</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredArtists.map((artist) => (
                <motion.tr
                  key={artist.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500/20 to-rose-600/10 border border-rose-500/20 flex items-center justify-center">
                        <Mic2 className="w-5 h-5 text-rose-400" />
                      </div>
                      <p className="font-medium text-white">{getArtistName(artist)}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-zinc-400">{artist.isni || '—'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-zinc-400">{artist.ipn || '—'}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-500">{formatDate(artist.createdAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setEditingArtist(artist); setShowModal(true); }}
                        className="p-2 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(artist.id)}
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

        {filteredArtists.length === 0 && (
          <EmptyState
            icon={<Mic2 className="w-12 h-12" />}
            title="No artists found"
            description={search ? 'Try a different search term' : 'Add your first artist to get started'}
            action={
              !search && (
                <Button onClick={() => { setEditingArtist(null); setShowModal(true); }} leftIcon={<Plus className="w-4 h-4" />}>
                  Add Artist
                </Button>
              )
            }
          />
        )}
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingArtist ? 'Edit Artist' : 'Add Artist'} size="md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const data = {
              firstName: (form.elements.namedItem('firstName') as HTMLInputElement).value || undefined,
              lastName: (form.elements.namedItem('lastName') as HTMLInputElement).value,
              isni: (form.elements.namedItem('isni') as HTMLInputElement).value || undefined,
              ipn: (form.elements.namedItem('ipn') as HTMLInputElement).value || undefined,
            };
            const dataWithDefaults = {
              // Required-by-store fields (draft-safe defaults)
              name: `${data.firstName ? `${data.firstName} ` : ''}${data.lastName}`.trim(),
              artistId: `ART${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
              isControlled: false,
              recordingIds: [],
              releaseIds: [],
              artistShareIds: [],
              producerCreditIds: [],
              ...data,
            };
            if (editingArtist) {
              updateArtist(editingArtist.id, data);
              addToast({ type: 'success', title: 'Artist updated' });
            } else {
              const artistPayload: Omit<Artist, 'id' | 'createdAt' | 'updatedAt'> = dataWithDefaults as Omit<Artist, 'id' | 'createdAt' | 'updatedAt'>;
              addArtist(artistPayload);
              addToast({ type: 'success', title: 'Artist added' });
            }
            setShowModal(false);
          }}
          className="p-6 space-y-5"
        >
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" name="firstName" defaultValue={editingArtist?.firstName || ''} />
            <Input label="Last Name" name="lastName" defaultValue={editingArtist?.lastName || ''} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="ISNI" name="isni" defaultValue={editingArtist?.isni || ''} placeholder="0000 0001 2345 6789" />
            <Input label="IPN" name="ipn" defaultValue={editingArtist?.ipn || ''} placeholder="Performer number" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" glow>{editingArtist ? 'Update Artist' : 'Add Artist'}</Button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  );
}
