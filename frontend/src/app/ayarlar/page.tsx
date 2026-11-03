"use client";

import React, { useState } from "react";
import {
  Building2,
  Users,
  Bot,
  MessageCircle,
  Bell,
  CreditCard,
  CheckCircle2,
  Plus,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { useEstateStore } from "@/context/estate-store";
import { cn } from "@/lib/utils";

type SettingsTab = "ofis" | "ekip" | "ai" | "whatsapp" | "bildirim" | "abonelik";

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

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-medium text-slate-700">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-slate-400 focus:outline-none";

function SectionHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="border-b border-slate-100 pb-5">
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{desc}</p>
    </div>
  );
}

function ToggleRow({
  title,
  desc,
  checked,
  onChange,
}: {
  title: string;
  desc: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-4">
      <div>
        <div className="text-sm font-medium text-slate-900">{title}</div>
        <div className="mt-0.5 text-[13px] text-slate-500">{desc}</div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

export default function SettingsPage() {
  const { currentTenant, updateTenantInfo } = useEstateStore();

  const [activeTab, setActiveTab] = useState<SettingsTab>("ofis");
  const [saved, setSaved] = useState(false);

  const [officeName, setOfficeName] = useState(currentTenant.name);
  const [city, setCity] = useState(currentTenant.city);
  const [taxNo, setTaxNo] = useState(currentTenant.taxNumber);
  const [phone, setPhone] = useState(currentTenant.phone);
  const [address, setAddress] = useState("Bağdat Cad. No:245 Suadiye, Kadıköy / İstanbul");

  const [assistantName, setAssistantName] = useState("Ece");
  const [tone, setTone] = useState("dengeli");
  const [hours, setHours] = useState("7/24");
  const [greeting, setGreeting] = useState(
    "Merhaba, Boğaziçi Prestij Gayrimenkul'e hoş geldiniz! Ben dijital asistanınız Ece. Size nasıl yardımcı olabilirim?"
  );
  const [extraNotes, setExtraNotes] = useState(
    "Müşterilere her zaman nazik ve güven veren bir dille yaklaş. Fiyat pazarlığı sorulursa görüşmeyi danışmana aktar."
  );
  const [aiPrefs, setAiPrefs] = useState({
    appointments: true,
    photos: true,
    priceTransfer: true,
  });

  const [notifs, setNotifs] = useState({
    transfer: true,
    appointment: true,
    match: true,
    daily: false,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const save = (e?: React.FormEvent) => {
    e?.preventDefault();
    updateTenantInfo({ name: officeName, city, taxNumber: taxNo, phone });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
    { id: "ofis", label: "Ofis Bilgileri", icon: Building2 },
    { id: "ekip", label: "Ekip", icon: Users },
    { id: "ai", label: "AI Asistan", icon: Bot },
    { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
    { id: "bildirim", label: "Bildirimler", icon: Bell },
    { id: "abonelik", label: "Paket ve Ödeme", icon: CreditCard },
  ];

  const team = [
    { name: "Selim Soylu", role: "Ofis Yöneticisi", email: "selim@bogaziciprestij.com.tr", area: "Lüks konut · Bağdat Caddesi" },
    { name: "Merve Arslan", role: "Kıdemli Danışman", email: "merve@bogaziciprestij.com.tr", area: "Villa ve müstakil ev" },
    { name: "Burak Demir", role: "Ticari Gayrimenkul Uzmanı", email: "burak@bogaziciprestij.com.tr", area: "Ofis, arsa ve depo" },
  ];

  const SaveBar = ({ label = "Değişiklikleri kaydet" }: { label?: string }) => (
    <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
      {saved && (
        <span className="flex items-center gap-1.5 text-[13px] font-medium text-emerald-700">
          <CheckCircle2 className="h-4 w-4" /> Kaydedildi
        </span>
      )}
      <button
        type="submit"
        className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        {label}
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Ayarlar</h1>
        <p className="mt-1 text-sm text-slate-500">Ofisinizi, ekibinizi ve asistanınızı yönetin.</p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <nav className="flex gap-1 overflow-x-auto rounded-xl border border-slate-200/80 bg-white p-2 lg:col-span-3 lg:flex-col">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={cn(
                  "flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2.5 text-left text-[13.5px] font-medium transition",
                  active ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "text-slate-900" : "text-slate-400")} />
                {t.label}
              </button>
            );
          })}
        </nav>

        <div className="rounded-xl border border-slate-200/80 bg-white p-6 lg:col-span-9">
          {activeTab === "ofis" && (
            <form onSubmit={save} className="space-y-6">
              <SectionHeader title="Ofis Bilgileri" desc="Müşterilerinize ve belgelerinizde görünecek ofis bilgileri." />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Ofis adı">
                  <input className={inputCls} value={officeName} onChange={(e) => setOfficeName(e.target.value)} />
                </Field>
                <Field label="Yetki belgesi / Vergi no">
                  <input className={inputCls} value={taxNo} onChange={(e) => setTaxNo(e.target.value)} />
                </Field>
                <Field label="İl">
                  <input className={inputCls} value={city} onChange={(e) => setCity(e.target.value)} />
                </Field>
                <Field label="Telefon">
                  <input className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Adres">
                    <input className={inputCls} value={address} onChange={(e) => setAddress(e.target.value)} />
                  </Field>
                </div>
              </div>
              <SaveBar />
            </form>
          )}

          {activeTab === "ekip" && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Ekip</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {currentTenant.activeUsers} / {currentTenant.maxUsers} kullanıcı hakkı kullanılıyor
                  </p>
                </div>
                <button className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800">
                  <Plus className="h-4 w-4" /> Danışman davet et
                </button>
              </div>
              <ul className="divide-y divide-slate-100">
                {team.map((m) => (
                  <li key={m.email} className="flex items-center justify-between gap-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                        {m.name.split(" ").map((s) => s[0]).join("")}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{m.name}</div>
                        <div className="text-[13px] text-slate-500">
                          {m.role} · {m.area}
                        </div>
                      </div>
                    </div>
                    <span className="hidden text-[13px] text-slate-500 md:block">{m.email}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "ai" && (
            <form onSubmit={save} className="space-y-6">
              <SectionHeader
                title="AI Asistan"
                desc="Asistanınızın müşterilerle nasıl konuşacağını ve neler yapabileceğini belirleyin."
              />

              <div className="flex items-start gap-3 rounded-lg bg-emerald-50 p-4 text-[13px] text-emerald-900 ring-1 ring-inset ring-emerald-200">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                Asistanınız yalnızca portföyünüzde kayıtlı ilanları paylaşır. Olmayan bir ilan, fiyat veya özellik
                hakkında asla bilgi uydurmaz.
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <Field label="Asistanın adı">
                  <input className={inputCls} value={assistantName} onChange={(e) => setAssistantName(e.target.value)} />
                </Field>
                <Field label="Konuşma tarzı">
                  <select className={inputCls} value={tone} onChange={(e) => setTone(e.target.value)}>
                    <option value="resmi">Resmi</option>
                    <option value="dengeli">Dengeli (önerilen)</option>
                    <option value="samimi">Samimi</option>
                  </select>
                </Field>
                <Field label="Çalışma saatleri">
                  <select className={inputCls} value={hours} onChange={(e) => setHours(e.target.value)}>
                    <option value="7/24">7/24 açık</option>
                    <option value="mesai">Sadece mesai dışında (18:00–09:00)</option>
                    <option value="haftasonu">Mesai dışı ve hafta sonu</option>
                  </select>
                </Field>
              </div>

              <Field label="Karşılama mesajı" hint="Müşteri ilk kez yazdığında gönderilir.">
                <textarea rows={2} className={inputCls} value={greeting} onChange={(e) => setGreeting(e.target.value)} />
              </Field>

              <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 px-4">
                <ToggleRow
                  title="Randevuyu kendisi oluşturabilsin"
                  desc="Müşteri uygun bir saat söylediğinde takviminize randevu ekler."
                  checked={aiPrefs.appointments}
                  onChange={() => setAiPrefs((p) => ({ ...p, appointments: !p.appointments }))}
                />
                <ToggleRow
                  title="İlan fotoğraflarını göndersin"
                  desc="Önerdiği ilanların fotoğraf ve bilgilerini müşteriye iletir."
                  checked={aiPrefs.photos}
                  onChange={() => setAiPrefs((p) => ({ ...p, photos: !p.photos }))}
                />
                <ToggleRow
                  title="Pazarlık sorularında size aktarsın"
                  desc="Fiyat indirimi veya sözleşme şartı sorulduğunda görüşmeyi danışmana devreder."
                  checked={aiPrefs.priceTransfer}
                  onChange={() => setAiPrefs((p) => ({ ...p, priceTransfer: !p.priceTransfer }))}
                />
              </div>

              <Field label="Asistana özel notlarınız" hint="Asistanın dikkat etmesini istediğiniz kuralları kendi cümlelerinizle yazın.">
                <textarea rows={3} className={inputCls} value={extraNotes} onChange={(e) => setExtraNotes(e.target.value)} />
              </Field>

              <SaveBar />
            </form>
          )}

          {activeTab === "whatsapp" && (
            <form onSubmit={save} className="space-y-6">
              <SectionHeader title="WhatsApp" desc="Asistanınızın müşterilerle konuştuğu WhatsApp hattı." />

              <div className="flex flex-col gap-4 rounded-xl border border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-semibold text-slate-900">{currentTenant.whatsappNumber}</span>
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                        Bağlı
                      </span>
                    </div>
                    <div className="mt-0.5 text-[13px] text-slate-500">
                      WhatsApp Business hesabı · Bu ay 1.284 mesaj
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Test mesajı gönder
                </button>
              </div>

              <div className="rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <div>
                    <div className="text-sm font-medium text-slate-900">Bağlantı bilgileri</div>
                    <div className="text-[13px] text-slate-500">Yalnızca ilk kurulumda veya teknik destek isterse gereklidir.</div>
                  </div>
                  <ChevronDown className={cn("h-4 w-4 text-slate-400 transition", showAdvanced && "rotate-180")} />
                </button>
                {showAdvanced && (
                  <div className="grid grid-cols-1 gap-5 border-t border-slate-100 p-5 sm:grid-cols-2">
                    <Field label="İşletme hesap numarası">
                      <input className={inputCls} defaultValue="109482746192834" />
                    </Field>
                    <Field label="Telefon numarası kimliği">
                      <input className={inputCls} defaultValue="118392049581726" />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field label="Erişim anahtarı">
                        <input type="password" className={inputCls} defaultValue="xxxxxxxxxxxxxxxx" />
                      </Field>
                    </div>
                  </div>
                )}
              </div>

              <SaveBar />
            </form>
          )}

          {activeTab === "bildirim" && (
            <div className="space-y-2">
              <SectionHeader title="Bildirimler" desc="Hangi durumlarda size haber verilsin?" />
              <div className="divide-y divide-slate-100">
                <ToggleRow
                  title="Müşteri sizi beklediğinde"
                  desc="Asistan bir görüşmeyi size aktardığında anında bildirim alın."
                  checked={notifs.transfer}
                  onChange={() => setNotifs((n) => ({ ...n, transfer: !n.transfer }))}
                />
                <ToggleRow
                  title="Yeni randevu oluşturulduğunda"
                  desc="Asistan veya ekibiniz takvime randevu eklediğinde haber verilir."
                  checked={notifs.appointment}
                  onChange={() => setNotifs((n) => ({ ...n, appointment: !n.appointment }))}
                />
                <ToggleRow
                  title="Yeni ilana uygun müşteri bulunduğunda"
                  desc="Eklediğiniz ilana uyan müşteriler olduğunda öneri listesi gelir."
                  checked={notifs.match}
                  onChange={() => setNotifs((n) => ({ ...n, match: !n.match }))}
                />
                <ToggleRow
                  title="Gün sonu özeti e-postası"
                  desc="Her akşam günün görüşme ve randevu özetini e-postanıza gönderir."
                  checked={notifs.daily}
                  onChange={() => setNotifs((n) => ({ ...n, daily: !n.daily }))}
                />
              </div>
            </div>
          )}

          {activeTab === "abonelik" && (
            <div className="space-y-6">
              <SectionHeader title="Paket ve Ödeme" desc="Mevcut paketiniz ve diğer seçenekler. Fiyatlara KDV dahildir." />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {[
                  {
                    name: "Bireysel",
                    price: "₺2.490",
                    desc: "Tek başına çalışan danışmanlar için",
                    features: ["1 kullanıcı", "100 ilana kadar", "Aylık 1.000 WhatsApp mesajı", "Randevu hatırlatma"],
                    current: false,
                  },
                  {
                    name: "Ofis",
                    price: "₺6.900",
                    desc: "Büyüyen emlak ofisleri için",
                    features: ["15 kullanıcı", "Sınırsız ilan ve müşteri", "7/24 AI asistan", "Otomatik müşteri eşleştirme"],
                    current: true,
                  },
                  {
                    name: "Kurumsal",
                    price: "₺14.500",
                    desc: "Çok şubeli markalar için",
                    features: ["Sınırsız kullanıcı ve şube", "Şubeler arası raporlama", "Öncelikli destek", "Özel kurulum ve eğitim"],
                    current: false,
                  },
                ].map((plan) => (
                  <div
                    key={plan.name}
                    className={cn(
                      "flex flex-col rounded-xl border p-5",
                      plan.current ? "border-slate-900 ring-1 ring-slate-900" : "border-slate-200"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">{plan.name}</span>
                      {plan.current && (
                        <span className="rounded-md bg-slate-900 px-2 py-0.5 text-[11px] font-medium text-white">
                          Mevcut paket
                        </span>
                      )}
                    </div>
                    <div className="mt-3">
                      <span className="text-2xl font-semibold text-slate-900">{plan.price}</span>
                      <span className="text-sm text-slate-500"> / ay</span>
                    </div>
                    <p className="mt-1 text-[13px] text-slate-500">{plan.desc}</p>
                    <ul className="mt-4 flex-1 space-y-2 border-t border-slate-100 pt-4">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-[13px] text-slate-700">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      disabled={plan.current}
                      className={cn(
                        "mt-5 w-full rounded-lg py-2.5 text-sm font-medium transition",
                        plan.current
                          ? "cursor-default bg-slate-100 text-slate-500"
                          : "bg-slate-900 text-white hover:bg-slate-800"
                      )}
                    >
                      {plan.current ? "Kullanılıyor" : "Bu pakete geç"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
