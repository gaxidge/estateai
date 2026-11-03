"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Bot,
  Send,
  UserCheck,
  ShieldCheck,
  Search,
  UserPlus,
  UserCog,
  CalendarCheck,
  FileText,
  CheckCircle2,
  MessageCircle,
  Globe,
  Sparkles,
  Info,
} from "lucide-react";
import { useEstateStore } from "@/context/estate-store";
import { AIConversation, AIToolCallLog, ToolCallName } from "@/lib/types";
import { cn, formatTRY } from "@/lib/utils";

/** Asistanın arka planda yaptığı işlemlerin kullanıcıya gösterilen sade karşılıkları */
const ACTION_LABELS: Record<ToolCallName, { label: string; icon: React.ElementType }> = {
  GetCustomerDetails: { label: "Müşteri kaydı kontrol edildi", icon: UserCog },
  SearchProperties: { label: "Portföyünüzde arama yapıldı", icon: Search },
  SendPropertyDetails: { label: "İlan bilgileri müşteriye gönderildi", icon: FileText },
  CreateCustomer: { label: "Yeni müşteri kaydı açıldı", icon: UserPlus },
  UpdateCustomer: { label: "Müşteri kartı güncellendi", icon: UserCog },
  CreateAppointment: { label: "Randevu oluşturuldu", icon: CalendarCheck },
  TransferToHuman: { label: "Görüşme danışmana aktarıldı", icon: UserCheck },
};

const actionLabel = (tc: AIToolCallLog) => {
  if (tc.toolName === "SearchProperties" && tc.status === "warning") {
    return "Uygun ilan bulunamadı";
  }
  return ACTION_LABELS[tc.toolName].label;
};

const ASSISTANT_CAPABILITIES = [
  "Müşteriyle doğal Türkçe konuşur, ihtiyacını öğrenir",
  "Portföyünüzden uygun ilanları bulup önerir",
  "Yeni müşteriyi listenize kaydeder",
  "Önceki görüşmeleri hatırlar",
  "Yer gösterme randevusu oluşturur",
  "Gerektiğinde görüşmeyi size aktarır",
];

const STATUS_STYLES: Record<AIConversation["status"], string> = {
  "AI Aktif": "bg-sky-50 text-sky-700 ring-sky-200",
  "Temsilciye Aktarıldı": "bg-amber-50 text-amber-800 ring-amber-200",
  "Randevu Alındı": "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Tamamlandı: "bg-slate-100 text-slate-700 ring-slate-200",
};

const STATUS_LABELS: Record<AIConversation["status"], string> = {
  "AI Aktif": "Asistan yanıtlıyor",
  "Temsilciye Aktarıldı": "Sizi bekliyor",
  "Randevu Alındı": "Randevu alındı",
  Tamamlandı: "Tamamlandı",
};

const channelLabel = (c: AIConversation["channel"]) =>
  c === "WhatsApp Cloud API" ? "WhatsApp" : "Web sitesi";

const initials = (name: string) =>
  name
    .replace(/\(.*?\)/g, "")
    .trim()
    .split(/\s+/)
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/** **kalın** yazımı düz metin içinde kalın olarak gösterir */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={i} className="font-semibold">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <React.Fragment key={i}>{p}</React.Fragment>
        )
      )}
    </>
  );
}

export default function AiAssistantPage() {
  const { conversations, sendCustomerSimulationMessage, sendAgentMessage, transferConversationToHuman } =
    useEstateStore();

  const [selectedConvId, setSelectedConvId] = useState<string>(conversations[0]?.id || "");
  const [inputMessage, setInputMessage] = useState("");
  const [mode, setMode] = useState<"agent" | "test">("test");
  const scrollRef = useRef<HTMLDivElement>(null);

  const active = conversations.find((c) => c.id === selectedConvId) || conversations[0];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [active?.messages.length, selectedConvId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !active) return;
    if (mode === "test") sendCustomerSimulationMessage(active.id, inputMessage.trim());
    else sendAgentMessage(active.id, inputMessage.trim());
    setInputMessage("");
  };

  const examples = [
    "Kadıköy'de satılık 4+1 daireniz var mı?",
    "Zekeriyaköy'de havuzlu villa arıyorum",
    "Yarın saat 15:00'te görmek istiyorum",
    "Bir danışmanla görüşmek istiyorum",
  ];

  if (!active) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
        <Bot className="mx-auto h-8 w-8 text-slate-300" />
        <p className="mt-3 text-sm font-medium text-slate-700">Henüz bir görüşme yok</p>
        <p className="mt-1 text-xs text-slate-500">
          Müşterileriniz WhatsApp'tan yazdığında görüşmeler burada listelenecek.
        </p>
      </div>
    );
  }

  const isTransferred = active.status === "Temsilciye Aktarıldı";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">AI Asistan</h1>
          <p className="mt-1 text-sm text-slate-500">
            Asistanınızın müşterilerle yaptığı WhatsApp görüşmelerini takip edin, gerektiğinde devralın.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800 ring-1 ring-inset ring-emerald-200">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          Asistan yalnızca portföyünüzdeki gerçek ilanları önerir
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        {/* Görüşme listesi */}
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white lg:col-span-3">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <span className="text-sm font-semibold text-slate-900">Görüşmeler</span>
            <span className="text-xs text-slate-500">{conversations.length} sohbet</span>
          </div>
          <div className="divide-y divide-slate-100">
            {conversations.map((conv) => {
              const selected = conv.id === active.id;
              const last = conv.messages[conv.messages.length - 1];
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={cn(
                    "flex w-full gap-3 px-4 py-3.5 text-left transition",
                    selected ? "bg-slate-50" : "hover:bg-slate-50/70"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                      selected ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
                    )}
                  >
                    {initials(conv.customerName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-[13px] font-semibold text-slate-900">
                        {conv.customerName}
                      </span>
                      <span className="shrink-0 text-[11px] text-slate-400">{conv.lastMessageAt}</span>
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                      {last?.content.replace(/\*\*/g, "")}
                    </p>
                    <span
                      className={cn(
                        "mt-2 inline-flex rounded-md px-1.5 py-0.5 text-[10.5px] font-medium ring-1 ring-inset",
                        STATUS_STYLES[conv.status]
                      )}
                    >
                      {STATUS_LABELS[conv.status]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sohbet */}
        <div className="flex h-[720px] flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white lg:col-span-6">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 px-5 py-3.5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                {initials(active.customerName)}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900">{active.customerName}</div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  {active.channel === "WhatsApp Cloud API" ? (
                    <MessageCircle className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <Globe className="h-3 w-3" />
                  )}
                  {channelLabel(active.channel)} · {active.customerPhone}
                </div>
              </div>
            </div>
            <button
              onClick={() => transferConversationToHuman(active.id)}
              disabled={isTransferred}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition",
                isTransferred
                  ? "cursor-default bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200"
                  : "border border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              <UserCheck className="h-3.5 w-3.5" />
              {isTransferred ? "Görüşme sizde" : "Görüşmeyi devral"}
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto bg-[#F7F8FA] px-5 py-5">
            {active.messages.map((msg) => {
              if (msg.sender === "system") {
                return (
                  <div key={msg.id} className="flex justify-center">
                    <div className="rounded-full bg-amber-50 px-3 py-1.5 text-[11px] font-medium text-amber-800 ring-1 ring-inset ring-amber-200">
                      {msg.content}
                    </div>
                  </div>
                );
              }

              const isCustomer = msg.sender === "customer";
              const senderName = isCustomer
                ? active.customerName
                : msg.sender === "agent"
                ? "Danışman"
                : "AI Asistan";

              return (
                <div key={msg.id} className={cn("flex flex-col gap-2", isCustomer ? "items-start" : "items-end")}>
                  {/* Asistanın yaptığı işlemler */}
                  {msg.toolCalls && msg.toolCalls.length > 0 && (
                    <div className="flex max-w-[85%] flex-wrap justify-end gap-1.5">
                      {msg.toolCalls.map((tc) => {
                        const Icon = ACTION_LABELS[tc.toolName].icon;
                        const warn = tc.status === "warning";
                        return (
                          <span
                            key={tc.id}
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset",
                              warn ? "text-amber-800 ring-amber-200" : "text-slate-600 ring-slate-200"
                            )}
                          >
                            <Icon className={cn("h-3 w-3", warn ? "text-amber-600" : "text-emerald-600")} />
                            {actionLabel(tc)}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed",
                      isCustomer
                        ? "rounded-tl-md bg-white text-slate-800 ring-1 ring-inset ring-slate-200"
                        : msg.sender === "agent"
                        ? "rounded-tr-md bg-slate-700 text-white"
                        : "rounded-tr-md bg-slate-900 text-white"
                    )}
                  >
                    <div
                      className={cn(
                        "mb-1 flex items-center gap-3 text-[11px]",
                        isCustomer ? "text-slate-400" : "text-slate-400"
                      )}
                    >
                      <span className="flex items-center gap-1 font-medium">
                        {msg.sender === "ai" && <Sparkles className="h-3 w-3" />}
                        {senderName}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <div className="whitespace-pre-line">
                      <RichText text={msg.content} />
                    </div>
                  </div>

                  {msg.attachedProperties && msg.attachedProperties.length > 0 && (
                    <div className="grid w-full max-w-[85%] gap-2">
                      {msg.attachedProperties.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center gap-3 rounded-xl bg-white p-2.5 ring-1 ring-inset ring-slate-200"
                        >
                          <img src={p.image} alt={p.title} className="h-14 w-16 shrink-0 rounded-lg object-cover" />
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-[13px] font-medium text-slate-900">{p.title}</div>
                            <div className="mt-0.5 text-xs text-slate-500">
                              {p.location} · {p.roomCount} · {p.netSqm} m²
                            </div>
                          </div>
                          <div className="shrink-0 text-right">
                            <div className="text-[13px] font-semibold text-slate-900">{formatTRY(p.price)}</div>
                            <div className="text-[11px] text-slate-400">{p.code}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="space-y-3 border-t border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setMode("test")}
                  className={cn(
                    "rounded-md px-3 py-1.5 font-medium transition",
                    mode === "test" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                  )}
                >
                  Asistanı dene
                </button>
                <button
                  type="button"
                  onClick={() => setMode("agent")}
                  className={cn(
                    "rounded-md px-3 py-1.5 font-medium transition",
                    mode === "agent" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                  )}
                >
                  Müşteriye yaz
                </button>
              </div>
              <span className="hidden items-center gap-1 text-[11px] text-slate-400 sm:flex">
                <Info className="h-3 w-3" />
                {mode === "test"
                  ? "Müşteri gibi yazın, asistanın nasıl yanıt verdiğini görün"
                  : "Mesajınız doğrudan müşteriye gider"}
              </span>
            </div>

            {mode === "test" && (
              <div className="flex gap-1.5 overflow-x-auto pb-0.5">
                {examples.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => sendCustomerSimulationMessage(active.id, p)}
                    className="whitespace-nowrap rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  mode === "test" ? "Müşteri gibi bir mesaj yazın…" : "Müşteriye mesajınızı yazın…"
                }
                className="flex-1 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:border-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                <Send className="h-4 w-4" />
                Gönder
              </button>
            </form>
          </div>
        </div>

        {/* Müşteri özeti */}
        <div className="space-y-4 lg:col-span-3">
          <div className="rounded-xl border border-slate-200/80 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-900">Müşteri Ne Arıyor?</h3>
            <p className="mt-0.5 text-xs text-slate-500">Asistanın görüşmeden çıkardığı bilgiler</p>

            <dl className="mt-4 space-y-3 text-[13px]">
              {[
                ["İşlem", `${active.extractedContext.intent} ${active.extractedContext.category}`],
                ["Bütçe", active.extractedContext.budgetRange],
                ["Oda / Özellik", active.extractedContext.roomPreference],
                ["Aciliyet", active.extractedContext.urgency],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-slate-500">{k}</dt>
                  <dd className="text-right font-medium text-slate-900">{v}</dd>
                </div>
              ))}
              <div>
                <dt className="mb-1.5 text-slate-500">Bölgeler</dt>
                <dd className="flex flex-wrap gap-1">
                  {active.extractedContext.locations.map((loc) => (
                    <span key={loc} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                      {loc}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>

            <div className="mt-4 border-t border-slate-100 pt-4">
              <div className="text-xs font-semibold text-slate-700">Görüşme özeti</div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">{active.aiSummary}</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-900">Asistanınız neler yapabilir?</h3>
            <ul className="mt-3 space-y-2.5">
              {ASSISTANT_CAPABILITIES.map((c) => (
                <li key={c} className="flex items-start gap-2 text-[13px] text-slate-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
