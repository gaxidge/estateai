"use client";

import React from "react";
import {
  UserPlus,
  Home,
  BellRing,
  PhoneCall,
  FileText,
  Play,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
  Timer,
} from "lucide-react";
import { useEstateStore } from "@/context/estate-store";
import { AutomationJob } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<AutomationJob["category"], React.ElementType> = {
  "Müşteri Kaydı": UserPlus,
  "Portföy Eşleştirme": Home,
  "Randevu Hatırlatma": BellRing,
  "Müşteri Takibi": PhoneCall,
  "Günlük Özet": FileText,
};

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
        checked ? "bg-emerald-600" : "bg-slate-300"
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

export default function AutomationsPage() {
  const { automations, automationLogs, toggleAutomation, triggerAutomationNow } = useEstateStore();

  const activeCount = automations.filter((a) => a.isActive).length;
  const totalRuns = automations.reduce((s, a) => s + a.totalRuns30d, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Otomatik İşlemler</h1>
        <p className="mt-1 text-sm text-slate-500">
          Sizin yerinize arka planda çalışan görevler. İstediğinizi tek tıkla açıp kapatabilirsiniz.
        </p>
      </div>

      {/* Özet */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Açık görev", value: `${activeCount} / ${automations.length}`, icon: Zap },
          { label: "Son 30 günde yapılan işlem", value: totalRuns.toLocaleString("tr-TR"), icon: CheckCircle2 },
          { label: "Size kazandırılan tahmini zaman", value: "≈ 46 saat", icon: Timer },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-4 rounded-xl border border-slate-200/80 bg-white p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-semibold text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Görev kartları */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {automations.map((job) => {
          const Icon = CATEGORY_ICONS[job.category];
          return (
            <div
              key={job.id}
              className={cn(
                "flex flex-col rounded-xl border bg-white p-5 transition",
                job.isActive ? "border-slate-200/80" : "border-slate-200/60 opacity-70"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-[15px] font-semibold text-slate-900">{job.name}</h2>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock className="h-3 w-3" />
                      {job.schedule}
                    </div>
                  </div>
                </div>
                <Toggle checked={job.isActive} onChange={() => toggleAutomation(job.id)} />
              </div>

              <p className="mt-4 text-[13px] leading-relaxed text-slate-600">{job.description}</p>

              <ol className="mt-4 space-y-2">
                {job.steps.map((step, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-[13px] text-slate-700">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500">
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <span>
                    Son çalışma: <span className="font-medium text-slate-700">{job.lastRunAt}</span>
                  </span>
                  <span>
                    Bu ay: <span className="font-medium text-slate-700">{job.totalRuns30d.toLocaleString("tr-TR")} kez</span>
                  </span>
                </div>
                <button
                  onClick={() => triggerAutomationNow(job.id)}
                  disabled={!job.isActive}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Play className="h-3.5 w-3.5" />
                  Şimdi çalıştır
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Son işlemler */}
      <div className="rounded-xl border border-slate-200/80 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="text-sm font-semibold text-slate-900">Son İşlemler</h3>
          <p className="mt-0.5 text-xs text-slate-500">Otomatik görevlerin yakın zamanda yaptıkları</p>
        </div>
        <ul className="divide-y divide-slate-100">
          {automationLogs.map((log) => {
            const ok = log.status === "Başarılı";
            return (
              <li key={log.id} className="flex items-start gap-3.5 px-5 py-3.5">
                {ok ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] text-slate-800">{log.detail}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{log.jobName}</p>
                </div>
                <span className="shrink-0 text-xs text-slate-400">{log.executedAt}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
