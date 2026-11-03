"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  Sparkles,
  CalendarCheck,
  ArrowUpRight,
  ArrowRight,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Bot,
} from "lucide-react";
import { useEstateStore } from "@/context/estate-store";
import { AIConversation } from "@/lib/types";
import { cn, formatCompactTRY } from "@/lib/utils";

const MONTHLY = [
  { month: "Haz", views: 1840, leads: 48, appointments: 19 },
  { month: "Tem", views: 2190, leads: 56, appointments: 24 },
  { month: "Ağu", views: 2450, leads: 64, appointments: 29 },
  { month: "Eyl", views: 2780, leads: 79, appointments: 34 },
  { month: "Eki", views: 3120, leads: 92, appointments: 41 },
  { month: "Kas", views: 3490, leads: 108, appointments: 47 },
];

const CONV_STATUS: Record<AIConversation["status"], { label: string; cls: string }> = {
  "AI Aktif": { label: "Asistan yanıtlıyor", cls: "bg-sky-50 text-sky-700 ring-sky-200" },
  "Temsilciye Aktarıldı": { label: "Sizi bekliyor", cls: "bg-amber-50 text-amber-800 ring-amber-200" },
  "Randevu Alındı": { label: "Randevu alındı", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  Tamamlandı: { label: "Tamamlandı", cls: "bg-slate-100 text-slate-700 ring-slate-200" },
};

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-xl border border-slate-200/80 bg-white", className)}>{children}</div>;
}

function CardHeader({ title, desc, href, linkLabel }: { title: string; desc?: string; href?: string; linkLabel?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        {desc && <p className="mt-0.5 text-xs text-slate-500">{desc}</p>}
      </div>
      {href && (
        <Link href={href} className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900">
          {linkLabel} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { currentTenant, properties, customers, conversations, appointments, automationLogs } = useEstateStore();
  const [metric, setMetric] = useState<"leads" | "views">("leads");

  const activeCustomers = customers.filter((c) => c.status === "Aktif" || c.status === "Görüşme Aşamasında").length;
  const newLeads = customers.filter((c) => c.status === "Potansiyel" || c.source === "WhatsApp AI").length;
  const upcoming = appointments.filter((a) => a.status === "Onaylandı" || a.status === "Beklemede");
  const saleVolume = properties.filter((p) => p.listingType === "Satılık").reduce((s, p) => s + p.price, 0);
  const waiting = conversations.filter((c) => c.status === "Temsilciye Aktarıldı");

  const firstName = currentTenant.authorizedPerson.split(" ")[0];

  const kpis = [
    { label: "Toplam ilan", value: properties.length, sub: `Satılık hacim ${formatCompactTRY(saleVolume)}`, icon: Building2, trend: "+14%" },
    { label: "Aktif müşteri", value: activeCustomers, sub: `${customers.length} kayıtlı müşteri`, icon: Users, trend: "+22%" },
    { label: "Yeni talep", value: newLeads, sub: "Asistan ortalama 2 sn'de yanıtlıyor", icon: Sparkles, trend: "+9%" },
    { label: "Yaklaşan randevu", value: upcoming.length, sub: `${upcoming.filter((a) => a.createdBy === "AI Asistan").length} tanesini asistan aldı`, icon: CalendarCheck },
  ];

  const funnel = [
    { stage: "Gelen talep", count: 142, pct: 100 },
    { stage: "Bütçesi ve bölgesi netleşen", count: 89, pct: 63 },
    { stage: "Yer gösterme yapılan", count: 47, pct: 33 },
    { stage: "Satış / kiralama", count: 17, pct: 12 },
  ];

  const maxVal = metric === "leads" ? 120 : 3800;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Hoş geldiniz, {firstName} Bey</h1>
          <p className="mt-1 text-sm text-slate-500">Ofisinizde bugün neler olduğuna hızlıca göz atın.</p>
        </div>
        <Link
          href="/ai-asistan"
          className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:self-auto"
        >
          <Bot className="h-4 w-4" /> Asistan görüşmeleri
        </Link>
      </div>

      {waiting.length > 0 && (
        <Link
          href="/ai-asistan"
          className="flex items-center justify-between gap-4 rounded-xl bg-amber-50 px-5 py-3.5 ring-1 ring-inset ring-amber-200 transition hover:bg-amber-100/70"
        >
          <div className="flex items-center gap-3 text-sm text-amber-900">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
            <span>
              <strong className="font-semibold">{waiting.length} müşteri sizi bekliyor.</strong>{" "}
              {waiting.map((w) => w.customerName).join(", ")} ile görüşmeyi asistan size aktardı.
            </span>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-amber-700" />
        </Link>
      )}

      {/* KPI */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-slate-500">{k.label}</span>
              <k.icon className="h-[18px] w-[18px] text-slate-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold tracking-tight text-slate-900">{k.value}</span>
              {k.trend && (
                <span className="inline-flex items-center text-xs font-medium text-emerald-600">
                  <ArrowUpRight className="h-3 w-3" />
                  {k.trend}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">{k.sub}</p>
          </Card>
        ))}
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Portföy Performansı</h2>
              <p className="mt-0.5 text-xs text-slate-500">Son 6 ay</p>
            </div>
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs">
              {(
                [
                  ["leads", "Talep ve randevu"],
                  ["views", "İlan görüntülenme"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setMetric(key)}
                  className={cn(
                    "rounded-md px-3 py-1.5 font-medium transition",
                    metric === key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="px-5 pb-5 pt-6">
            <div className="grid h-52 grid-cols-6 items-end gap-4 sm:gap-6">
              {MONTHLY.map((m) => {
                const a = metric === "leads" ? m.leads : m.views;
                const b = metric === "leads" ? m.appointments : Math.round(m.views * 0.42);
                return (
                  <div key={m.month} className="flex h-full flex-col items-center justify-end">
                    <span className="mb-1.5 text-[11px] font-medium text-slate-500">{a.toLocaleString("tr-TR")}</span>
                    <div className="flex h-40 w-full max-w-[48px] items-end gap-1">
                      <div style={{ height: `${(a / maxVal) * 100}%` }} className="w-1/2 rounded-t-md bg-slate-900 transition-all duration-300" />
                      <div style={{ height: `${(b / maxVal) * 100}%` }} className="w-1/2 rounded-t-md bg-slate-300 transition-all duration-300" />
                    </div>
                    <span className="mt-2 text-xs text-slate-500">{m.month}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 flex items-center gap-5 border-t border-slate-100 pt-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-slate-900" />
                {metric === "leads" ? "Müşteri talebi" : "Görüntülenme"}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-slate-300" />
                {metric === "leads" ? "Randevu" : "Tekil ziyaretçi"}
              </span>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-5">
          <CardHeader title="Müşteri Dönüşümü" desc="Son 30 günde talepten satışa" href="/crm" linkLabel="Müşteriler" />
          <div className="space-y-5 p-5">
            {funnel.map((f) => (
              <div key={f.stage}>
                <div className="mb-1.5 flex items-center justify-between text-[13px]">
                  <span className="text-slate-700">{f.stage}</span>
                  <span className="font-semibold text-slate-900">
                    {f.count} <span className="font-normal text-slate-400">· %{f.pct}</span>
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-slate-900" style={{ width: `${f.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Alt satır */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-5">
          <CardHeader title="Son Asistan Görüşmeleri" href="/ai-asistan" linkLabel="Tümü" />
          <ul className="divide-y divide-slate-100">
            {conversations.map((c) => (
              <li key={c.id} className="px-5 py-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[13px] font-semibold text-slate-900">{c.customerName}</span>
                  <span className={cn("shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-medium ring-1 ring-inset", CONV_STATUS[c.status].cls)}>
                    {CONV_STATUS[c.status].label}
                  </span>
                </div>
                <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-slate-600">{c.aiSummary}</p>
                <p className="mt-1.5 text-xs text-slate-400">
                  {c.extractedContext.intent} {c.extractedContext.category.toLowerCase()} · {c.extractedContext.budgetRange}
                </p>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="lg:col-span-4">
          <CardHeader title="Yaklaşan Randevular" href="/randevular" linkLabel="Takvim" />
          <ul className="divide-y divide-slate-100">
            {upcoming.slice(0, 4).map((a) => (
              <li key={a.id} className="flex gap-3.5 px-5 py-4">
                <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-slate-100">
                  <span className="text-sm font-semibold leading-none text-slate-900">{a.date.slice(8, 10)}</span>
                  <span className="mt-0.5 text-[10px] text-slate-500">Kas</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[13px] font-semibold text-slate-900">{a.customerName}</span>
                    <span className="shrink-0 text-xs font-medium text-slate-600">{a.time}</span>
                  </div>
                  <p className="truncate text-xs text-slate-600">{a.propertyTitle}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                    <MapPin className="h-3 w-3" /> {a.propertyLocation} · {a.agentName}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader title="Son Hareketler" />
          <ul className="space-y-4 p-5">
            {automationLogs.slice(0, 5).map((log) => (
              <li key={log.id} className="flex gap-2.5">
                {log.status === "Başarılı" ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                )}
                <div className="min-w-0">
                  <p className="text-[13px] leading-snug text-slate-700">{log.detail}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">{log.executedAt.split(" ")[1] || log.executedAt}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

