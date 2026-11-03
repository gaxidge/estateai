"use client";

import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Phone,
  User,
  Building2,
  Bell,
  Plus,
  CheckCircle2,
  X,
  Bot,
} from "lucide-react";
import { useEstateStore } from "@/context/estate-store";
import { Appointment, AppointmentStatus } from "@/lib/types";
import { formatDateTR } from "@/lib/utils";

const NOVEMBER_DAYS = [
  { date: "2026-11-02", dayNum: "02", dayName: "Pzt" },
  { date: "2026-11-03", dayNum: "03", dayName: "Sal" },
  { date: "2026-11-04", dayNum: "04", dayName: "Çar" },
  { date: "2026-11-05", dayNum: "05", dayName: "Per" },
  { date: "2026-11-06", dayNum: "06", dayName: "Cum" },
  { date: "2026-11-07", dayNum: "07", dayName: "Cmt" },
  { date: "2026-11-08", dayNum: "08", dayName: "Paz" },
];

export default function AppointmentsPage() {
  const {
    appointments,
    customers,
    properties,
    addAppointment,
    updateAppointmentStatus,
  } = useEstateStore();

  const [selectedDate, setSelectedDate] = useState<string>("Tümü");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Yeni Randevu Formu
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    customers[0]?.id || ""
  );
  const [selectedPropertyId, setSelectedPropertyId] = useState(
    properties[0]?.id || ""
  );
  const [date, setDate] = useState("2026-11-05");
  const [time, setTime] = useState("14:00");
  const [agentName, setAgentName] = useState("Selim Soylu");
  const [reminderChannel, setReminderChannel] = useState<
    "WhatsApp + SMS" | "WhatsApp" | "E-posta"
  >("WhatsApp + SMS");
  const [notes, setNotes] = useState("");

  const filteredAppointments =
    selectedDate === "Tümü"
      ? appointments
      : appointments.filter((a) => a.date === selectedDate);

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === selectedCustomerId);
    const prop = properties.find((p) => p.id === selectedPropertyId);

    addAppointment({
      customerId: cust?.id || "cust-custom",
      customerName: cust?.fullName || "Kaan Tekinsoy",
      customerPhone: cust?.phone || "0532 489 12 65",
      propertyId: prop?.id || "prop-101",
      propertyCode: prop?.code || "EST-1042",
      propertyTitle: prop?.title || "Suadiye 4+1 Daire",
      propertyLocation: prop
        ? `${prop.district} / ${prop.neighborhood}`
        : "Kadıköy / Suadiye",
      date,
      time,
      durationMinutes: 45,
      status: "Onaylandı",
      agentName,
      createdBy: "Danışman",
      reminderSent: false,
      reminderChannel,
      notes: notes.trim() || "Yer gösterme randevusu planlandı.",
    });

    setIsModalOpen(false);
    setNotes("");
  };

  const statusColor = (s: AppointmentStatus) => {
    switch (s) {
      case "Onaylandı":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Beklemede":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Tamamlandı":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "İptal Edildi":
        return "bg-rose-50 text-rose-700 border-rose-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
            Randevu Yönetimi & Yer Gösterme Takvimi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            AI Asistan ve danışmanlar tarafından oluşturulan yer gösterme randevuları ve otomatik WhatsApp hatırlatmaları
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-medium text-white shadow-sm transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Randevu Planla</span>
        </button>
      </div>

      {/* Haftalık Takvim Görünümü Şeridi */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-slate-700" />
            <span className="text-xs font-semibold text-slate-900">
              Kasım 2026 — Haftalık Takvim Görünümü
            </span>
          </div>
          <button
            onClick={() => setSelectedDate("Tümü")}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition cursor-pointer ${
              selectedDate === "Tümü"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
            }`}
          >
            Tüm Günleri Göster ({appointments.length})
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {NOVEMBER_DAYS.map((d) => {
            const dayApts = appointments.filter((a) => a.date === d.date);
            const isSelected = selectedDate === d.date;
            return (
              <button
                key={d.date}
                onClick={() =>
                  setSelectedDate(isSelected ? "Tümü" : d.date)
                }
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-slate-50/60 hover:bg-white border-slate-200/80"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-medium ${
                      isSelected ? "text-slate-300" : "text-slate-500"
                    }`}
                  >
                    {d.dayName}
                  </span>
                  {dayApts.length > 0 && (
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {dayApts.length} Randevu
                    </span>
                  )}
                </div>
                <div
                  className={`text-lg font-semibold mt-1 ${
                    isSelected ? "text-white" : "text-slate-900"
                  }`}
                >
                  {d.dayNum} Kas
                </div>
                <div className="mt-2 space-y-1">
                  {dayApts.slice(0, 2).map((a) => (
                    <div
                      key={a.id}
                      className={`text-[10px] px-1.5 py-0.5 rounded truncate ${
                        isSelected
                          ? "bg-white/15 text-white"
                          : "bg-white border border-slate-200 text-slate-700"
                      }`}
                    >
                      {a.time} • {a.propertyCode}
                    </div>
                  ))}
                  {dayApts.length === 0 && (
                    <div
                      className={`text-[10px] ${
                        isSelected ? "text-slate-400" : "text-slate-400"
                      }`}
                    >
                      Müsait
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Randevu Kartları ve Hatırlatma Durumu */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredAppointments.map((apt) => (
          <div
            key={apt.id}
            className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold">
                    {formatDateTR(apt.date)} • {apt.time}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColor(
                      apt.status
                    )}`}
                  >
                    {apt.status}
                  </span>
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {apt.createdBy === "AI Asistan" && (
                    <Bot className="w-3 h-3 text-slate-700" />
                  )}
                  Kaynak: {apt.createdBy}
                </span>
              </div>

              {/* Müşteri & Portföy Eşleşmesi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <div>
                  <div className="text-[11px] text-slate-400">
                    Müşteri Bilgileri
                  </div>
                  <div className="text-xs font-semibold text-slate-900 mt-0.5">
                    {apt.customerName}
                  </div>
                  <div className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {apt.customerPhone}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-slate-400">
                    Görüntülenecek Gayrimenkul
                  </div>
                  <div className="text-xs font-semibold text-slate-900 mt-0.5 truncate">
                    {apt.propertyCode} — {apt.propertyTitle}
                  </div>
                  <div className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {apt.propertyLocation}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                <strong className="text-slate-800">Randevu Notu:</strong>{" "}
                {apt.notes}
              </p>
            </div>

            {/* Alt Bar: Hatırlatma Sistemi & Durum Değiştirme */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <Bell className="w-3 h-3 text-emerald-600" />
                  Hatırlatma: {apt.reminderChannel} (
                  {apt.reminderSent ? "gönderildi" : "zamanı gelince gönderilecek"})
                </span>
                <span className="text-slate-500">
                  Danışman: <strong className="text-slate-800">{apt.agentName}</strong>
                </span>
              </div>

              <select
                value={apt.status}
                onChange={(e) =>
                  updateAppointmentStatus(
                    apt.id,
                    e.target.value as AppointmentStatus
                  )
                }
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700"
              >
                <option value="Onaylandı">Onaylandı</option>
                <option value="Beklemede">Beklemede</option>
                <option value="Tamamlandı">Tamamlandı</option>
                <option value="İptal Edildi">İptal Edildi</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Yeni Randevu Oluşturma Modalı */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Yeni Yer Gösterme Randevusu Planla
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Müşteriye randevudan önce WhatsApp ile konum ve hatırlatma mesajı otomatik gönderilir.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Müşteri Seçin
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Görüntülenecek Gayrimenkul Portföyü
                </label>
                <select
                  value={selectedPropertyId}
                  onChange={(e) => setSelectedPropertyId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} — {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Tarih
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Saat
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Sorumlu Danışman
                  </label>
                  <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Otomatik Hatırlatma Kanalı
                  </label>
                  <select
                    value={reminderChannel}
                    onChange={(e) =>
                      setReminderChannel(
                        e.target.value as
                          | "WhatsApp + SMS"
                          | "WhatsApp"
                          | "E-posta"
                      )
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="WhatsApp + SMS">WhatsApp + SMS</option>
                    <option value="WhatsApp">Sadece WhatsApp</option>
                    <option value="E-posta">E-posta</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Randevu Notu
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Örn: Müşteri tapu fotokopisini ve aidat bilgisini görmek istiyor."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 text-xs font-medium text-white"
                >
                  Randevuyu Kaydet & Hatırlatma Kur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
