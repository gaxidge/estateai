"use client";

import React, { useMemo, useState } from "react";
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Calendar,
  FileText,
  LayoutGrid,
  List,
  X,
  MessageSquare,
  CheckCircle2,
  Building2,
} from "lucide-react";
import { useEstateStore } from "@/context/estate-store";
import {
  Customer,
  CustomerStatus,
  ListingType,
  PropertyCategory,
} from "@/lib/types";
import { PROPERTY_CATEGORIES } from "@/lib/mock-data";
import { formatCompactTRY, formatDateTimeTR, formatTRY } from "@/lib/utils";

const CUSTOMER_STATUSES: CustomerStatus[] = [
  "Potansiyel",
  "Aktif",
  "Görüşme Aşamasında",
  "Tamamlandı",
];

export default function CrmPage() {
  const {
    customers,
    properties,
    addCustomer,
    updateCustomerStatus,
    updateCustomer,
  } = useEstateStore();

  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Tümü");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Yeni Müşteri Formu
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [minBudget, setMinBudget] = useState("10000000");
  const [maxBudget, setMaxBudget] = useState("18000000");
  const [regionsText, setRegionsText] = useState(
    "İstanbul / Kadıköy, İstanbul / Ataşehir"
  );
  const [prefCategory, setPrefCategory] = useState<PropertyCategory>("Daire");
  const [prefRooms, setPrefRooms] = useState("3+1");
  const [listingPref, setListingPref] = useState<ListingType>("Satılık");
  const [status, setStatus] = useState<CustomerStatus>("Potansiyel");
  const [notes, setNotes] = useState("");
  const [newNoteText, setNewNoteText] = useState("");

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.fullName.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.interestedRegions.some((r) => r.toLowerCase().includes(q));
      const matchesStatus =
        statusFilter === "Tümü" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [customers, searchQuery, statusFilter]);

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomer({
      fullName: fullName.trim() || "Yeni Müşteri",
      phone: phone.trim() || "0532 000 00 00",
      email: email.trim() || "musteri@ornek.com",
      minBudget: Number(minBudget) || 0,
      maxBudget: Number(maxBudget) || 0,
      interestedRegions: regionsText
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean),
      preferredCategories: [prefCategory],
      preferredRooms: [prefRooms.trim() || "3+1"],
      listingPreference: listingPref,
      status,
      notes: notes.trim() || "Müşteri talebi kaydedildi.",
      source: "Web Formu",
      assignedAgent: "Selim Soylu",
    });
    setIsAddModalOpen(false);
    setFullName("");
    setPhone("");
    setEmail("");
    setNotes("");
  };

  const handleAddInteraction = (cust: Customer) => {
    if (!newNoteText.trim()) return;
    const newInt = {
      id: `int-${Date.now()}`,
      date: new Date().toLocaleString("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      channel: "Telefon" as const,
      summary: newNoteText.trim(),
      agentName: "Selim Soylu",
    };
    const updated = {
      ...cust,
      lastContactDate: new Date().toISOString(),
      interactions: [newInt, ...cust.interactions],
    };
    updateCustomer(cust.id, updated);
    setSelectedCustomer(updated);
    setNewNoteText("");
  };

  const statusBadgeColor = (s: CustomerStatus) => {
    switch (s) {
      case "Potansiyel":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "Aktif":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Görüşme Aşamasında":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Tamamlandı":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Üst Başlık */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
            Müşteri ve CRM Yönetimi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Müşteri bütçe, bölge, oda ve gayrimenkul tercihleri, görüşme geçmişi ve yapay zekâ portföy eşleştirmeleri
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-white">
            <button
              onClick={() => setViewMode("kanban")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
                viewMode === "kanban"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kanban Pano</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
                viewMode === "table"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Tablo Görünümü</span>
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-medium text-white shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Müşteri Kaydı</span>
          </button>
        </div>
      </div>

      {/* Arama ve Durum Filtreleri */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Müşteri adı, telefon, e-posta veya ilgilendiği ilçe ara..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {["Tümü", ...CUSTOMER_STATUSES].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                statusFilter === st
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Görünüm 1: Kanban Pano */}
      {viewMode === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {CUSTOMER_STATUSES.map((colStatus) => {
            const colCustomers = filteredCustomers.filter(
              (c) => c.status === colStatus
            );
            return (
              <div
                key={colStatus}
                className="bg-slate-100/70 rounded-xl border border-slate-200/80 p-3 flex flex-col gap-3 min-h-[520px]"
              >
                <div className="flex items-center justify-between px-1 py-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-800">
                      {colStatus}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
                      {colCustomers.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {colCustomers.map((cust) => (
                    <div
                      key={cust.id}
                      onClick={() => setSelectedCustomer(cust)}
                      className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] hover:border-slate-300 transition cursor-pointer space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-xs sm:text-sm font-semibold text-slate-900">
                            {cust.fullName}
                          </h3>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {cust.phone}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Sparkles className="w-3 h-3" />%{cust.aiLeadScore}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Bütçe:</span>
                          <span className="font-semibold text-slate-800">
                            {formatCompactTRY(cust.minBudget)} –{" "}
                            {formatCompactTRY(cust.maxBudget)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Tercih:</span>
                          <span className="font-medium text-slate-700">
                            {cust.listingPreference} •{" "}
                            {cust.preferredCategories.join(", ")} (
                            {cust.preferredRooms.join(", ")})
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {cust.interestedRegions.slice(0, 2).map((reg, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200/70"
                          >
                            {reg}
                          </span>
                        ))}
                      </div>

                      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                        <span>
                          Son İletişim:{" "}
                          {formatDateTimeTR(cust.lastContactDate).split(" ")[0]}{" "}
                          {formatDateTimeTR(cust.lastContactDate).split(" ")[1]}
                        </span>
                        <select
                          value={cust.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            updateCustomerStatus(
                              cust.id,
                              e.target.value as CustomerStatus
                            )
                          }
                          className="text-[11px] font-medium bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-700"
                        >
                          {CUSTOMER_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Görünüm 2: Tablo Görünümü */
        <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Müşteri Bilgileri</th>
                  <th className="py-3 px-4">Tercih & Kategori</th>
                  <th className="py-3 px-4">Bütçe Aralığı</th>
                  <th className="py-3 px-4">İlgilendiği Bölgeler</th>
                  <th className="py-3 px-4">Durum</th>
                  <th className="py-3 px-4">Son İletişim</th>
                  <th className="py-3 px-4 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredCustomers.map((cust) => (
                  <tr
                    key={cust.id}
                    onClick={() => setSelectedCustomer(cust)}
                    className="hover:bg-slate-50/80 transition cursor-pointer"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">
                        {cust.fullName}
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        {cust.phone} • {cust.email}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800">
                        {cust.listingPreference} •{" "}
                        {cust.preferredCategories.join(", ")}
                      </span>
                      <div className="text-[11px] text-slate-500">
                        Oda: {cust.preferredRooms.join(", ")}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {formatCompactTRY(cust.minBudget)} –{" "}
                      {formatCompactTRY(cust.maxBudget)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {cust.interestedRegions.map((r, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${statusBadgeColor(
                          cust.status
                        )}`}
                      >
                        {cust.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {formatDateTimeTR(cust.lastContactDate)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="px-2.5 py-1 rounded-md border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-100">
                        Kartı Aç
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Müşteri Detay & Görüşme Geçmişi Çekmecesi */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/30 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl h-full overflow-y-auto shadow-2xl border-l border-slate-200 p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${statusBadgeColor(
                        selectedCustomer.status
                      )}`}
                    >
                      {selectedCustomer.status}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                      İlgi skoru: %{selectedCustomer.aiLeadScore}
                    </span>
                    <span className="text-xs text-slate-400">
                      Kaynak: {selectedCustomer.source}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900 mt-2">
                    {selectedCustomer.fullName}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-1">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {selectedCustomer.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {selectedCustomer.email}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Talep ve Kriter Özeti */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                  <div className="text-[11px] text-slate-400">
                    Bütçe Aralığı
                  </div>
                  <div className="text-xs font-semibold text-slate-900 mt-0.5">
                    {formatTRY(selectedCustomer.minBudget)} –{" "}
                    {formatTRY(selectedCustomer.maxBudget)}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                  <div className="text-[11px] text-slate-400">
                    Gayrimenkul Türü & İşlem
                  </div>
                  <div className="text-xs font-semibold text-slate-900 mt-0.5">
                    {selectedCustomer.listingPreference} •{" "}
                    {selectedCustomer.preferredCategories.join(", ")}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                  <div className="text-[11px] text-slate-400">
                    Oda Tercihi & Danışman
                  </div>
                  <div className="text-xs font-semibold text-slate-900 mt-0.5">
                    {selectedCustomer.preferredRooms.join(", ")} •{" "}
                    {selectedCustomer.assignedAgent}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  İlgilendiği Bölgeler
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCustomer.interestedRegions.map((r, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-medium"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Müşteri Notları
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 leading-relaxed">
                  {selectedCustomer.notes}
                </p>
              </div>

              {/* AI Eşleşen Portföyler */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Bu Müşteriye Uygun İlanlar
                </h3>
                <div className="space-y-2">
                  {properties
                    .filter((p) =>
                      selectedCustomer.matchedPropertyIds.includes(p.id)
                    )
                    .map((prop) => (
                      <div
                        key={prop.id}
                        className="p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={prop.images[0]}
                            alt={prop.title}
                            className="w-12 h-12 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-slate-900 truncate">
                              {prop.code} — {prop.title}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {prop.district} • {prop.roomCount} •{" "}
                              {formatTRY(prop.price)}
                            </div>
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                          Tam Eşleşme
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Görüşme Geçmişi */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Görüşme Geçmişi & Yeni Not Ekle
                </h3>

                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Yeni telefon/yüz yüze görüşme notu girin..."
                    className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                  <button
                    onClick={() => handleAddInteraction(selectedCustomer)}
                    className="px-3.5 py-2 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 shrink-0"
                  >
                    Not Ekle
                  </button>
                </div>

                <div className="space-y-3">
                  {selectedCustomer.interactions.map((int) => (
                    <div
                      key={int.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-800">
                          {int.channel} • {int.agentName}
                        </span>
                        <span>{int.date}</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {int.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-slate-200 flex items-center justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 rounded-lg bg-slate-900 text-xs font-medium text-white hover:bg-slate-800"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Yeni Müşteri Ekleme Modalı */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h2 className="text-base font-semibold text-slate-900">
                Yeni Müşteri Ekle
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Ad Soyad *
                  </label>
                  <input
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Örn: Hakan Çetinkaya"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Telefon *
                  </label>
                  <input
                    required
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0532 000 00 00"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    E-posta
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ad@alanadi.com"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Min. Bütçe (₺)
                  </label>
                  <input
                    type="number"
                    value={minBudget}
                    onChange={(e) => setMinBudget(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Maks. Bütçe (₺)
                  </label>
                  <input
                    type="number"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Tercih
                  </label>
                  <select
                    value={listingPref}
                    onChange={(e) =>
                      setListingPref(e.target.value as ListingType)
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Satılık">Satılık</option>
                    <option value="Kiralık">Kiralık</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Müşteri Durumu
                  </label>
                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as CustomerStatus)
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    {CUSTOMER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Gayrimenkul Türü
                  </label>
                  <select
                    value={prefCategory}
                    onChange={(e) =>
                      setPrefCategory(e.target.value as PropertyCategory)
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    {PROPERTY_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Oda Sayısı Tercihi
                  </label>
                  <input
                    type="text"
                    value={prefRooms}
                    onChange={(e) => setPrefRooms(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    İlgilendiği Bölgeler
                  </label>
                  <input
                    type="text"
                    value={regionsText}
                    onChange={(e) => setRegionsText(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Notlar
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 text-xs font-medium text-white"
                >
                  Müşteriyi Kaydet & Eşleştir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
