'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { Sidebar } from '@/components/layout/Sidebar';
import { ToastContainer } from '@/components/ui/Toast';
import { Card, Badge, Button, Input, Select } from '@/components/ui/index';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import type { WriterShare, PublisherShare } from '@/types';

export default function NewWorkPage() {
  const router = useRouter();
  const { sidebarCollapsed, writers, publishers, societies, addWork, addToast } = useStore();
  
  const [title, setTitle] = useState('');
  const [iswc, setIswc] = useState('');
  const [versionType, setVersionType] = useState('ORI');
  const [language, setLanguage] = useState('EN');
  const [writerShares, setWriterShares] = useState<Partial<WriterShare>[]>([]);
  const [publisherShares, setPublisherShares] = useState<Partial<PublisherShare>[]>([]);

  const addWriterShare = () => {
    setWriterShares([...writerShares, { writerId: '', capacity: 'CA', prOwnership: 0, mrOwnership: 0, srOwnership: 0 }]);
  };

  const addPublisherShare = () => {
    setPublisherShares([...publisherShares, { publisherId: '', role: 'E', prOwnership: 100, mrOwnership: 100, srOwnership: 100, prCollection: 0, mrCollection: 0, srCollection: 0, territories: [{ code: '2136', name: 'World', included: true }] }]);
  };

  const updateWriterShare = (index: number, field: string, value: any) => {
    const updated = [...writerShares];
    (updated[index] as any)[field] = value;
    if (field === 'writerId') {
      updated[index].writer = writers.find(w => w.id === value);
    }
    setWriterShares(updated);
  };

  const updatePublisherShare = (index: number, field: string, value: any) => {
    const updated = [...publisherShares];
    (updated[index] as any)[field] = value;
    if (field === 'publisherId') {
      updated[index].publisher = publishers.find(p => p.id === value);
    }
    setPublisherShares(updated);
  };

  const removeWriterShare = (index: number) => {
    setWriterShares(writerShares.filter((_, i) => i !== index));
  };

  const removePublisherShare = (index: number) => {
    setPublisherShares(publisherShares.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!title) {
      addToast({ type: 'error', title: 'Title is required' });
      return;
    }

    addWork({
      workId: '',
      title,
      iswc: iswc || undefined,
      versionType: versionType as any,
      language,
      writerShares: writerShares as WriterShare[],
      publisherShares: publisherShares as PublisherShare[],
      alternateTitles: [],
      recordings: [],
      registrations: [],
      status: 'draft',
    });

    addToast({ type: 'success', title: 'Work created' });
    router.push('/works');
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Sidebar />
      <ToastContainer />

      <main className="transition-all duration-300" style={{ marginLeft: sidebarCollapsed ? 72 : 256 }}>
        <div className="p-8 max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={() => router.back()}><ArrowLeft className="w-5 h-5" /></Button>
            <div>
              <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-zinc-900 dark:text-white">New Work</motion.h1>
              <p className="text-zinc-500">Create a new musical work</p>
            </div>
          </div>

          <Card className="p-6 mb-6">
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Input label="Work Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <Input label="ISWC" value={iswc} onChange={(e) => setIswc(e.target.value)} placeholder="T-000000000-0" />
              <Select label="Version Type" options={[{ value: 'ORI', label: 'Original' }, { value: 'MOD', label: 'Modified' }, { value: 'ARR', label: 'Arrangement' }]} value={versionType} onChange={(e) => setVersionType(e.target.value)} />
              <Select label="Language" options={[{ value: 'EN', label: 'English' }, { value: 'ES', label: 'Spanish' }, { value: 'PT', label: 'Portuguese' }, { value: 'FR', label: 'French' }]} value={language} onChange={(e) => setLanguage(e.target.value)} />
            </div>
          </Card>

          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-zinc-900 dark:text-white">Writer Shares</h3>
              <Button size="sm" onClick={addWriterShare} leftIcon={<Plus className="w-4 h-4" />}>Add Writer</Button>
            </div>
            {writerShares.length === 0 ? (
              <p className="text-zinc-500 text-sm">No writers added yet</p>
            ) : (
              <div className="space-y-4">
                {writerShares.map((share, idx) => (
                  <div key={idx} className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg">
                    <div className="grid grid-cols-6 gap-3">
                      <div className="col-span-2">
                        <Select label="Writer" options={[{ value: '', label: 'Select...' }, ...writers.map(w => ({ value: w.id, label: `${w.firstName} ${w.lastName}` }))]} value={share.writerId || ''} onChange={(e) => updateWriterShare(idx, 'writerId', e.target.value)} />
                      </div>
                      <Select label="Role" options={[{ value: 'CA', label: 'Composer/Author' }, { value: 'C', label: 'Composer' }, { value: 'A', label: 'Author' }, { value: 'AR', label: 'Arranger' }]} value={share.capacity || 'CA'} onChange={(e) => updateWriterShare(idx, 'capacity', e.target.value)} />
                      <Input label="PR %" type="number" min="0" max="100" value={share.prOwnership || 0} onChange={(e) => updateWriterShare(idx, 'prOwnership', parseFloat(e.target.value))} />
                      <Input label="MR %" type="number" min="0" max="100" value={share.mrOwnership || 0} onChange={(e) => updateWriterShare(idx, 'mrOwnership', parseFloat(e.target.value))} />
                      <div className="flex items-end">
                        <Button variant="ghost" size="sm" onClick={() => removeWriterShare(idx)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-zinc-900 dark:text-white">Publisher Shares</h3>
              <Button size="sm" onClick={addPublisherShare} leftIcon={<Plus className="w-4 h-4" />}>Add Publisher</Button>
            </div>
            {publisherShares.length === 0 ? (
              <p className="text-zinc-500 text-sm">No publishers added yet</p>
            ) : (
              <div className="space-y-4">
                {publisherShares.map((share, idx) => (
                  <div key={idx} className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg">
                    <div className="grid grid-cols-6 gap-3">
                      <div className="col-span-2">
                        <Select label="Publisher" options={[{ value: '', label: 'Select...' }, ...publishers.map(p => ({ value: p.id, label: p.name }))]} value={share.publisherId || ''} onChange={(e) => updatePublisherShare(idx, 'publisherId', e.target.value)} />
                      </div>
                      <Select label="Role" options={[{ value: 'E', label: 'Original Publisher' }, { value: 'AM', label: 'Administrator' }, { value: 'SE', label: 'Sub-Publisher' }]} value={share.role || 'E'} onChange={(e) => updatePublisherShare(idx, 'role', e.target.value)} />
                      <Input label="PR Coll %" type="number" min="0" max="100" value={share.prCollection || 0} onChange={(e) => updatePublisherShare(idx, 'prCollection', parseFloat(e.target.value))} />
                      <Input label="MR Coll %" type="number" min="0" max="100" value={share.mrCollection || 0} onChange={(e) => updatePublisherShare(idx, 'mrCollection', parseFloat(e.target.value))} />
                      <div className="flex items-end">
                        <Button variant="ghost" size="sm" onClick={() => removePublisherShare(idx)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => router.back()}>Cancel</Button>
            <Button onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>Save Work</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
