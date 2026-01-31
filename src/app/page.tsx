'use client';

import { useStore } from '@/store';
import { Sidebar } from '@/components/layout/Sidebar';
import { ToastContainer } from '@/components/ui/Toast';
import { Card, Badge, StatCard } from '@/components/ui/index';
import { motion } from 'framer-motion';
import {
  Music,
  Users,
  Disc3,
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Activity,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { sidebarCollapsed, works, writers, recordings, royaltyStatements, cwrExports, getDashboardStats } = useStore();
  const stats = getDashboardStats();

  const statCards = [
    {
      label: 'Total Works',
      value: stats.totalWorks,
      icon: <Music className="w-5 h-5" />,
      trend: '+12%',
      trendUp: true,
      color: 'violet' as const,
      href: '/works',
    },
    {
      label: 'Writers',
      value: stats.totalWriters,
      icon: <Users className="w-5 h-5" />,
      trend: '+3',
      trendUp: true,
      color: 'cyan' as const,
      href: '/writers',
    },
    {
      label: 'Recordings',
      value: stats.totalRecordings,
      icon: <Disc3 className="w-5 h-5" />,
      trend: '+8%',
      trendUp: true,
      color: 'emerald' as const,
      href: '/recordings',
    },
    {
      label: 'Total Royalties',
      value: formatCurrency(stats.totalRoyalties),
      icon: <DollarSign className="w-5 h-5" />,
      trend: '+24%',
      trendUp: true,
      color: 'amber' as const,
      href: '/royalties',
    },
  ];

  const statusData = [
    { name: 'Registered', value: stats.registeredWorks, color: '#10b981' },
    { name: 'Pending', value: stats.pendingRegistrations, color: '#f59e0b' },
    { name: 'Draft', value: stats.draftWorks, color: '#6b7280' },
  ];

  const royaltyTrendData = royaltyStatements.map((s) => ({
    name: s.period,
    amount: s.totalGross,
  }));

  const recentWorks = works.slice(0, 5);
  const recentExports = cwrExports.slice(0, 5);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-violet-950/20 via-black to-cyan-950/10 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.1),transparent_50%)] pointer-events-none" />
      
      <Sidebar />
      <ToastContainer />
      
      <main
        className="relative transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
      >
        <div className="p-8 max-w-[1600px]">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                <Sparkles className="w-5 h-5 text-violet-400" />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Dashboard
              </h1>
            </div>
            <p className="text-zinc-500 text-lg">
              Welcome back! Here&apos;s an overview of your catalog.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
          >
            {statCards.map((stat, index) => (
              <motion.div key={stat.label} variants={itemVariants}>
                <Link href={stat.href}>
                  <StatCard
                    label={stat.label}
                    value={stat.value}
                    icon={stat.icon}
                    trend={stat.trend}
                    trendUp={stat.trendUp}
                    color={stat.color}
                  />
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Charts Row */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8"
          >
            {/* Royalty Trend Chart */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card className="overflow-hidden">
                <div className="p-6 border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                        <Activity className="w-4 h-4 text-violet-400" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-white">
                          Royalty Earnings
                        </h3>
                        <p className="text-sm text-zinc-500">Monthly revenue trend</p>
                      </div>
                    </div>
                    <Link 
                      href="/royalties"
                      className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
                    >
                      View all
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={royaltyTrendData}>
                        <defs>
                          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          stroke="#52525b" 
                          fontSize={12} 
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis 
                          stroke="#52525b" 
                          fontSize={12} 
                          tickFormatter={(v) => `$${v / 1000}k`}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(24, 24, 27, 0.95)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
                          }}
                          formatter={(value) => value !== undefined ? [formatCurrency(value as number), 'Amount'] : null}
                          labelStyle={{ color: '#a1a1aa' }}
                        />
                        <Area
                          type="monotone"
                          dataKey="amount"
                          stroke="#8b5cf6"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorAmount)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Work Status Distribution */}
            <motion.div variants={itemVariants}>
              <Card className="h-full">
                <div className="p-6 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <BarChart3 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        Registration Status
                      </h3>
                      <p className="text-sm text-zinc-500">Work distribution</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={65}
                          paddingAngle={4}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(24, 24, 27, 0.95)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-5 mt-4">
                    {statusData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-zinc-400">
                          {item.name} <span className="text-zinc-600">({item.value})</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-5"
          >
            {/* Recent Works */}
            <motion.div variants={itemVariants}>
              <Card padding="none">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                      <Music className="w-4 h-4 text-violet-400" />
                    </div>
                    <h3 className="text-base font-semibold text-white">
                      Recent Works
                    </h3>
                  </div>
                  <Link
                    href="/works"
                    className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
                  >
                    View all
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="divide-y divide-white/5">
                  {recentWorks.length === 0 ? (
                    <div className="p-8 text-center text-zinc-500">
                      No works yet. Create your first work to get started.
                    </div>
                  ) : (
                    recentWorks.map((work) => (
                      <Link
                        key={work.id}
                        href={`/works/${work.id}`}
                        className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-violet-600/10 border border-violet-500/20 flex items-center justify-center">
                            <Music className="w-5 h-5 text-violet-400" />
                          </div>
                          <div>
                            <p className="font-medium text-white group-hover:text-violet-300 transition-colors">
                              {work.title}
                            </p>
                            <p className="text-sm text-zinc-500">
                              {work.workId} • {work.writerShares?.length || 0} writers
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={
                              work.status === 'registered'
                                ? 'success'
                                : work.status === 'pending'
                                ? 'warning'
                                : 'default'
                            }
                            dot
                          >
                            {work.status}
                          </Badge>
                          <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-violet-400 transition-colors" />
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Recent CWR Exports */}
            <motion.div variants={itemVariants}>
              <Card padding="none">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                      <FileText className="w-4 h-4 text-cyan-400" />
                    </div>
                    <h3 className="text-base font-semibold text-white">
                      Recent CWR Exports
                    </h3>
                  </div>
                  <Link
                    href="/cwr"
                    className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
                  >
                    View all
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="divide-y divide-white/5">
                  {recentExports.length === 0 ? (
                    <div className="p-8 text-center text-zinc-500">
                      No CWR exports yet. Generate your first export.
                    </div>
                  ) : (
                    recentExports.map((exp) => (
                      <div
                        key={exp.id}
                        className="flex items-center justify-between p-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/20 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-cyan-400" />
                          </div>
                          <div>
                            <p className="font-medium text-white font-mono text-sm">
                              {exp.filename}
                            </p>
                            <p className="text-sm text-zinc-500">
                              {exp.workCount} works • {exp.recipientSociety}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              exp.status === 'acknowledged'
                                ? 'success'
                                : exp.status === 'sent'
                                ? 'info'
                                : 'default'
                            }
                            dot
                          >
                            {exp.status}
                          </Badge>
                          <p className="text-xs text-zinc-600 mt-1">
                            {formatRelativeTime(exp.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
