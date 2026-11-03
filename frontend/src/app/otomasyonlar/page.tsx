"use client";

import React, { useState } from "react";
import {
  UserPlus,
  Home,
  BellRing,
  PhoneCall,
  FileText,
  TrendingDown,
  Building2,
  Play,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Sparkles,
  Edit3,
  X,
  Moon,
  CalendarCheck,
  RefreshCw,
} from "lucide-react";
import { useEstateStore } from "@/context/estate-store";
import { AutomationJob } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<AutomationJob["category"], React.ElementType> = {
  "Müşteri Kaydı": UserPlus,
  "Portföy Eşleştirme": Home,
  "Randevu Hatırlatma": BellRing,
  "Müşteri Takibi": PhoneCall,
  "Fiyat & Fırsat": TrendingDown,
  "Mal Sahibi İlişkileri": Building2,
  "Günlük Özet": FileText,
};

const FILTER_TABS = [
  { id: "Tümü", label: "Tüm Görevler" },
  { id: "musteri", label: "Müşteri & Takip" },
  { id: "portfoy", label: "Portföy & Fiyat İndirimi" },
  { id: "randevu", label: "Randevu Hatırlatma" },
  { id: "malsahibi", label: "Mal Sahibi İlişkileri" },
] as const;

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer",
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
  const {
    automations,
    automationLogs,
    toggleAutomation,
    triggerAutomationNow,
    updateAutomationSettings,
  } = useEstateStore();

  const [selectedFilter, setSelectedFilter] = useState<string>("Tümü");
  const [editingJob, setEditingJob] = useState<AutomationJob | null>(null);
  const [templateDraft, setTemplateDraft] = useState("");
  const [previewDraft, setPreviewDraft] = useState("");
  const [testedJobId, setTestedJobId] = useState<string | null>(null);

  const filteredAutomations = automations.filter((job) => {
    if (selectedFilter === "Tümü") return true;
    if (selectedFilter === "musteri")
      return (
        job.category === "Müşteri Kaydı" ||
        job.category === "Müşteri Takibi" ||
        job.category === "Günlük Özet"
      );
    if (selectedFilter === "portfoy")
      return (
        job.category === "Portföy Eşleştirme" ||
        job.category === "Fiyat & Fırsat"
      );
    if (selectedFilter === "randevu")
      return job.category === "Randevu Hatırlatma";
    if (selectedFilter === "malsahibi")
      return job.category === "Mal Sahibi İlişkileri";
    return true;
  });

  const openEditModal = (job: AutomationJob) => {
    setEditingJob(job);
    setTemplateDraft(job.whatsappTemplate);
    setPreviewDraft(job.whatsappPreview);
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;
    updateAutomationSettings(editingJob.id, {
      whatsappTemplate: templateDraft,
      whatsappPreview: previewDraft,
    });
    setEditingJob(null);
  };

  const handleTestRun = (id: string) => {
    triggerAutomationNow(id);
    setTestedJobId(id);
    setTimeout(() => setTestedJobId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Üst Başlık */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Otomatik İşlemler ve WhatsApp Şablonları
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Siz sahada veya dinlenirken müşterilerinizi karşılayan, fiyat indirimlerini duyuran ve mal sahiplerine rapor gönderen hazır görevler.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3.5 py-2 text-xs font-medium text-emerald-800 ring-1 ring-inset ring-emerald-200 self-start sm:self-auto">
          <Sparkles className="h-4 w-4 text-emerald-600" />
          <span>
            {automations.filter((a) => a.isActive).length} /{" "}
            {automations.length} otomatik görev aktif
          </span>
        </div>
      </div>

      {/* Ofise Kazandırdıkları (3 Somut Ticari Değer Kartı) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Moon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">
              Mesai Dışı Yakalanan Müşteri
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-slate-900">
                34 Müşteri
              </span>
              <span className="text-xs font-medium text-emerald-700">
                Son 30 gün
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Akşam 18:00 – Sabah 09:00 arasında yazıp bekletilmeden karşılanan alıcı ve kiracı adayları.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-5 flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <CalendarCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">
              Hatırlatmayla Korunan Randevu
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-slate-900">
                47 Yer Gösterimi
              </span>
              <span className="text-xs font-medium text-emerald-700">
                %0 Unutulma
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Randevudan önce otomatik gönderilen konum ve saat hatırlatmasıyla iptali önlenen ziyaretler.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-5 flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white">
            <RefreshCw className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">
              Tekrar Kazanılan Eski Müşteri
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-slate-900">
                23 Sıcak Dönüş
              </span>
              <span className="text-xs font-medium text-emerald-700">
                Fiyat & Takip
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Fiyat indirimi duyurusu ve 5. gün takip mesajı sayesinde tekrar randevu isteyen müşteriler.
            </p>
          </div>
        </div>
      </div>

      {/* Kategori Filtre Sekmeleri */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id)}
            className={cn(
              "px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap border transition cursor-pointer",
              selectedFilter === tab.id
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Görev Kartları */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {filteredAutomations.map((job) => {
          const Icon = CATEGORY_ICONS[job.category] || Sparkles;
          return (
            <div
              key={job.id}
              className={cn(
                "flex flex-col justify-between rounded-xl border bg-white p-5 transition",
                job.isActive
                  ? "border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
                  : "border-slate-200/60 opacity-75"
              )}
            >
              <div>
                {/* Üst Satır: İkon, Başlık ve Aç/Kapat Anahtarı */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                          {job.category}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Alıcı: {job.recipientLabel}
                        </span>
                      </div>
                      <h2 className="mt-1 text-[15px] font-semibold text-slate-900">
                        {job.name}
                      </h2>
                    </div>
                  </div>
                  <Toggle
                    checked={job.isActive}
                    onChange={() => toggleAutomation(job.id)}
                  />
                </div>

                {/* Açıklama */}
                <p className="mt-3 text-[13px] leading-relaxed text-slate-600">
                  {job.description}
                </p>

                {/* Çalışma Zamanı Seçici */}
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg bg-slate-50 px-3.5 py-2.5 border border-slate-200/70">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    Ne zaman çalışsın?
                  </span>
                  <select
                    value={job.selectedTiming}
                    onChange={(e) =>
                      updateAutomationSettings(job.id, {
                        selectedTiming: e.target.value,
                      })
                    }
                    className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-800 focus:border-slate-400 focus:outline-none"
                  >
                    {job.timingOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Canlı WhatsApp Mesaj Önizlemesi */}
                <div className="mt-4 rounded-xl border border-emerald-200/80 bg-[#F2FBF6] p-3.5">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800">
                      <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                      Gidecek WhatsApp Mesajı Önizlemesi
                    </span>
                    <button
                      type="button"
                      onClick={() => openEditModal(job)}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 hover:text-emerald-950 underline underline-offset-2 cursor-pointer"
                    >
                      <Edit3 className="h-3 w-3" />
                      Mesajı Düzenle
                    </button>
                  </div>
                  <div className="rounded-lg bg-white p-3 text-xs leading-relaxed text-slate-700 shadow-sm border border-emerald-100">
                    {job.whatsappPreview}
                  </div>
                </div>

                {/* Somut Fayda Rozeti */}
                <div className="mt-3 flex items-center gap-2 text-xs text-emerald-700 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  <span>{job.impactBadge}</span>
                </div>
              </div>

              {/* Alt Bilgi & Şimdi Test Et */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3.5 text-xs text-slate-500">
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <span>
                    Son çalışma:{" "}
                    <span className="font-medium text-slate-700">
                      {job.lastRunAt}
                    </span>
                  </span>
                  <span>
                    Bu ay:{" "}
                    <span className="font-medium text-slate-700">
                      {job.totalRuns30d.toLocaleString("tr-TR")} kez
                    </span>
                  </span>
                </div>

                <button
                  onClick={() => handleTestRun(job.id)}
                  disabled={!job.isActive}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
                    testedJobId === job.id
                      ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <Play className="h-3.5 w-3.5" />
                  {testedJobId === job.id
                    ? "Test Gönderildi ✓"
                    : "Şimdi Test Et"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Son Otomatik İşlemler Özeti */}
      <div className="rounded-xl border border-slate-200/80 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Son Gönderilen Mesajlar ve İşlemler
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Asistanın arka planda sizin yerinize tamamladığı son işlemler
          </p>
        </div>
        <ul className="divide-y divide-slate-100">
          {automationLogs.map((log) => {
            const ok = log.status === "Başarılı";
            return (
              <li
                key={log.id}
                className="flex items-start gap-3.5 px-5 py-3.5"
              >
                {ok ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] text-slate-800">{log.detail}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{log.jobName}</p>
                </div>
                <span className="shrink-0 text-xs text-slate-400">
                  {log.executedAt}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* WhatsApp Mesaj Şablonu Düzenleme Modalı */}
      {editingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg p-6">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  WhatsApp Mesajını Özelleştir
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {editingJob.name}
                </p>
              </div>
              <button
                onClick={() => setEditingJob(null)}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTemplate} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Mesaj Şablonu
                </label>
                <textarea
                  rows={3}
                  value={templateDraft}
                  onChange={(e) => setTemplateDraft(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-3 text-xs leading-relaxed focus:border-slate-400 focus:outline-none"
                />
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-slate-400">
                    Tek tıkla ekle:
                  </span>
                  {[
                    "{Müşteri_Adı}",
                    "{İlan_Başlığı}",
                    "{Bölge}",
                    "{Fiyat}",
                    "{Saat}",
                    "{Danışman_Adı}",
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() =>
                        setTemplateDraft((prev) => `${prev} ${tag}`)
                      }
                      className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:bg-slate-200 cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Müşteride Görünecek Örnek Önizleme
                </label>
                <textarea
                  rows={3}
                  value={previewDraft}
                  onChange={(e) => setPreviewDraft(e.target.value)}
                  className="w-full rounded-lg border border-emerald-200 bg-[#F2FBF6] p-3 text-xs leading-relaxed text-slate-800 focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingJob(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 text-xs font-medium text-white hover:bg-slate-800"
                >
                  Mesajı Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
