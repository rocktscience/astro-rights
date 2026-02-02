import React from 'react';
import { StatusBadge } from '@/components/design-system/StatusBadge';
import { Card } from '@/components/ui/index';
import { ReadinessPanel } from '@/components/design-system/ReadinessPanel';
import { EntityHeader } from '@/components/design-system/EntityHeader';
import { SectionCard } from '@/components/design-system/SectionCard';
import Link from 'next/link';

// TODO: Replace with real data fetching
const mockWork = {
  title: 'Midnight City',
  alternateTitles: ['Ciudad de Medianoche'],
  iswc: 'T-123.456.789-0',
  duration: 247,
  genre: 'Pop, Synth-pop',
  language: 'English',
  createdAt: '2026-11-14',
  status: 'registered',
  writers: [
    { name: 'You', share: 0.5, publisher: 'Self-published', territory: 'Worldwide', admin: 'You' },
    { name: 'Maria', share: 0.3, publisher: 'Blue Music Publishing', territory: 'Americas', admin: 'ASCAP' },
    { name: 'James', share: 0.2, publisher: 'Red Publishing', territory: 'Worldwide', admin: 'SESAC' },
  ],
  publisherNotes: 'A Sub-publisher needed for UKEU',
  musicalDetails: { tempo: 126, key: 'A minor', timeSignature: '4/4', mood: 'Energetic, Nocturnal' },
  copyright: {
    date: '2026-11-14',
    owner: 'Rocket Science Music Publishing',
    registered: true,
  },
  recordings: [
    { title: 'Studio Version', isrc: 'US-RS6-24-12345', artist: 'Sarah Chen', type: 'main' },
    { title: 'Acoustic Version', isrc: 'US-RS6-24-12346', artist: 'Sarah Chen', type: 'alt', warning: 'Missing Sonic alternatives' },
  ],
  releases: [
    { title: 'Midnight Dreams (Album)', date: '2025-12-15' },
    { title: 'Summer Singles (EP)', date: '2026-01-10' },
  ],
};

export default function WorkDetailsPage() {
  const work = mockWork;
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <EntityHeader
          title={work.title}
          subtitle={work.alternateTitles?.join(', ')}
          meta={<>
            <span className="mr-4">ISWC: <span className="font-mono">{work.iswc}</span></span>
            <span className="mr-4">Duration: {Math.floor(work.duration/60)}:{String(work.duration%60).padStart(2,'0')}</span>
            <span className="mr-4">Genre: {work.genre}</span>
            <span className="mr-4">Language: {work.language}</span>
            <span>Created: {work.createdAt}</span>
          </>}
          actions={<StatusBadge status="ok">REGISTERED</StatusBadge>}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2 flex flex-col gap-6">
            <SectionCard title={`Writers & Publishing (${work.writers.length} writers)`}>
              <div className="mb-2">
                <div className="flex gap-2 mb-1">
                  <span className="text-xs text-zinc-400">Writers (Total must = 100%)</span>
                  <span className="ml-auto text-xs text-zinc-400">✔️</span>
                </div>
                <div className="flex gap-2 mb-2">
                  <div className="h-3 rounded bg-violet-500" style={{ width: '50%' }} />
                  <div className="h-3 rounded bg-blue-500" style={{ width: '30%' }} />
                  <div className="h-3 rounded bg-green-500" style={{ width: '20%' }} />
                </div>
              </div>
              <table className="w-full text-sm mb-2">
                <thead>
                  <tr className="text-zinc-400">
                    <th className="text-left font-normal">Writer</th>
                    <th className="text-left font-normal">Publisher</th>
                    <th className="text-left font-normal">Territory</th>
                    <th className="text-left font-normal">Admin</th>
                    <th className="text-right font-normal">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {work.writers.map((w, i) => (
                    <tr key={i} className="border-b border-zinc-800">
                      <td className="py-1 text-white">{w.name}</td>
                      <td className="py-1 text-zinc-300">{w.publisher}</td>
                      <td className="py-1 text-zinc-300">{w.territory}</td>
                      <td className="py-1 text-zinc-300">{w.admin}</td>
                      <td className="py-1 text-right text-zinc-300">{Math.round(w.share*100)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {work.publisherNotes && (
                <div className="text-xs text-yellow-400 mt-1">⚠ {work.publisherNotes}</div>
              )}
            </SectionCard>

            <SectionCard title="Musical Details (Optional)">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-zinc-400">Tempo (BPM)</div>
                  <div className="text-white">{work.musicalDetails.tempo}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-400">Key Signature</div>
                  <div className="text-white">{work.musicalDetails.key}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-400">Time Signature</div>
                  <div className="text-white">{work.musicalDetails.timeSignature}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-400">Mood</div>
                  <div className="text-white">{work.musicalDetails.mood}</div>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Copyright & Registration">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-zinc-400">Copyright Date</div>
                  <div className="text-white">{work.copyright.date}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-400">Copyright Owner</div>
                  <div className="text-white">{work.copyright.owner}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-zinc-400">Registration</div>
                  <div className="text-white flex items-center gap-2">
                    {work.copyright.registered ? (
                      <span className="text-green-400">✔ Registered with U.S. Copyright Office</span>
                    ) : (
                      <span className="text-yellow-400">⚠ Not registered</span>
                    )}
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>

          <div className="flex flex-col gap-6">
            <SectionCard title="Recordings">
              {work.recordings.map((rec, i) => (
                <div key={i} className="mb-2 p-3 rounded bg-zinc-800/60 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{rec.title}</span>
                    {rec.warning && <span className="text-xs text-yellow-400 ml-2">⚠ {rec.warning}</span>}
                  </div>
                  <div className="text-xs text-zinc-400">ISRC: {rec.isrc}</div>
                  <div className="text-xs text-zinc-400">Artist: {rec.artist}</div>
                </div>
              ))}
              <Link href="#" className="text-xs text-blue-400 hover:underline mt-2 inline-block">+ Add Recording</Link>
            </SectionCard>

            <SectionCard title="Releases">
              {work.releases.map((rel, i) => (
                <div key={i} className="mb-2 p-3 rounded bg-zinc-800/60 flex flex-col gap-1">
                  <div className="font-medium text-white">{rel.title}</div>
                  <div className="text-xs text-zinc-400">Release Date: {rel.date}</div>
                </div>
              ))}
              <Link href="#" className="text-xs text-blue-400 hover:underline mt-2 inline-block">+ Add Release</Link>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}
