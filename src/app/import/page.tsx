'use client';

import { useState, useCallback } from 'react';
import { useStore } from '@/store';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, Button, Badge, Tabs } from '@/components/ui/index';
import { motion } from 'framer-motion';
import { 
  Upload, FileText, Music, DollarSign, Users, CheckCircle, AlertCircle, Loader2,
  Building2, Disc3, UserCircle, Handshake, Contact2, Briefcase, Globe, Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RoyaltyLineItem } from '@/types';
import {
  parseCSV,
  mapLabelFromCSV,
  mapArtistFromCSV,
  mapPublisherFromCSV,
  mapWriterFromCSV,
  mapContactFromCSV,
  mapInterestedPartyFromCSV,
  mapAgreementFromCSV,
  mapAgreementPartyFromCSV,
  mapAgreementTerritoryFromCSV,
  importEntities,
} from '@/lib/csv-import';

type ImportType = 
  | 'labels' 
  | 'artists' 
  | 'publishers' 
  | 'writers' 
  | 'contacts'
  | 'interestedParties'
  | 'agreements'
  | 'agreementParties'
  | 'agreementTerritories'
  | 'works' 
  | 'royalties' 
  | 'ack';

export default function ImportPage() {
  const { 
    addWork, addWriter, addRoyaltyStatement, cwrExports, updateCWRExport, addToast,
    bulkAddLabels, bulkAddArtists, bulkAddPublishers, bulkAddWriters,
    bulkAddContacts, bulkAddInterestedParties, bulkAddAgreements,
    bulkAddAgreementParties, bulkAddAgreementTerritories,
    clearEntityData,
    labels, artists, publishers, writers, contacts, interestedParties,
    agreements, agreementParties, agreementTerritories,
  } = useStore();
  
  const [activeTab, setActiveTab] = useState<ImportType>('labels');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResults, setImportResults] = useState<{ success: number; errors: number; messages: string[] } | null>(null);
  const [clearBeforeImport, setClearBeforeImport] = useState(false);

  const tabs = [
    { id: 'labels', label: 'Labels', icon: Disc3, count: labels.length },
    { id: 'artists', label: 'Artists', icon: UserCircle, count: artists.length },
    { id: 'publishers', label: 'Publishers', icon: Building2, count: publishers.length },
    { id: 'writers', label: 'Writers', icon: Users, count: writers.length },
    { id: 'contacts', label: 'Contacts', icon: Contact2, count: contacts.length },
    { id: 'interestedParties', label: 'Interested Parties', icon: Briefcase, count: interestedParties.length },
    { id: 'agreements', label: 'Agreements', icon: Handshake, count: agreements.length },
    { id: 'agreementParties', label: 'Agreement Parties', icon: Users, count: agreementParties.length },
    { id: 'agreementTerritories', label: 'Agreement Territories', icon: Globe, count: agreementTerritories.length },
    { id: 'works', label: 'Works', icon: Music },
    { id: 'royalties', label: 'Royalties', icon: DollarSign },
    { id: 'ack', label: 'ACK Files', icon: FileText },
  ];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await processFile(files[0]);
    }
  }, [activeTab]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setImportResults(null);

    try {
      const content = await file.text();
      let success = 0;
      let errors = 0;
      const messages: string[] = [];

      // Clear existing data if option is selected
      if (clearBeforeImport) {
        clearEntityData(activeTab);
        messages.push(`Cleared existing ${activeTab} data`);
      }

      // Import based on entity type
      if (activeTab === 'labels') {
        const { entities, stats } = importEntities(content, mapLabelFromCSV);
        if (entities.length > 0) {
          bulkAddLabels(entities);
        }
        success = stats.imported;
        errors = stats.skipped;
        messages.push(...stats.errors);
        
      } else if (activeTab === 'artists') {
        const { entities, stats } = importEntities(content, mapArtistFromCSV);
        if (entities.length > 0) {
          bulkAddArtists(entities);
        }
        success = stats.imported;
        errors = stats.skipped;
        messages.push(...stats.errors);
        
      } else if (activeTab === 'publishers') {
        const { entities, stats } = importEntities(content, mapPublisherFromCSV);
        if (entities.length > 0) {
          bulkAddPublishers(entities);
        }
        success = stats.imported;
        errors = stats.skipped;
        messages.push(...stats.errors);
        
      } else if (activeTab === 'writers') {
        const { entities, stats } = importEntities(content, mapWriterFromCSV);
        if (entities.length > 0) {
          bulkAddWriters(entities);
        }
        success = stats.imported;
        errors = stats.skipped;
        messages.push(...stats.errors);
        
      } else if (activeTab === 'contacts') {
        const { entities, stats } = importEntities(content, mapContactFromCSV);
        if (entities.length > 0) {
          bulkAddContacts(entities);
        }
        success = stats.imported;
        errors = stats.skipped;
        messages.push(...stats.errors);
        
      } else if (activeTab === 'interestedParties') {
        const { entities, stats } = importEntities(content, mapInterestedPartyFromCSV);
        if (entities.length > 0) {
          bulkAddInterestedParties(entities);
        }
        success = stats.imported;
        errors = stats.skipped;
        messages.push(...stats.errors);
        
      } else if (activeTab === 'agreements') {
        const { entities, stats } = importEntities(content, mapAgreementFromCSV);
        if (entities.length > 0) {
          bulkAddAgreements(entities);
        }
        success = stats.imported;
        errors = stats.skipped;
        messages.push(...stats.errors);
        
      } else if (activeTab === 'agreementParties') {
        const { entities, stats } = importEntities(content, mapAgreementPartyFromCSV);
        if (entities.length > 0) {
          bulkAddAgreementParties(entities);
        }
        success = stats.imported;
        errors = stats.skipped;
        messages.push(...stats.errors);
        
      } else if (activeTab === 'agreementTerritories') {
        const { entities, stats } = importEntities(content, mapAgreementTerritoryFromCSV);
        if (entities.length > 0) {
          bulkAddAgreementTerritories(entities);
        }
        success = stats.imported;
        errors = stats.skipped;
        messages.push(...stats.errors);
        
      } else if (activeTab === 'works') {
        const records = parseCSV(content);
        if (records && records.length > 0) {
          records.forEach((row, idx) => {
            try {
              const normalized: Record<string, string> = {};
              Object.keys(row).forEach((k) => {
                normalized[k.replace(/\s+/g, '').toLowerCase()] = row[k];
              });

              const workId = normalized['workid'] || normalized['work_id'] || normalized['workid'] || `RWOR${10000 + idx + 1}`;
              const titleVal = normalized['title'] || `Work ${idx + 1}`;

              addWork({
                workId,
                title: titleVal,
                iswc: normalized['iswc'] || undefined,
                versionType: (normalized['versiontype'] || normalized['version_type'] || 'ORI') as 'ORI' | 'MOD' | 'ARR',
                status: 'draft',
                language: normalized['language'] || 'EN',
                writerShares: [],
                publisherShares: [],
                alternateTitles: [],
                recordings: [],
                registrations: [],
              });
              success++;
            } catch (err) {
              errors++;
              messages.push(`Row ${idx + 2}: Failed to import`);
            }
          });
        }
      } else if (activeTab === 'royalties') { 
        const records = parseCSV(content);
        if (records && records.length > 0) {
          const lineItems: RoyaltyLineItem[] = [];
          let totalGross = 0;
          let totalNet = 0;
          const statementId = `stmt-${Date.now()}`;

          records.forEach((row, idx) => {
            try {
              const normalized: Record<string, string> = {};
              Object.keys(row).forEach((k) => {
                normalized[k.replace(/\s+/g, '').toLowerCase()] = row[k];
              });

              const grossAmount = parseFloat(normalized['amount'] || normalized['gross'] || '0') || 0;
              const netAmount = (parseFloat(normalized['net'] || normalized['amount'] || normalized['gross'] || '0') || 0) * 0.9;
              totalGross += grossAmount;
              totalNet += netAmount;

              lineItems.push({
                id: `li-${Date.now()}-${idx + 1}`,
                statementId,
                workId: normalized['workid'] || normalized['work_id'] || undefined,
                workTitle: normalized['title'] || normalized['worktitle'] || '',
                grossAmount,
                netAmount,
                rightType: (normalized['righttype'] || normalized['right_type'] || 'PR') as any,
                matched: false,
              });
              success++;
            } catch (err) {
              errors++;
              messages.push(`Row ${idx + 2}: Failed to parse royalty row`);
            }
          });

          if (lineItems.length > 0) {
            addRoyaltyStatement({
              period: file.name.replace(/\.[^/.]+$/, ''),
              source: 'Import',
              filename: file.name,
              totalGross,
              totalNet,
              currency: 'USD',
              lineItems,
            });
            messages.push(`Created statement with ${lineItems.length} line items`);
          }
        }
      } else if (activeTab === 'ack') {
        // Parse ACK file
        const lines = content.split('\n');
        for (const line of lines) {
          if (line.startsWith('HDR') || line.startsWith('ACK') || line.startsWith('MSG')) {
            const filename = line.substring(3, 23).trim();
            // Map NP (Not Processed) to draft, RA to acknowledged
            const status: 'draft' | 'sent' | 'acknowledged' = line.includes('RA') ? 'acknowledged' : line.includes('NP') ? 'draft' : 'sent';
            
            const matchingExport = cwrExports.find(e => 
              e.filename.includes(filename) || filename.includes(e.filename.replace('.V21', '').replace('.V22', ''))
            );
            
            if (matchingExport) {
              updateCWRExport(matchingExport.id, { status });
              success++;
              messages.push(`Updated ${matchingExport.filename} to ${status}`);
            }
          }
        }
        
        if (success === 0) {
          messages.push('No matching CWR exports found for this ACK file');
        }
      }

      setImportResults({ success, errors, messages });
      
      if (success > 0) {
        addToast({ type: 'success', title: `Imported ${success} items`, message: errors > 0 ? `${errors} items failed` : undefined });
      } else if (errors > 0) {
        addToast({ type: 'error', title: 'Import failed', message: `${errors} items could not be imported` });
      }
    } catch (error) {
      addToast({ type: 'error', title: 'Import failed', message: 'Could not process the file' });
    } finally {
      setIsProcessing(false);
    }
  };

  const Icon = tabs.find(t => t.id === activeTab)?.icon || FileText;

  return (
    <PageLayout
      title="Import"
      description="Import data from CSV files and ACK responses"
      icon={Upload}
    >
      {/* Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-1 p-1 bg-white/5 rounded-lg border border-white/5">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as ImportType); setImportResults(null); }}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap',
                  activeTab === tab.id
                    ? 'bg-white/10 text-white'
                    : 'text-zinc-400 hover:text-zinc-200'
                )}
              >
                <TabIcon className="w-4 h-4" />
                {tab.label}
                {'count' in tab && tab.count !== undefined && tab.count > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-violet-500/20 text-violet-400">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Options */}
      <div className="mb-4 flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
          <input
            type="checkbox"
            checked={clearBeforeImport}
            onChange={(e) => setClearBeforeImport(e.target.checked)}
            className="w-4 h-4 rounded border-white/20 bg-white/5 text-violet-500 focus:ring-violet-500"
          />
          Clear existing data before import
        </label>
        
        {tabs.find(t => t.id === activeTab)?.count !== undefined && 
         (tabs.find(t => t.id === activeTab) as any).count > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm(`Are you sure you want to clear all ${activeTab} data?`)) {
                clearEntityData(activeTab);
                addToast({ type: 'success', title: 'Data cleared', message: `All ${activeTab} have been removed` });
              }
            }}
            className="text-red-400 hover:text-red-300"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear {activeTab}
          </Button>
        )}
      </div>

      {/* Drop Zone */}
      <Card className="mb-6">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'relative border-2 border-dashed rounded-xl p-12 text-center transition-all',
            isDragging
              ? 'border-violet-500 bg-violet-500/5'
              : 'border-white/10 hover:border-white/20',
            isProcessing && 'pointer-events-none opacity-50'
          )}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-violet-400 animate-spin mb-4" />
              <p className="text-lg font-medium text-white">Processing file...</p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-600/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-violet-400" />
              </div>
              <p className="text-lg font-medium text-white mb-2">
                Drop your {activeTab === 'ack' ? 'ACK' : 'CSV'} file here
              </p>
              <p className="text-sm text-zinc-500 mb-4">or click to browse</p>
              <input
                type="file"
                accept={activeTab === 'ack' ? '.ack,.txt,.V21,.V22' : '.csv,.txt'}
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="secondary">Select File</Button>
            </>
          )}
        </div>
      </Card>

      {/* Import Results */}
      {importResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <div className="flex items-center gap-3 mb-4">
              {importResults.errors === 0 ? (
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              ) : (
                <AlertCircle className="w-6 h-6 text-amber-400" />
              )}
              <h3 className="text-lg font-semibold text-white">Import Results</h3>
            </div>
            
            <div className="flex gap-4 mb-4">
              <div className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-2xl font-bold text-emerald-400">{importResults.success}</p>
                <p className="text-sm text-zinc-500">Successful</p>
              </div>
              {importResults.errors > 0 && (
                <div className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-2xl font-bold text-red-400">{importResults.errors}</p>
                  <p className="text-sm text-zinc-500">Failed</p>
                </div>
              )}
            </div>
            
            {importResults.messages.length > 0 && (
              <div className="space-y-2">
                {importResults.messages.map((msg, i) => (
                  <p key={i} className="text-sm text-zinc-400">• {msg}</p>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {/* Help Text */}
      <Card className="mt-6 bg-white/[0.01]">
        <h4 className="text-sm font-medium text-white mb-3">Expected Format</h4>
        <div className="space-y-2 text-sm text-zinc-500">
          {activeTab === 'labels' && (
            <>
              <p>CSV export from Airtable: LabelGrid_view.csv</p>
              <p className="font-mono text-xs text-zinc-600">Name,Label ID,Controlled,Interested Party,DPID,PPL ID,Label Code,ISNI,Recordings,Releases</p>
            </>
          )}
          {activeTab === 'artists' && (
            <>
              <p>CSV export from Airtable: ArtistGrid_view.csv</p>
              <p className="font-mono text-xs text-zinc-600">Name,Artist Photo,Artist ID,Controlled,Interested Party,Artist Type,ISNI,...</p>
            </>
          )}
          {activeTab === 'publishers' && (
            <>
              <p>CSV export from Airtable: PublisherGrid_view.csv</p>
              <p className="font-mono text-xs text-zinc-600">Name,Publisher ID,IPI,PRO,Controlled,Mech,Sync,Interested Party,Admin/Co-Publisher,...</p>
            </>
          )}
          {activeTab === 'writers' && (
            <>
              <p>CSV export from Airtable: WriterGrid_view.csv</p>
              <p className="font-mono text-xs text-zinc-600">Name,Writer ID,IPI,PRO,Controlled,First Name,Middle Name,Last Name,IPI Name Number,...</p>
            </>
          )}
          {activeTab === 'contacts' && (
            <>
              <p>CSV export from Airtable: ContactGrid_view.csv</p>
              <p className="font-mono text-xs text-zinc-600">Contact Name,Interested Party,Contact ID,Current Client,First Name,Middle Name,Last Name,...</p>
            </>
          )}
          {activeTab === 'interestedParties' && (
            <>
              <p>CSV export from Airtable: Interested_PartyGrid_view.csv</p>
              <p className="font-mono text-xs text-zinc-600">Name,Interested Party ID,Type,Business Structure,Legal Name,Contacts,Company Owner,...</p>
            </>
          )}
          {activeTab === 'agreements' && (
            <>
              <p>CSV export from Airtable: AgreementGrid_view.csv</p>
              <p className="font-mono text-xs text-zinc-600">Agreement ID,Type,Agreement Type,Status,Language,Advance,Agreement Start Date,Term,...</p>
            </>
          )}
          {activeTab === 'agreementParties' && (
            <>
              <p>CSV export from Airtable: Agreement_PartyGrid_view.csv</p>
              <p className="font-mono text-xs text-zinc-600">Agreement Party ID,Agreement,Interested Party,Party Role,Chain,Signee,Share,Net/Gross,...</p>
            </>
          )}
          {activeTab === 'agreementTerritories' && (
            <>
              <p>CSV export from Airtable: Agreement_TerritoryGrid_view.csv</p>
              <p className="font-mono text-xs text-zinc-600">Agreement Territory ID,Agreement,Inclusion/Exclusion,Territory</p>
            </>
          )}
          {activeTab === 'works' && (
            <>
              <p>CSV with headers: title, workId, iswc, versionType, language</p>
              <p className="font-mono text-xs text-zinc-600">title,workId,iswc,versionType,language</p>
              <p className="font-mono text-xs text-zinc-600">My Song,WK001,T-123.456.789-0,ORI,EN</p>
            </>
          )}
          {activeTab === 'royalties' && (
            <>
              <p>CSV with headers: workId, amount, rightType</p>
              <p className="font-mono text-xs text-zinc-600">workId,amount,rightType</p>
              <p className="font-mono text-xs text-zinc-600">WK001,125.50,PR</p>
            </>
          )}
          {activeTab === 'ack' && (
            <>
              <p>Standard CWR ACK file format (HDR, ACK, MSG records)</p>
              <p>Matches against existing CWR exports by filename</p>
            </>
          )}
        </div>
      </Card>
    </PageLayout>
  );
}
