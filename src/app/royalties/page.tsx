'use client';

import { useState } from 'react';
import { useStore } from '@/store';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, Badge, Button, Modal, EmptyState, StatCard } from '@/components/ui/index';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { DollarSign, Eye, Download, TrendingUp, Calendar, FileText, Upload } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function RoyaltiesPage() {
  const { royaltyStatements, works, writers } = useStore();
  const [viewingStatement, setViewingStatement] = useState<typeof royaltyStatements[0] | null>(null);

  const totalRoyalties = royaltyStatements.reduce((sum, s) => sum + s.totalGross, 0);
  const totalDistributed = royaltyStatements.reduce((sum, s) => sum + (s.totalNet || s.totalGross * 0.9), 0);
  const avgPerPeriod = royaltyStatements.length > 0 ? totalRoyalties / royaltyStatements.length : 0;

  const chartData = royaltyStatements.map((s) => ({
    name: s.period,
    gross: s.totalGross,
    net: s.totalNet || s.totalGross * 0.9,
  }));

  return (
    <PageLayout
      title="Royalties"
      description={`${royaltyStatements.length} royalty statements processed`}
      icon={DollarSign}
      actions={
        <Link href="/import">
          <Button variant="ghost" leftIcon={<Upload className="w-4 h-4" />}>Import</Button>
        </Link>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <StatCard
          label="Total Gross"
          value={formatCurrency(totalRoyalties)}
          icon={<DollarSign className="w-5 h-5" />}
          color="emerald"
        />
        <StatCard
          label="Total Distributed"
          value={formatCurrency(totalDistributed)}
          icon={<TrendingUp className="w-5 h-5" />}
          color="violet"
        />
        <StatCard
          label="Avg per Period"
          value={formatCurrency(avgPerPeriod)}
          icon={<Calendar className="w-5 h-5" />}
          color="cyan"
        />
      </div>

      {/* Chart */}
      {royaltyStatements.length > 0 && (
        <Card className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Royalty Trend</h3>
              <p className="text-sm text-zinc-500">Gross vs Net earnings over time</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="grossGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(24, 24, 27, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                  }}
                  formatter={(value) => [formatCurrency(value as number), '']}
                />
                <Area type="monotone" dataKey="gross" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#grossGradient)" name="Gross" />
                <Area type="monotone" dataKey="net" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#netGradient)" name="Net" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Statements Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Period</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Source</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Lines</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Gross</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Net</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Currency</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Imported</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {royaltyStatements.map((statement) => (
                <motion.tr
                  key={statement.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-emerald-400" />
                      </div>
                      <p className="font-medium text-white">{statement.period}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4"><Badge variant="default">{statement.source}</Badge></td>
                  <td className="px-6 py-4 text-zinc-400">{statement.lineItems?.length || 0} items</td>
                  <td className="px-6 py-4 text-white font-medium">{formatCurrency(statement.totalGross)}</td>
                  <td className="px-6 py-4 text-emerald-400 font-medium">{formatCurrency(statement.totalNet)}</td>
                  <td className="px-6 py-4"><Badge variant="info">{statement.currency}</Badge></td>
                  <td className="px-6 py-4 text-sm text-zinc-500">{formatDate(statement.importedAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setViewingStatement(statement)}
                        className="p-2 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {royaltyStatements.length === 0 && (
          <EmptyState
            icon={<DollarSign className="w-12 h-12" />}
            title="No royalty statements"
            description="Import royalty statements from the Import page"
          />
        )}
      </Card>

      <Modal
        isOpen={!!viewingStatement}
        onClose={() => setViewingStatement(null)}
        title={`Royalty Statement - ${viewingStatement?.period}`}
        size="xl"
      >
        {viewingStatement && (
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <p className="text-sm text-zinc-500 mb-1">Gross</p>
                <p className="text-xl font-bold text-white">{formatCurrency(viewingStatement.totalGross)}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <p className="text-sm text-zinc-500 mb-1">Net</p>
                <p className="text-xl font-bold text-emerald-400">{formatCurrency(viewingStatement.totalNet || viewingStatement.totalGross * 0.9)}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <p className="text-sm text-zinc-500 mb-1">Source</p>
                <p className="text-xl font-bold text-white">{viewingStatement.source}</p>
              </div>
            </div>

            {viewingStatement.lineItems && viewingStatement.lineItems.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-zinc-400 mb-3">Line Items</h4>
                <div className="max-h-64 overflow-y-auto rounded-lg border border-white/5">
                  <table className="w-full text-sm">
                    <thead className="bg-white/[0.02] sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left text-zinc-500">Work</th>
                        <th className="px-4 py-2 text-left text-zinc-500">Type</th>
                        <th className="px-4 py-2 text-right text-zinc-500">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {viewingStatement.lineItems.slice(0, 20).map((item, i) => (
                        <tr key={i}>
                          <td className="px-4 py-2 text-white">{works.find(w => w.id === item.workId)?.title || item.workTitle || 'Unknown'}</td>
                          <td className="px-4 py-2 text-zinc-400">{item.rightType}</td>
                          <td className="px-4 py-2 text-right text-emerald-400">{formatCurrency(item.netAmount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/5">
              <Button variant="secondary" onClick={() => setViewingStatement(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </PageLayout>
  );
}
