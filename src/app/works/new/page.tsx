'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, Badge, Button, Input, Select } from '@/components/ui/index';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import type { WriterShare, PublisherShare, VersionType, WriterCapacity, PublisherRole } from '@/types';

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
    setWriterShares([...writerShares, { id: uuidv4(), writerId: '', capacity: 'CA', prOwnership: 0, mrOwnership: 0, srOwnership: 0 }]);
  };

  const addPublisherShare = () => {
    setPublisherShares([...publisherShares, { id: uuidv4(), publisherId: '', role: 'E', prOwnership: 100, mrOwnership: 100, srOwnership: 100, prCollection: 0, mrCollection: 0, srCollection: 0, territories: [{ code: '2136', name: 'World', included: true }] }]);
  };

  // Strongly-typed updater helpers to avoid unchecked 'any' usage
  const updateWriterShare = <K extends keyof Partial<WriterShare>>(index: number, field: K, value: Partial<WriterShare>[K]) => {
    setWriterShares((prev) => prev.map((s, i) => {
      if (i !== index) return s;
      const updated: Partial<WriterShare> = { ...s, [field]: value };
      if (field === 'writerId') {
        updated.writer = writers.find(w => w.id === value as string);
      }
      return updated;
    }));
  };

  const updatePublisherShare = <K extends keyof Partial<PublisherShare>>(index: number, field: K, value: Partial<PublisherShare>[K]) => {
    setPublisherShares((prev) => prev.map((s, i) => {
      if (i !== index) return s;
      const updated: Partial<PublisherShare> = { ...s, [field]: value };
      if (field === 'publisherId') {
        updated.publisher = publishers.find(p => p.id === value as string);
      }
      return updated;
    }));
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
      versionType: versionType as VersionType,
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
    <PageLayout
      title="New Work"
      description="Create a new musical work"
      actions={
        <>
          <Button variant="ghost" onClick={() => router.back()}><ArrowLeft className="w-4 h-4" /></Button>
          <Button variant="secondary" onClick={() => router.back()}>Cancel</Button>
          <Button onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>Save Work</Button>
        </>
      }
    >
      <div className="p-8 max-w-4xl">
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
                  <div key={share.id ?? idx} className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg">
                    <div className="grid grid-cols-6 gap-3">
                      <div className="col-span-2">
                        <Select label="Writer" options={[{ value: '', label: 'Select...' }, ...writers.map(w => ({ value: w.id, label: `${w.firstName} ${w.lastName}` }))]} value={share.writerId || ''} onChange={(e) => updateWriterShare(idx, 'writerId', e.target.value)} />
                      </div>
                        <Select label="Role" options={[{ value: 'CA', label: 'Composer/Author' }, { value: 'C', label: 'Composer' }, { value: 'A', label: 'Author' }, { value: 'AR', label: 'Arranger' }]} value={share.capacity || 'CA'} onChange={(e) => updateWriterShare(idx, 'capacity', e.target.value as WriterCapacity)} />
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
                  <div key={share.id ?? idx} className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg">
                    <div className="grid grid-cols-6 gap-3">
                      <div className="col-span-2">
                        <Select label="Publisher" options={[{ value: '', label: 'Select...' }, ...publishers.map(p => ({ value: p.id, label: p.name }))]} value={share.publisherId || ''} onChange={(e) => updatePublisherShare(idx, 'publisherId', e.target.value)} />
                      </div>
                        <Select label="Role" options={[{ value: 'E', label: 'Original Publisher' }, { value: 'AM', label: 'Administrator' }, { value: 'SE', label: 'Sub-Publisher (Exclusive)' }]} value={share.role || 'E'} onChange={(e) => updatePublisherShare(idx, 'role', e.target.value as PublisherRole)} />
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
    </PageLayout>
  );
}
