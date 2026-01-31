'use client';

import { useState } from 'react';
import { useStore } from '@/store';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, Button, Input, Select, Badge } from '@/components/ui/index';
import { motion } from 'framer-motion';
import { Settings, Building2, Globe, Database, Download, Trash2, RefreshCw, Save, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  const { 
    works, writers, recordings, artists, publishers, labels, releases, agreements, cwrExports, royaltyStatements,
    clearAllData, addToast 
  } = useStore();
  
  const [companyName, setCompanyName] = useState('Rocket Science Music Publishing');
  const [ipi, setIpi] = useState('00123456789');
  const [defaultVersion, setDefaultVersion] = useState('2.2');
  const [defaultTerritory, setDefaultTerritory] = useState('US');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  const stats = [
    { label: 'Works', count: works.length, color: 'violet' },
    { label: 'Writers', count: writers.length, color: 'cyan' },
    { label: 'Recordings', count: recordings.length, color: 'pink' },
    { label: 'Artists', count: artists.length, color: 'amber' },
    { label: 'Publishers', count: publishers.length, color: 'emerald' },
    { label: 'Labels', count: labels.length, color: 'blue' },
    { label: 'Releases', count: releases.length, color: 'orange' },
    { label: 'Agreements', count: agreements.length, color: 'rose' },
    { label: 'CWR Exports', count: cwrExports.length, color: 'indigo' },
    { label: 'Royalty Statements', count: royaltyStatements.length, color: 'teal' },
  ];

  const handleSave = () => {
    addToast({ type: 'success', title: 'Settings saved', message: 'Your settings have been updated' });
  };

  const handleClearData = () => {
    clearAllData();
    setShowClearConfirm(false);
    addToast({ type: 'success', title: 'Data cleared', message: 'All data has been removed' });
  };

  const handleExportData = () => {
    const data = {
      works,
      writers,
      recordings,
      artists,
      publishers,
      labels,
      releases,
      agreements,
      cwrExports,
      royaltyStatements,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rocket-science-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({ type: 'success', title: 'Data exported', message: 'Backup file downloaded' });
  };

  return (
    <PageLayout
      title="Settings"
      description="Configure your publishing administration"
      icon={Settings}
    >
      {/* Company Settings */}
      <Card className="mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-600/10 border border-violet-500/20">
            <Building2 className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Company Settings</h3>
            <p className="text-sm text-zinc-500">Your organization details for CWR files</p>
          </div>
        </div>
        
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <Input
              label="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
            />
            <Input
              label="IPI Number"
              value={ipi}
              onChange={(e) => setIpi(e.target.value)}
              placeholder="11-digit IPI"
            />
          </div>
        </div>
      </Card>

      {/* CWR Defaults */}
      <Card className="mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/20">
            <Globe className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">CWR Defaults</h3>
            <p className="text-sm text-zinc-500">Default settings for CWR file generation</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-5">
          <Select
            label="Default CWR Version"
            value={defaultVersion}
            onChange={(e) => setDefaultVersion(e.target.value)}
            options={[
              { value: '2.1', label: 'CWR 2.1' },
              { value: '2.2', label: 'CWR 2.2' },
              { value: '3.0', label: 'CWR 3.0' },
              { value: '3.1', label: 'CWR 3.1' },
            ]}
          />
          <Select
            label="Default Territory"
            value={defaultTerritory}
            onChange={(e) => setDefaultTerritory(e.target.value)}
            options={[
              { value: 'US', label: 'United States' },
              { value: 'GB', label: 'United Kingdom' },
              { value: 'DE', label: 'Germany' },
              { value: 'FR', label: 'France' },
              { value: '2136', label: 'World' },
            ]}
          />
        </div>
      </Card>

      {/* Data Statistics */}
      <Card className="mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20">
            <Database className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Data Statistics</h3>
            <p className="text-sm text-zinc-500">Overview of your catalog data</p>
          </div>
        </div>
        
        <div className="grid grid-cols-5 gap-4">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center"
            >
              <p className="text-2xl font-bold text-white mb-1">{stat.count}</p>
              <p className="text-xs text-zinc-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Data Management */}
      <Card className="mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20">
            <RefreshCw className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Data Management</h3>
            <p className="text-sm text-zinc-500">Export or clear your data</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            onClick={handleExportData}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export All Data
          </Button>
          
          {!showClearConfirm ? (
            <Button
              variant="danger"
              onClick={() => setShowClearConfirm(true)}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Clear All Data
            </Button>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20"
            >
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-sm text-red-300">This will delete all data. Are you sure?</span>
              <Button size="sm" variant="danger" onClick={handleClearData}>
                Yes, Delete
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setShowClearConfirm(false)}>
                Cancel
              </Button>
            </motion.div>
          )}
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} leftIcon={<Save className="w-4 h-4" />} glow>
          Save Settings
        </Button>
      </div>
    </PageLayout>
  );
}
