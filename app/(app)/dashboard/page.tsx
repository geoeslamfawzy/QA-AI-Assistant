'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Ticket,
  Palette,
  FileText,
  CheckCircle,
  ArrowRight,
  Search,
  TestTubes,
  Bug,
} from 'lucide-react';
import Link from 'next/link';

// Workflow steps data
const workflowSteps = [
  {
    step: '01',
    title: 'Pull from Jira',
    description: 'Fetch story details, acceptance criteria, and linked issues',
    icon: Ticket,
    color: 'bg-accent-dim',
    iconColor: 'text-primary',
    href: '/analyze',
  },
  {
    step: '02',
    title: 'Extract from Figma',
    description: 'Pull design frames, components, and visual specifications',
    icon: Palette,
    color: 'bg-pink-dim',
    iconColor: 'text-pink-500',
    href: '/analyze',
  },
  {
    step: '03',
    title: 'Generate Prompt',
    description: 'Structure data into optimized prompts for Claude analysis',
    icon: FileText,
    color: 'bg-cyan-dim',
    iconColor: 'text-cyan-500',
    href: '/analyze',
  },
  {
    step: '04',
    title: 'Push to Jira',
    description: 'Review findings, select valid comments, post back to ticket',
    icon: CheckCircle,
    color: 'bg-green-dim',
    iconColor: 'text-green-500',
    href: '/analyze',
  },
];

// Stats data
const stats = [
  {
    value: 47,
    label: 'Stories Analyzed',
    color: 'text-primary',
    href: '/history',
    icon: Search,
  },
  {
    value: 312,
    label: 'Test Cases Generated',
    color: 'text-green-500',
    href: '/test-cases',
    icon: TestTubes,
  },
  {
    value: 28,
    label: 'Defects Reported',
    color: 'text-red-500',
    href: '/defects',
    icon: Bug,
  },
];

// Recent activity data
const recentActivity = [
  {
    ticket: 'MOB-1248',
    module: 'Book Rides',
    action: 'Story Analysis',
    status: 'Complete',
    date: '2 hours ago',
  },
  {
    ticket: 'MOB-1245',
    module: 'Payments',
    action: 'Test Cases',
    status: 'Complete',
    date: '4 hours ago',
  },
  {
    ticket: 'MOB-1242',
    module: 'Users & Groups',
    action: 'Bug Report',
    status: 'In Review',
    date: '6 hours ago',
  },
  {
    ticket: 'MOB-1239',
    module: 'Programs',
    action: 'Story Analysis',
    status: 'Complete',
    date: 'Yesterday',
  },
  {
    ticket: 'MOB-1236',
    module: 'Dashboard',
    action: 'Test Cases',
    status: 'Complete',
    date: 'Yesterday',
  },
];

// Module coverage data
const modules = [
  { name: 'B2B Corporate Portal', active: true },
  { name: 'B2C Web Interface', active: true },
  { name: 'Admin Panel', active: true },
  { name: 'DashOps', active: false },
  { name: 'Pricing Engine', active: false },
  { name: 'Analytics', active: false },
  { name: 'Super App', active: false },
  { name: 'Driver App', active: false },
];

export default function DashboardPage() {
  const [activeModules, setActiveModules] = useState(
    modules.filter((m) => m.active).map((m) => m.name)
  );

  const toggleModule = (name: string) => {
    setActiveModules((prev) =>
      prev.includes(name)
        ? prev.filter((m) => m !== name)
        : [...prev, name]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          QA AI Agent Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pull stories from Jira, extract designs from Figma, generate structured
          prompts for Claude — then push results back.
        </p>
      </div>

      {/* Workflow Steps */}
      <div className="grid grid-cols-4 gap-4">
        {workflowSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.step} className="relative">
              <Link href={step.href}>
                <Card className="card-hover cursor-pointer h-full">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <span className="font-mono text-[11px] text-muted-foreground">
                        STEP {step.step}
                      </span>
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${step.color}`}
                      >
                        <Icon className={`h-5 w-5 ${step.iconColor}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-foreground">
                          {step.title}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              {/* Arrow connector */}
              {index < workflowSteps.length - 1 && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="card-hover cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-mono text-3xl font-bold ${stat.color}`}>
                        {stat.value}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color} opacity-50`} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-mono text-xs">Ticket</TableHead>
                <TableHead className="text-xs">Module</TableHead>
                <TableHead className="text-xs">Action</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivity.map((activity, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono text-xs text-primary">
                    {activity.ticket}
                  </TableCell>
                  <TableCell className="text-xs">{activity.module}</TableCell>
                  <TableCell className="text-xs">{activity.action}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        activity.status === 'Complete'
                          ? 'bg-green-dim text-green-500 hover:bg-green-dim'
                          : 'bg-amber-dim text-amber-500 hover:bg-amber-dim'
                      }
                    >
                      {activity.status === 'Complete' ? '✓ ' : '⏳ '}
                      {activity.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground text-right">
                    {activity.date}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Module Coverage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Module Coverage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {modules.map((module) => {
              const isActive = activeModules.includes(module.name);
              return (
                <button
                  key={module.name}
                  onClick={() => toggleModule(module.name)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border text-muted-foreground hover:border-primary hover:text-primary'
                  }`}
                >
                  {module.name}
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            {activeModules.length} of {modules.length} modules actively covered.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
