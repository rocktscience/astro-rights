'use client';

import { useState } from 'react';
import { useStore } from '@/store';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, Badge, Button, Input, Modal, Select, EmptyState, Checkbox } from '@/components/ui/index';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Plus, Search, Edit, Trash2, FileSignature, Upload } from 'lucide-react';
import type { Writer, Society } from '@/types';
import { formatDate } from '@/lib/utils';

export default function WritersPage() {
  const { writers, societies, agreements, addWriter, updateWriter, deleteWriter, addToast } = useStore();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingWriter, setEditingWriter] = useState<Writer | null>(null);

  const filteredWriters = writers.filter(
    (w) =>
      (w.lastName ?? '').toLowerCase().includes(search.toLowerCase()) ||
      w.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      w.ipiNameNumber?.includes(search)
  );

  const handleDelete = (id: string) => {
    if (confirm('Delete this writer?')) {
      deleteWriter(id);
      addToast({ type: 'success', title: 'Writer deleted' });
    }
  };

  const handleEdit = (writer: Writer) => {
    setEditingWriter(writer);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingWriter(null);
    setShowModal(true);
  };

  const publishingAgreements = agreements.filter(a => 
    a.type === 'publishing' || a.type === 'co-publishing' || a.type === 'administration'
  );

  return (
    <PageLayout
      title="Writers"
      description={`Manage ${writers.length} songwriters and composers`}
      icon={Users}
      actions={
        <>
          <Button onClick={handleAdd} leftIcon={<Plus className="w-4 h-4" />} glow>
            Add Writer
          </Button>
          <Link href="/import">
            <Button variant="ghost" leftIcon={<Upload className="w-4 h-4" />}>Import</Button>
          </Link>
        </>
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
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Agreement</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredWriters.map((writer) => (
                <motion.tr
                  key={writer.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/20 flex items-center justify-center">
                        <span className="text-sm font-medium text-cyan-400">
                          {writer.firstName?.[0] || ''}{writer.lastName?.[0] || ''}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {writer.lastName}, {writer.firstName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-zinc-400">
                      {writer.ipiNameNumber || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="default">{writer.prAffiliation?.name || writer.prAffiliation?.code || '—'}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    {writer.agreementId ? (
                      <div className="flex items-center gap-2">
                        <FileSignature className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm text-zinc-300">Active</span>
                      </div>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={writer.isControlled ? 'success' : 'default'} dot>
                      {writer.isControlled ? 'Controlled' : 'Uncontrolled'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-500">{formatDate(writer.createdAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(writer)}
                        className="p-2 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(writer.id)}
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

        {filteredWriters.length === 0 && (
          <EmptyState
            icon={<Users className="w-12 h-12" />}
            title="No writers found"
            description={search ? 'Try a different search term' : 'Add your first writer to get started'}
            action={
              !search && (
                <Button onClick={handleAdd} leftIcon={<Plus className="w-4 h-4" />}>
                  Add Writer
                </Button>
              )
            }
          />
        )}
      </Card>

      <WriterModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        writer={editingWriter}
        societies={societies}
        agreements={publishingAgreements.map((a) => ({ id: a.id, title: a.title ?? a.agreementNumber ?? 'Untitled agreement' }))}
        onSave={(data) => {
          if (editingWriter) {
            updateWriter(editingWriter.id, data);
            addToast({ type: 'success', title: 'Writer updated' });
          } else {
            addWriter(data as Omit<Writer, 'id' | 'createdAt' | 'updatedAt'>);
            addToast({ type: 'success', title: 'Writer added' });
          }
          setShowModal(false);
        }}
      />
    </PageLayout>
  );
}

interface WriterModalProps {
  isOpen: boolean;
  onClose: () => void;
  writer: Writer | null;
  societies: Society[];
  agreements: Array<{ id: string; title: string }>;
  onSave: (data: Partial<Writer>) => void;
}

function WriterModal({ isOpen, onClose, writer, societies, agreements, onSave }: WriterModalProps) {
  const [firstName, setFirstName] = useState(writer?.firstName || '');
  const [lastName, setLastName] = useState(writer?.lastName || '');
  const [ipiNameNumber, setIpiNameNumber] = useState(writer?.ipiNameNumber || '');
  const [prAffiliationCode, setPrAffiliationCode] = useState(writer?.prAffiliation?.code || '');
  const [mrAffiliationCode, setMrAffiliationCode] = useState(writer?.mrAffiliation?.code || '');
  const [isControlled, setIsControlled] = useState(writer?.isControlled ?? false);
  const [agreementId, setAgreementId] = useState(writer?.agreementId || '');

  // Reset form when writer changes
  useState(() => {
    setFirstName(writer?.firstName || '');
    setLastName(writer?.lastName || '');
    setIpiNameNumber(writer?.ipiNameNumber || '');
    setPrAffiliationCode(writer?.prAffiliation?.code || '');
    setMrAffiliationCode(writer?.mrAffiliation?.code || '');
    setIsControlled(writer?.isControlled ?? false);
    setAgreementId(writer?.agreementId || '');
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Partial<Writer> = {
      firstName,
      lastName,
      ipiNameNumber: ipiNameNumber || undefined,
      prAffiliation: prAffiliationCode ? societies.find(s => s.code === prAffiliationCode) : undefined,
      mrAffiliation: mrAffiliationCode ? societies.find(s => s.code === mrAffiliationCode) : undefined,
      isControlled,
      agreementId: agreementId || undefined,
    };
    onSave(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={writer ? 'Edit Writer' : 'Add Writer'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <Input
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <Input
          label="IPI Name Number"
          value={ipiNameNumber}
          onChange={(e) => setIpiNameNumber(e.target.value)}
          placeholder="00000000000"
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="PR Society"
            options={[
              { value: '', label: 'Select...' },
              ...societies.map((s) => ({ value: s.code, label: `${s.code} - ${s.name}` })),
            ]}
            value={prAffiliationCode}
            onChange={(e) => setPrAffiliationCode(e.target.value)}
          />
          <Select
            label="MR Society"
            options={[
              { value: '', label: 'Select...' },
              ...societies.map((s) => ({ value: s.code, label: `${s.code} - ${s.name}` })),
            ]}
            value={mrAffiliationCode}
            onChange={(e) => setMrAffiliationCode(e.target.value)}
          />
        </div>

        <Select
          label="Publishing Agreement"
          options={[
            { value: '', label: 'No agreement' },
            ...agreements.map((a) => ({ value: a.id, label: a.title })),
          ]}
          value={agreementId}
          onChange={(e) => setAgreementId(e.target.value)}
        />

        <Checkbox
          label="Controlled Writer"
          checked={isControlled}
          onChange={(e) => setIsControlled(e.target.checked)}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" glow>
            {writer ? 'Update Writer' : 'Add Writer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
