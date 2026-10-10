'use client'

import { useMemo, useRef, useState } from 'react'
import {
  Activity,
  ArrowUpRight,
  Bell,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  FileCheck2,
  FileImage,
  FileJson,
  FileText,
  FolderOpen,
  Gauge,
  HelpCircle,
  Home,
  Info,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
  Zap,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DEMO_BILLS } from '@/lib/demo-data'
import type { ChargeType, ExtractedBill, Provider, TaxType } from '@/lib/types'

const providerLabels: Record<Provider, string> = { KE: 'K-Electric', LESCO: 'LESCO', IESCO: 'IESCO' }
const chargeLabels: Record<ChargeType, string> = {
  energy: 'Energy charge', fixed: 'Fixed charge', fpa: 'Fuel price adjustment', quarterly_adjustment: 'Quarterly adjustment', surcharge: 'Surcharge', meter_rent: 'Meter rent', subsidy: 'Subsidy', other: 'Other charge',
}
const taxLabels: Record<TaxType, string> = { gst: 'GST', electricity_duty: 'Electricity duty', income_tax: 'Income tax', municipal_tax: 'Municipal tax', other_tax: 'Other tax' }
const money = (value: number | null) => value === null ? 'Unavailable' : `PKR ${value.toLocaleString('en-PK')}`
const date = (value: string | null) => value ? new Date(`${value}T00:00:00`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Unavailable'

function ProviderMark({ provider }: { provider: Provider | null }) {
  return <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-xs font-bold tracking-tight text-primary-foreground">{provider ?? '—'}</span>
}

function StatCard({ label, value, detail, icon: Icon, tone = 'blue' }: { label: string; value: string; detail: string; icon: typeof Zap; tone?: 'blue' | 'amber' | 'green' }) {
  return <Card className="border-border/70 shadow-sm"><CardContent className="flex items-start justify-between p-5"><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-xl font-semibold tracking-tight text-foreground">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div><span className={`flex size-10 items-center justify-center rounded-xl ${tone === 'amber' ? 'bg-amber-100 text-amber-700' : tone === 'green' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}><Icon className="size-[18px]" /></span></CardContent></Card>
}

function DetailGrid({ bill }: { bill: ExtractedBill }) {
  const fields = [
    ['Provider', bill.provider ? providerLabels[bill.provider] : null], ['Tariff', bill.tariff], ['Bill month', bill.bill_month], ['Sanctioned load', bill.sanctioned_load_kw === null ? null : `${bill.sanctioned_load_kw} kW`], ['Reading date', date(bill.reading_date)], ['Issue date', date(bill.issue_date)], ['Due date', date(bill.due_date)], ['Previous reading', bill.previous_reading?.toLocaleString('en-PK') ?? null], ['Current reading', bill.current_reading?.toLocaleString('en-PK') ?? null], ['Units consumed', bill.units_consumed === null ? null : `${bill.units_consumed.toLocaleString('en-PK')} kWh`],
  ]
  return <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-5">{fields.map(([label, value]) => <div key={label}><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-sm font-medium text-foreground">{value || 'Unavailable'}</p></div>)}</div>
}

function LineTable({ title, rows, labels, total }: { title: string; rows: { type: string; amount: number | null }[]; labels: Record<string, string>; total: number | null }) {
  return <Card className="border-border/70 shadow-sm"><CardHeader className="pb-3"><div className="flex items-center justify-between"><CardTitle className="text-base">{title}</CardTitle><span className="text-sm font-semibold text-foreground">{money(total)}</span></div></CardHeader><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-6">Type</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader><TableBody>{rows.map((row, index) => <TableRow key={`${row.type}-${index}`}><TableCell className="pl-6 text-sm">{labels[row.type] ?? 'Unavailable'}</TableCell><TableCell className="pr-6 text-right text-sm font-medium">{money(row.amount)}</TableCell></TableRow>)}{rows.length === 0 && <TableRow><TableCell colSpan={2} className="py-6 text-center text-sm text-muted-foreground">No line items extracted</TableCell></TableRow>}</TableBody></Table></CardContent></Card>
}

export default function Page() {
  const [activeNav, setActiveNav] = useState('Overview')
  const [selectedBillId, setSelectedBillId] = useState(DEMO_BILLS[0].id)
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([])
  const [uploadedName, setUploadedName] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const selectedBill = useMemo(() => DEMO_BILLS.find((bill) => bill.id === selectedBillId) ?? DEMO_BILLS[0], [selectedBillId])
  const bill = selectedBill.extractedData

  const askQuestion = () => {
    if (!question.trim()) return
    setMessages((current) => [...current, { role: 'user', text: question.trim() }, { role: 'assistant', text: 'The processing engine is not connected yet. This question is ready to be sent to the shared backend contract.' }])
    setQuestion('')
  }

  const navItems = [{ label: 'Overview', icon: LayoutDashboard }, { label: 'My bills', icon: FileText }, { label: 'Ask a question', icon: MessageSquareText }, { label: 'Competition workflow', icon: Gauge }]
  const utilityItems = [{ label: 'Status & settings', icon: Settings2 }]

  return <div className="min-h-screen bg-[#f7f9fc] text-foreground">
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[248px] border-r border-border/70 bg-white lg:flex lg:flex-col">
      <div className="flex h-[76px] items-center gap-3 border-b border-border/70 px-6"><div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Zap className="size-[18px] fill-current" /></div><div><p className="text-sm font-bold tracking-tight">WTQ Build Track</p><p className="text-[11px] text-muted-foreground">Utility Bill Decoder</p></div></div>
      <div className="flex flex-1 flex-col justify-between p-4"><div><p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Workspace</p><nav className="flex flex-col gap-1">{navItems.map(({ label, icon: Icon }) => <button key={label} onClick={() => setActiveNav(label)} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${activeNav === label ? 'bg-blue-50 font-medium text-blue-700' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}><Icon className="size-[17px]" />{label}{label === 'Ask a question' && <Badge variant="secondary" className="ml-auto px-1.5 py-0 text-[10px]">Beta</Badge>}</button>)}</nav><Separator className="my-6" /><p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">System</p><nav className="flex flex-col gap-1">{utilityItems.map(({ label, icon: Icon }) => <button key={label} onClick={() => setActiveNav(label)} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm ${activeNav === label ? 'bg-blue-50 font-medium text-blue-700' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}><Icon className="size-[17px]" />{label}</button>)}</nav></div><div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3"><div className="flex items-center gap-2 text-xs font-semibold text-blue-800"><ShieldCheck className="size-4" />Privacy first</div><p className="mt-1.5 text-[11px] leading-4 text-blue-700/80">Personal identifiers are never shown in this interface.</p></div></div>
    </aside>
    <div className="lg:pl-[248px]"><header className="sticky top-0 z-10 flex h-[76px] items-center justify-between border-b border-border/70 bg-white/95 px-5 backdrop-blur sm:px-8"><div className="flex items-center gap-3"><button className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"><Menu className="size-5" /></button><div><p className="text-sm font-semibold">{activeNav}</p><p className="hidden text-xs text-muted-foreground sm:block">Understand your electricity bill in plain language</p></div></div><div className="flex items-center gap-2"><Button variant="outline" size="sm" className="hidden gap-2 sm:flex" onClick={() => fileInput.current?.click()}><Upload data-icon="inline-start" />Upload bill</Button><button className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted"><Bell className="size-[18px]" /><span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-blue-600" /></button><div className="ml-1 flex size-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">WT</div></div></header>
      <main className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 lg:px-10"><div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground"><Home className="size-3.5" /> <span>/</span> Overview</div><h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Good morning, welcome back.</h1><p className="mt-1 text-sm text-muted-foreground">Review bills, inspect extracted details, and ask better questions.</p></div><Button className="gap-2 self-start sm:self-auto" onClick={() => fileInput.current?.click()}><Plus data-icon="inline-start" />Add a bill</Button></div>
        {uploadedName && <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"><Check className="size-4" />{uploadedName} is ready for backend processing.<button className="ml-auto" onClick={() => setUploadedName(null)}><X className="size-4" /></button></div>}
        <input ref={fileInput} type="file" accept="image/*,.pdf" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) setUploadedName(file.name) }} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Selected bill" value={bill.bill_month ?? 'Unavailable'} detail={`${bill.provider ? providerLabels[bill.provider] : 'Provider unavailable'} · ${selectedBill.fileName}`} icon={FileCheck2} /><StatCard label="Current bill" value={money(bill.current_bill)} detail="Before due date" icon={Zap} tone="amber" /><StatCard label="Units consumed" value={bill.units_consumed === null ? 'Unavailable' : `${bill.units_consumed.toLocaleString('en-PK')} kWh`} detail="Current reading period" icon={Activity} tone="green" /><StatCard label="Processing status" value="Demo mode" detail="Backend not connected" icon={Clock3} /></div>
        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)]"><div className="flex flex-col gap-6"><Card className="border-border/70 shadow-sm"><CardHeader className="flex flex-row items-start justify-between space-y-0 pb-5"><div><div className="flex items-center gap-2"><CardTitle className="text-base">Bill details</CardTitle><Badge variant="secondary" className="gap-1 font-normal"><span className="size-1.5 rounded-full bg-emerald-500" />Processed</Badge></div><CardDescription className="mt-1">Structured fields from the Level 1 extraction schema</CardDescription></div><div className="flex items-center gap-2"><select aria-label="Select processed bill" value={selectedBillId} onChange={(event) => setSelectedBillId(event.target.value)} className="h-9 max-w-[180px] rounded-md border border-input bg-background px-2 text-xs"><option value="bill-001">K-Electric · Oct 2024</option><option value="bill-002">LESCO · Sep 2024</option><option value="bill-003">IESCO · Nov 2024</option></select><button className="rounded-md p-2 text-muted-foreground hover:bg-muted"><MoreHorizontal className="size-4" /></button></div></CardHeader><CardContent><DetailGrid bill={bill} /></CardContent></Card>
          <div className="grid gap-6 md:grid-cols-2"><LineTable title="Charges" rows={bill.charges} labels={chargeLabels} total={bill.total_charges} /><LineTable title="Taxes" rows={bill.taxes} labels={taxLabels} total={bill.total_taxes} /></div>
          <Card className="border-border/70 shadow-sm"><CardHeader className="pb-4"><CardTitle className="text-base">Payable summary</CardTitle><CardDescription>Amounts preserved from the extracted bill</CardDescription></CardHeader><CardContent className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-blue-50 p-4"><p className="text-xs text-blue-700">Within due date</p><p className="mt-1 text-lg font-semibold text-blue-900">{money(bill.payable_within_due_date)}</p></div><div className="rounded-xl bg-amber-50 p-4"><p className="text-xs text-amber-700">After due date</p><p className="mt-1 text-lg font-semibold text-amber-900">{money(bill.payable_after_due_date)}</p></div><div className="rounded-xl bg-muted p-4"><p className="text-xs text-muted-foreground">Arrears</p><p className="mt-1 text-lg font-semibold">{money(bill.arrears)}</p></div></CardContent></Card></div>
          <div className="flex flex-col gap-6"><Card className="overflow-hidden border-border/70 bg-slate-950 text-white shadow-sm"><CardHeader className="pb-4"><div className="flex items-center justify-between"><div><Badge className="border-0 bg-white/10 text-blue-200 hover:bg-white/10">Ask about this bill</Badge><CardTitle className="mt-3 text-xl text-white">Make sense of your charges.</CardTitle><CardDescription className="text-slate-400">Ask a question about the selected bill.</CardDescription></div><Sparkles className="size-5 text-blue-300" /></div></CardHeader><CardContent><div className="flex min-h-[180px] flex-col justify-end gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3">{messages.length === 0 && <div className="py-5 text-center"><MessageSquareText className="mx-auto size-7 text-slate-500" /><p className="mt-3 text-sm text-slate-400">Questions and typed answers will appear here.</p></div>}{messages.map((message, index) => <div key={index} className={`max-w-[92%] rounded-lg px-3 py-2 text-sm ${message.role === 'user' ? 'self-end bg-blue-600 text-white' : 'bg-white/10 text-slate-200'}`}>{message.text}</div>)}<div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-1"><Input value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229) askQuestion() }} placeholder="e.g. Why is my bill higher this month?" className="border-0 bg-transparent text-white placeholder:text-slate-500 focus-visible:ring-0" /><Button size="sm" onClick={askQuestion}>Ask</Button></div></div><p className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500"><Info className="size-3" />Demo only. Answers will come from the shared processing engine.</p></CardContent></Card>
            <Card className="border-border/70 shadow-sm"><CardHeader className="pb-4"><div className="flex items-center justify-between"><div><CardTitle className="text-base">Recent bills</CardTitle><CardDescription>Your uploaded bill workspace</CardDescription></div><Button variant="ghost" size="sm" className="gap-1 text-xs">View all <ArrowUpRight data-icon="inline-end" /></Button></div></CardHeader><CardContent className="flex flex-col gap-2">{DEMO_BILLS.map((item) => <button key={item.id} onClick={() => setSelectedBillId(item.id)} className={`flex items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-muted ${selectedBillId === item.id ? 'bg-blue-50' : ''}`}><ProviderMark provider={item.provider} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{item.fileName}</p><p className="text-xs text-muted-foreground">{item.extractedData.bill_month ?? 'Unavailable'}</p></div><div className="text-right"><p className="text-sm font-medium">{money(item.extractedData.current_bill)}</p><Badge variant="outline" className="mt-1 text-[10px] font-normal">Processed</Badge></div></button>)}</CardContent></Card>
            <Card className="border-border/70 shadow-sm"><CardHeader className="pb-4"><CardTitle className="text-base">Quick guide</CardTitle></CardHeader><CardContent className="flex flex-col gap-3 text-sm"><div className="flex gap-3"><span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><Upload className="size-3.5" /></span><p className="text-muted-foreground">Upload a clear image or PDF from K-Electric, LESCO, or IESCO.</p></div><div className="flex gap-3"><span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><FileJson className="size-3.5" /></span><p className="text-muted-foreground">Review extracted details before they connect to the processing engine.</p></div><div className="flex gap-3"><span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><CircleHelp className="size-3.5" /></span><p className="text-muted-foreground">Ask questions about the selected bill in plain language.</p></div></CardContent></Card></div></div>
        <div className="mt-7 rounded-xl border border-dashed border-border bg-white/60 p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-center"><FolderOpen className="size-5 text-muted-foreground" /><div className="flex-1"><p className="text-sm font-medium">Competition workflow</p><p className="text-xs text-muted-foreground">Batch processing is independent from this web interface. Connect a backend endpoint or upload files explicitly to run it.</p></div><Button variant="outline" size="sm" onClick={() => setActiveNav('Competition workflow')}>Open workflow <ArrowUpRight data-icon="inline-end" /></Button></div></div>
      </main></div>
  </div>
}

