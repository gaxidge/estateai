"use client";

import React, { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Filter,
  MapPin,
  Maximize2,
  BedDouble,
  Flame,
  Building,
  UserCheck,
  Phone,
  Edit3,
  Trash2,
  Eye,
  Sparkles,
  X,
  Check,
  Calendar,
} from "lucide-react";
import { useEstateStore } from "@/context/estate-store";
import { PROPERTY_CATEGORIES } from "@/lib/mock-data";
import {
  ListingType,
  Property,
  PropertyCategory,
  PropertyStatus,
} from "@/lib/types";
import { formatDateTR, formatTRY } from "@/lib/utils";

export default function PropertiesPage() {
  const { properties, addProperty, updateProperty, deleteProperty } =
    useEstateStore();

  // Filtre durumları
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");
  const [selectedListingType, setSelectedListingType] =
    useState<string>("Tümü");
  const [selectedCity, setSelectedCity] = useState<string>("Tümü");

  // Detay & Ekleme/Düzenleme Modal durumları
  const [inspectedProperty, setInspectedProperty] = useState<Property | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Form alanları
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState<PropertyCategory>("Daire");
  const [formListingType, setFormListingType] =
    useState<ListingType>("Satılık");
  const [formStatus, setFormStatus] = useState<PropertyStatus>("Aktif");
  const [formPrice, setFormPrice] = useState("15000000");
  const [formCity, setFormCity] = useState("İstanbul");
  const [formDistrict, setFormDistrict] = useState("Kadıköy");
  const [formNeighborhood, setFormNeighborhood] = useState("Fenerbahçe Mah.");
  const [formAddress, setFormAddress] = useState("");
  const [formGrossSqm, setFormGrossSqm] = useState("160");
  const [formNetSqm, setFormNetSqm] = useState("135");
  const [formRoomCount, setFormRoomCount] = useState("3+1");
  const [formBuildingAge, setFormBuildingAge] = useState("2");
  const [formFloorInfo, setFormFloorInfo] = useState("5. Kat / 10 Katlı");
  const [formHeatingType, setFormHeatingType] = useState("Yerden Isıtma");
  const [formFeaturesText, setFormFeaturesText] = useState(
    "Kapalı Otopark, Ebeveyn Banyosu, Akıllı Ev, 7/24 Güvenlik"
  );
  const [formImageUrl, setFormImageUrl] = useState(
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
  );
  const [formOwnerName, setFormOwnerName] = useState("");
  const [formOwnerPhone, setFormOwnerPhone] = useState("");
  const [formCommission, setFormCommission] = useState("%2 + KDV");
  const [formAgent, setFormAgent] = useState("Selim Soylu");

  const cities = useMemo(() => {
    const set = new Set(properties.map((p) => p.city));
    return ["Tümü", ...Array.from(set)];
  }, [properties]);

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.neighborhood.toLowerCase().includes(q) ||
        p.owner.fullName.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === "Tümü" || p.category === selectedCategory;
      const matchesListing =
        selectedListingType === "Tümü" || p.listingType === selectedListingType;
      const matchesCity = selectedCity === "Tümü" || p.city === selectedCity;

      return matchesQuery && matchesCategory && matchesListing && matchesCity;
    });
  }, [
    properties,
    searchQuery,
    selectedCategory,
    selectedListingType,
    selectedCity,
  ]);

  const openCreateModal = () => {
    setEditingProperty(null);
    setFormTitle("");
    setFormDescription("");
    setFormCategory("Daire");
    setFormListingType("Satılık");
    setFormStatus("Aktif");
    setFormPrice("18500000");
    setFormCity("İstanbul");
    setFormDistrict("Kadıköy");
    setFormNeighborhood("Suadiye Mah.");
    setFormAddress("Bağdat Cad. No:112 Kadıköy / İstanbul");
    setFormGrossSqm("165");
    setFormNetSqm("140");
    setFormRoomCount("3+1");
    setFormBuildingAge("1");
    setFormFloorInfo("4. Kat / 9 Katlı");
    setFormHeatingType("Yerden Isıtma");
    setFormFeaturesText(
      "Kapalı Otopark, Ebeveyn Banyosu, Balkon, Güvenlik"
    );
    setFormImageUrl(
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80"
    );
    setFormOwnerName("Levent Soydan");
    setFormOwnerPhone("0532 511 40 22");
    setFormCommission("%2 + KDV");
    setFormAgent("Selim Soylu");
    setIsModalOpen(true);
  };

  const openEditModal = (prop: Property) => {
    setEditingProperty(prop);
    setFormTitle(prop.title);
    setFormDescription(prop.description);
    setFormCategory(prop.category);
    setFormListingType(prop.listingType);
    setFormStatus(prop.status);
    setFormPrice(prop.price.toString());
    setFormCity(prop.city);
    setFormDistrict(prop.district);
    setFormNeighborhood(prop.neighborhood);
    setFormAddress(prop.address);
    setFormGrossSqm(prop.grossSqm.toString());
    setFormNetSqm(prop.netSqm.toString());
    setFormRoomCount(prop.roomCount);
    setFormBuildingAge(prop.buildingAge.toString());
    setFormFloorInfo(prop.floorInfo);
    setFormHeatingType(prop.heatingType);
    setFormFeaturesText(prop.features.join(", "));
    setFormImageUrl(prop.images[0] || "");
    setFormOwnerName(prop.owner.fullName);
    setFormOwnerPhone(prop.owner.phone);
    setFormCommission(prop.owner.commissionRate);
    setFormAgent(prop.assignedAgent);
    setIsModalOpen(true);
  };

  const handleSaveProperty = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: formTitle.trim() || "Yeni Gayrimenkul Portföyü",
      description:
        formDescription.trim() ||
        "Ekspertizi tamamlanmış, yetki belgeli portföy.",
      category: formCategory,
      listingType: formListingType,
      status: formStatus,
      price: Number(formPrice) || 0,
      city: formCity.trim(),
      district: formDistrict.trim(),
      neighborhood: formNeighborhood.trim(),
      address: formAddress.trim(),
      grossSqm: Number(formGrossSqm) || 100,
      netSqm: Number(formNetSqm) || 85,
      roomCount: formRoomCount.trim(),
      buildingAge: Number(formBuildingAge) || 0,
      floorInfo: formFloorInfo.trim(),
      heatingType: formHeatingType.trim(),
      features: formFeaturesText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      images: [
        formImageUrl.trim() ||
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
      ],
      owner: {
        fullName: formOwnerName.trim() || "Belirtilmedi",
        phone: formOwnerPhone.trim() || "0532 000 00 00",
        commissionRate: formCommission.trim() || "%2 + KDV",
        authorizationEnd: "2027-06-30",
      },
      assignedAgent: formAgent,
    };

    if (editingProperty) {
      updateProperty(editingProperty.id, payload);
      if (inspectedProperty?.id === editingProperty.id) {
        setInspectedProperty({ ...editingProperty, ...payload });
      }
    } else {
      addProperty(payload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Başlık & Yeni Portföy Ekle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
            Portföy Yönetimi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Tüm gayrimenkul kategorilerinde yetki belgeli portföyler, mal sahibi bilgileri ve AI eşleşme durumları
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-medium text-white shadow-sm transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Portföy Ekle</span>
        </button>
      </div>

      {/* Kategori Sekmeleri (8 Gayrimenkul Kategorisi) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {["Tümü", ...PROPERTY_CATEGORIES].map((cat) => {
          const count =
            cat === "Tümü"
              ? properties.length
              : properties.filter((p) => p.category === cat).length;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap border transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50"
              }`}
            >
              {cat}{" "}
              <span
                className={`ml-1 text-[11px] px-1.5 py-0.5 rounded-full ${
                  selectedCategory === cat
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Arama ve Gelişmiş Filtre Çubuğu */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="İlan kodu (EST-1042), başlık, ilçe, mahalle veya mal sahibi ara..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-slate-400 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
            {["Tümü", "Satılık", "Kiralık"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedListingType(type)}
                className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                  selectedListingType === type
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:border-slate-400"
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                İl: {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Portföy Kartları Grid */}
      {filteredProperties.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center space-y-2">
          <p className="text-sm font-medium text-slate-800">
            Arama kriterlerinize uygun portföy bulunamadı.
          </p>
          <p className="text-xs text-slate-500">
            Filtreleri sıfırlayabilir veya yeni bir gayrimenkul portföyü ekleyebilirsiniz.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredProperties.map((prop) => (
            <div
              key={prop.id}
              className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.03)] hover:border-slate-300 transition flex flex-col justify-between group"
            >
              <div>
                {/* Görsel & Üst Etiketler */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={prop.images[0]}
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-900/90 text-white backdrop-blur-sm">
                      {prop.listingType}
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/95 text-slate-800 border border-slate-200/60 backdrop-blur-sm">
                      {prop.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 rounded-md text-[11px] font-mono font-semibold bg-white/95 text-slate-900 border border-slate-200">
                      {prop.code}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white/95 text-slate-900 shadow-xs">
                      {formatTRY(prop.price)}
                      {prop.listingType === "Kiralık" ? " / Ay" : ""}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-emerald-950/85 text-emerald-200 backdrop-blur-sm">
                      <Sparkles className="w-3 h-3" />
                      {prop.aiMatchCount} uygun müşteri
                    </span>
                  </div>
                </div>

                {/* İçerik */}
                <div className="p-4 space-y-3">
                  <div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">
                        {prop.city} / {prop.district} • {prop.neighborhood}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 mt-1 line-clamp-2 leading-snug">
                      {prop.title}
                    </h3>
                  </div>

                  {/* Teknik Özellikler Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {prop.grossSqm} m² Brüt /{" "}
                        <strong className="text-slate-800">
                          {prop.netSqm} m²
                        </strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BedDouble className="w-3.5 h-3.5 text-slate-400" />
                      <span>{prop.roomCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">
                        {prop.buildingAge === 0
                          ? "Sıfır Bina"
                          : `${prop.buildingAge} Yaş`}{" "}
                        • {prop.floorInfo}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{prop.heatingType}</span>
                    </div>
                  </div>

                  {/* Özellik Etiketleri */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {prop.features.slice(0, 3).map((feat, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200/70"
                      >
                        {feat}
                      </span>
                    ))}
                    {prop.features.length > 3 && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-50 text-slate-400">
                        +{prop.features.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Alt Bilgi: Mal Sahibi & Aksiyonlar */}
              <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[11px] text-slate-400">
                    Portföy Sahibi
                  </div>
                  <div className="text-xs font-medium text-slate-800 truncate">
                    {prop.owner.fullName} ({prop.owner.phone})
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setInspectedProperty(prop)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs font-medium text-slate-700 transition cursor-pointer"
                    title="Detayları İncele"
                  >
                    Detay
                  </button>
                  <button
                    onClick={() => openEditModal(prop)}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                    title="Düzenle"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`"${prop.title}" ilanını silmek istediğinize emin misiniz?`)) {
                        deleteProperty(prop.id);
                      }
                    }}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-500 transition cursor-pointer"
                    title="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Portföy Detay Çekmecesi / Modalı */}
      {inspectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/30 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl h-full overflow-y-auto shadow-2xl border-l border-slate-200 p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      {inspectedProperty.code}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-900 text-white">
                      {inspectedProperty.listingType} •{" "}
                      {inspectedProperty.category}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900 mt-2">
                    {inspectedProperty.title}
                  </h2>
                </div>
                <button
                  onClick={() => setInspectedProperty(null)}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {inspectedProperty.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={inspectedProperty.title}
                    className="w-full h-44 object-cover rounded-xl border border-slate-200"
                  />
                ))}
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500">İlan Fiyatı</div>
                  <div className="text-xl font-semibold text-slate-900">
                    {formatTRY(inspectedProperty.price)}
                    {inspectedProperty.listingType === "Kiralık" ? " / Ay" : ""}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">Açık Adres</div>
                  <div className="text-xs font-medium text-slate-800">
                    {inspectedProperty.address}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  İlan Açıklaması
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {inspectedProperty.description}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg border border-slate-200/80">
                  <div className="text-[11px] text-slate-400">
                    Brüt / Net m²
                  </div>
                  <div className="text-xs font-semibold text-slate-900 mt-0.5">
                    {inspectedProperty.grossSqm} m² / {inspectedProperty.netSqm}{" "}
                    m²
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-slate-200/80">
                  <div className="text-[11px] text-slate-400">Oda Sayısı</div>
                  <div className="text-xs font-semibold text-slate-900 mt-0.5">
                    {inspectedProperty.roomCount}
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-slate-200/80">
                  <div className="text-[11px] text-slate-400">Bina Yaşı</div>
                  <div className="text-xs font-semibold text-slate-900 mt-0.5">
                    {inspectedProperty.buildingAge === 0
                      ? "0 (Sıfır)"
                      : `${inspectedProperty.buildingAge} Yaşında`}
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-slate-200/80">
                  <div className="text-[11px] text-slate-400">Kat Bilgisi</div>
                  <div className="text-xs font-semibold text-slate-900 mt-0.5">
                    {inspectedProperty.floorInfo}
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-slate-200/80">
                  <div className="text-[11px] text-slate-400">Isıtma Türü</div>
                  <div className="text-xs font-semibold text-slate-900 mt-0.5">
                    {inspectedProperty.heatingType}
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-slate-200/80">
                  <div className="text-[11px] text-slate-400">
                    Sorumlu Danışman
                  </div>
                  <div className="text-xs font-semibold text-slate-900 mt-0.5">
                    {inspectedProperty.assignedAgent}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Donanım ve Özellikler
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {inspectedProperty.features.map((f, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="text-xs font-semibold text-slate-800">
                  Portföy Sahibi & Yetki Sözleşmesi Bilgileri
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div>
                    Ad Soyad:{" "}
                    <strong className="text-slate-900">
                      {inspectedProperty.owner.fullName}
                    </strong>
                  </div>
                  <div>
                    Telefon:{" "}
                    <strong className="text-slate-900">
                      {inspectedProperty.owner.phone}
                    </strong>
                  </div>
                  <div>
                    Hizmet Bedeli:{" "}
                    <strong className="text-slate-900">
                      {inspectedProperty.owner.commissionRate}
                    </strong>
                  </div>
                  <div>
                    Yetki Bitiş:{" "}
                    <strong className="text-slate-900">
                      {formatDateTR(inspectedProperty.owner.authorizationEnd)}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  const p = inspectedProperty;
                  setInspectedProperty(null);
                  openEditModal(p);
                }}
                className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Portföyü Düzenle
              </button>
              <button
                onClick={() => setInspectedProperty(null)}
                className="px-4 py-2 rounded-lg bg-slate-900 text-xs font-medium text-white hover:bg-slate-800"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Portföy Ekleme / Düzenleme Modalı */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  {editingProperty
                    ? `Portföy Düzenle (${editingProperty.code})`
                    : "Yeni Gayrimenkul Portföyü Ekle"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kaydettiğiniz ilan, AI asistan tarafından uygun müşterilere hemen önerilebilir.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProperty} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    İlan Başlığı *
                  </label>
                  <input
                    required
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Örn: Suadiye Bağdat Caddesi Yakını 3+1"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Fiyat (₺) *
                  </label>
                  <input
                    required
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Gayrimenkul Kategorisi
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) =>
                      setFormCategory(e.target.value as PropertyCategory)
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
                    İşlem Türü
                  </label>
                  <select
                    value={formListingType}
                    onChange={(e) =>
                      setFormListingType(e.target.value as ListingType)
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Satılık">Satılık</option>
                    <option value="Kiralık">Kiralık</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Portföy Durumu
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) =>
                      setFormStatus(e.target.value as PropertyStatus)
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Opsiyonlu">Opsiyonlu</option>
                    <option value="Satıldı">Satıldı</option>
                    <option value="Kiralandı">Kiralandı</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    İl
                  </label>
                  <input
                    type="text"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    İlçe
                  </label>
                  <input
                    type="text"
                    value={formDistrict}
                    onChange={(e) => setFormDistrict(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Mahalle / Konum
                  </label>
                  <input
                    type="text"
                    value={formNeighborhood}
                    onChange={(e) => setFormNeighborhood(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Brüt m²
                  </label>
                  <input
                    type="number"
                    value={formGrossSqm}
                    onChange={(e) => setFormGrossSqm(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Net m²
                  </label>
                  <input
                    type="number"
                    value={formNetSqm}
                    onChange={(e) => setFormNetSqm(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Oda Sayısı
                  </label>
                  <input
                    type="text"
                    value={formRoomCount}
                    onChange={(e) => setFormRoomCount(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Bina Yaşı
                  </label>
                  <input
                    type="number"
                    value={formBuildingAge}
                    onChange={(e) => setFormBuildingAge(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Kat Bilgisi
                  </label>
                  <input
                    type="text"
                    value={formFloorInfo}
                    onChange={(e) => setFormFloorInfo(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Isıtma Türü
                  </label>
                  <input
                    type="text"
                    value={formHeatingType}
                    onChange={(e) => setFormHeatingType(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Özellikler (Virgülle ayırın)
                  </label>
                  <input
                    type="text"
                    value={formFeaturesText}
                    onChange={(e) => setFormFeaturesText(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Açıklama
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Portföy Sahibi Ad Soyad
                  </label>
                  <input
                    type="text"
                    value={formOwnerName}
                    onChange={(e) => setFormOwnerName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Portföy Sahibi Telefon
                  </label>
                  <input
                    type="text"
                    value={formOwnerPhone}
                    onChange={(e) => setFormOwnerPhone(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Komisyon Oranı
                  </label>
                  <input
                    type="text"
                    value={formCommission}
                    onChange={(e) => setFormCommission(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 text-xs font-medium text-white hover:bg-slate-800"
                >
                  {editingProperty ? "Değişiklikleri Kaydet" : "Portföyü Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
