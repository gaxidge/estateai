"use client";

import React, { createContext, useContext, useState } from "react";
import {
  AIConversation,
  AIToolCallLog,
  Appointment,
  AutomationExecutionLog,
  AutomationJob,
  ChatMessage,
  Customer,
  CustomerStatus,
  Property,
  TenantOffice,
} from "@/lib/types";
import {
  INITIAL_AI_CONVERSATIONS,
  INITIAL_APPOINTMENTS,
  INITIAL_AUTOMATION_LOGS,
  INITIAL_AUTOMATIONS,
  INITIAL_CUSTOMERS,
  INITIAL_PROPERTIES,
  TENANT_OFFICES,
} from "@/lib/mock-data";
import { formatTRY } from "@/lib/utils";

interface EstateStoreContextType {
  currentTenant: TenantOffice;
  tenants: TenantOffice[];
  switchTenant: (tenantId: string) => void;
  updateTenantInfo: (partial: Partial<TenantOffice>) => void;

  properties: Property[];
  addProperty: (prop: Omit<Property, "id" | "tenantId" | "code" | "viewsCount" | "aiMatchCount" | "createdAt">) => void;
  updateProperty: (id: string, prop: Partial<Property>) => void;
  deleteProperty: (id: string) => void;

  customers: Customer[];
  addCustomer: (cust: Omit<Customer, "id" | "tenantId" | "lastContactDate" | "aiLeadScore" | "matchedPropertyIds" | "interactions">) => void;
  updateCustomerStatus: (id: string, status: CustomerStatus) => void;
  updateCustomer: (id: string, partial: Partial<Customer>) => void;

  conversations: AIConversation[];
  sendCustomerSimulationMessage: (conversationId: string, text: string) => void;
  sendAgentMessage: (conversationId: string, text: string) => void;
  transferConversationToHuman: (conversationId: string) => void;

  appointments: Appointment[];
  addAppointment: (apt: Omit<Appointment, "id" | "tenantId">) => void;
  updateAppointmentStatus: (id: string, status: Appointment["status"]) => void;

  automations: AutomationJob[];
  automationLogs: AutomationExecutionLog[];
  toggleAutomation: (id: string) => void;
  triggerAutomationNow: (id: string) => void;
}

const EstateStoreContext = createContext<EstateStoreContextType | undefined>(undefined);

export function EstateStoreProvider({ children }: { children: React.ReactNode }) {
  const [tenants, setTenants] = useState<TenantOffice[]>(TENANT_OFFICES);
  const [currentTenantId, setCurrentTenantId] = useState<string>("tenant-1");

  const [allProperties, setAllProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [allCustomers, setAllCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [allConversations, setAllConversations] = useState<AIConversation[]>(
    INITIAL_AI_CONVERSATIONS
  );
  const [allAppointments, setAllAppointments] = useState<Appointment[]>(
    INITIAL_APPOINTMENTS
  );
  const [automations, setAutomations] = useState<AutomationJob[]>(INITIAL_AUTOMATIONS);
  const [automationLogs, setAutomationLogs] = useState<AutomationExecutionLog[]>(
    INITIAL_AUTOMATION_LOGS
  );

  const currentTenant =
    tenants.find((t) => t.id === currentTenantId) || tenants[0];

  const switchTenant = (tenantId: string) => {
    setCurrentTenantId(tenantId);
  };

  const updateTenantInfo = (partial: Partial<TenantOffice>) => {
    setTenants((prev) =>
      prev.map((t) => (t.id === currentTenantId ? { ...t, ...partial } : t))
    );
  };

  // Multi-Tenant veri izolasyonu: Sadece aktif ofise ait kayıtlar döner (tenant-2 seçildiğinde örnek kayıtlar veya boş izole liste)
  const properties = allProperties.filter((p) => p.tenantId === currentTenantId);
  const customers = allCustomers.filter((c) => c.tenantId === currentTenantId);
  const conversations = allConversations.filter(
    (c) => c.tenantId === currentTenantId
  );
  const appointments = allAppointments.filter(
    (a) => a.tenantId === currentTenantId
  );

  const addProperty: EstateStoreContextType["addProperty"] = (newProp) => {
    const nextNum = 1075 + allProperties.length * 3;
    const created: Property = {
      ...newProp,
      id: `prop-${Date.now()}`,
      tenantId: currentTenantId,
      code: `EST-${nextNum}`,
      viewsCount: 1,
      aiMatchCount: 2,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setAllProperties((prev) => [created, ...prev]);

    // Hangfire eşleştirme logu ekle
    setAutomationLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        jobId: "job-502",
        jobName: "Yeni ilana uygun müşteri bul",
        executedAt: new Date().toLocaleString("tr-TR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        durationMs: 380,
        status: "Başarılı",
        detail: `${created.title} ilanı eklendi; bütçesi ve bölgesi uyan müşteriler kontrol edildi.`,
        affectedEntity: `${created.code} ilanı`,
      },
      ...prev,
    ]);
  };

  const updateProperty = (id: string, partial: Partial<Property>) => {
    setAllProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...partial } : p))
    );
  };

  const deleteProperty = (id: string) => {
    setAllProperties((prev) => prev.filter((p) => p.id !== id));
  };

  const addCustomer: EstateStoreContextType["addCustomer"] = (newCust) => {
    // Uygun portföyleri otomatik bul
    const matched = properties
      .filter(
        (p) =>
          p.listingType === newCust.listingPreference &&
          p.price <= newCust.maxBudget * 1.15
      )
      .map((p) => p.id);

    const created: Customer = {
      ...newCust,
      id: `cust-${Date.now()}`,
      tenantId: currentTenantId,
      lastContactDate: new Date().toISOString(),
      aiLeadScore: 85,
      matchedPropertyIds: matched.slice(0, 3),
      interactions: [
        {
          id: `int-${Date.now()}`,
          date: new Date().toLocaleString("tr-TR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          channel: "AI Asistan",
          summary: "Müşteri kartı oluşturuldu ve otomatik portföy eşleştirmesi çalıştırıldı.",
          agentName: newCust.assignedAgent || "Selim Soylu",
        },
      ],
    };
    setAllCustomers((prev) => [created, ...prev]);
  };

  const updateCustomerStatus = (id: string, status: CustomerStatus) => {
    setAllCustomers((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status, lastContactDate: new Date().toISOString() }
          : c
      )
    );
  };

  const updateCustomer = (id: string, partial: Partial<Customer>) => {
    setAllCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...partial } : c))
    );
  };

  // AI Asistan: Gerçek veritabanı (state içindeki properties) üzerinde Function Calling simülasyonu
  const sendCustomerSimulationMessage = (conversationId: string, text: string) => {
    const nowTime = new Date().toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const nowFull = new Date().toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      sender: "customer",
      content: text,
      timestamp: nowTime,
    };

    const lower = text.toLowerCase();
    const toolCalls: AIToolCallLog[] = [];
    let aiReply = "";
    let attachedProps: ChatMessage["attachedProperties"] = undefined;
    let newStatus: AIConversation["status"] | undefined = undefined;

    // 1. İnsan temsilciye aktarım talebi kontrolü
    if (
      lower.includes("danışman") ||
      lower.includes("insan") ||
      lower.includes("yetkili") ||
      lower.includes("pazarlık") ||
      lower.includes("kontrat")
    ) {
      toolCalls.push({
        id: `tc-${Date.now()}-1`,
        toolName: "TransferToHuman",
        timestamp: nowFull,
        argumentsJson: JSON.stringify({
          conversationId,
          reason: "Müşteri doğrudan danışman/özel müzakere talep etti",
          assignedAgent: "Selim Soylu",
        }),
        resultSummary: "Görüşme kıdemli danışman Selim Soylu'ya SignalR ile devredildi.",
        durationMs: 78,
        status: "warning",
      });
      aiReply =
        "Talebinizi hemen kıdemli gayrimenkul danışmanımız **Selim Soylu**'ya aktardım. Tüm konuşma geçmişimiz ve ilgilendiğiniz portföy bilgileri kendisine iletildi; birkaç dakika içinde sizinle doğrudan iletişime geçecektir.";
      newStatus = "Temsilciye Aktarıldı";
    }
    // 2. Randevu oluşturma talebi kontrolü
    else if (
      lower.includes("randevu") ||
      lower.includes("görmek") ||
      lower.includes("görebilir") ||
      lower.includes("yarın") ||
      lower.includes("cumartesi") ||
      lower.includes("saat")
    ) {
      const conv = allConversations.find((c) => c.id === conversationId);
      const targetProp = properties[0];
      toolCalls.push({
        id: `tc-${Date.now()}-apt`,
        toolName: "CreateAppointment",
        timestamp: nowFull,
        argumentsJson: JSON.stringify({
          customerName: conv?.customerName || "Müşteri",
          propertyCode: targetProp?.code || "EST-1042",
          date: "2026-11-06",
          time: "15:00",
          agentName: "Selim Soylu",
        }),
        resultSummary: `Randevu oluşturuldu (${targetProp?.code || "EST-1042"} - 06.11.2026 15:00) ve Hangfire hatırlatması kuruldu.`,
        durationMs: 124,
        status: "success",
      });

      if (conv && targetProp) {
        const newApt: Appointment = {
          id: `apt-${Date.now()}`,
          tenantId: currentTenantId,
          customerId: conv.customerId,
          customerName: conv.customerName,
          customerPhone: conv.customerPhone,
          propertyId: targetProp.id,
          propertyCode: targetProp.code,
          propertyTitle: targetProp.title,
          propertyLocation: `${targetProp.district} / ${targetProp.neighborhood}`,
          date: "2026-11-06",
          time: "15:00",
          durationMinutes: 45,
          status: "Onaylandı",
          agentName: "Selim Soylu",
          createdBy: "AI Asistan",
          reminderSent: false,
          reminderChannel: "WhatsApp + SMS",
          notes: `AI Asistan üzerinden müşteri talebiyle oluşturuldu: "${text}"`,
        };
        setAllAppointments((prev) => [newApt, ...prev]);
      }

      aiReply = `Yer gösterme randevunuzu **06.11.2026 Cuma saat 15:00** için **${
        targetProp?.code || "EST-1042"
      }** kodlu portföyümüze oluşturdum ve danışmanımız **Selim Soylu**'nun takvimine kaydettim. Randevudan 2 saat önce konum bilgisi WhatsApp'ınıza otomatik gönderilecektir.`;
      newStatus = "Randevu Alındı";
    }
    // 3. Gayrimenkul arama (Sadece veritabanındaki gerçek kayıtlar, uydurma yok!)
    else {
      const matched = properties.filter((p) => {
        if (lower.includes("villa") && p.category !== "Villa") return false;
        if (lower.includes("arsa") && p.category !== "Arsa") return false;
        if (lower.includes("tarla") && p.category !== "Tarla") return false;
        if (
          (lower.includes("ofis") || lower.includes("iş yeri")) &&
          p.category !== "İş Yeri"
        )
          return false;
        if (lower.includes("dükkan") && p.category !== "Dükkan") return false;
        if (lower.includes("kiralık") && p.listingType !== "Kiralık") return false;
        if (lower.includes("satılık") && p.listingType !== "Satılık") return false;
        if (lower.includes("kadıköy") || lower.includes("suadiye"))
          return p.district.toLowerCase().includes("kadıköy");
        if (lower.includes("ataşehir"))
          return p.district.toLowerCase().includes("ataşehir");
        if (lower.includes("sarıyer") || lower.includes("zekeriyaköy"))
          return p.district.toLowerCase().includes("sarıyer");
        if (lower.includes("beşiktaş") || lower.includes("levent"))
          return p.district.toLowerCase().includes("beşiktaş");
        return true;
      });

      toolCalls.push({
        id: `tc-${Date.now()}-search`,
        toolName: "SearchProperties",
        timestamp: nowFull,
        argumentsJson: JSON.stringify({
          query: text,
          tenantId: currentTenantId,
          strictDatabaseMatch: true,
        }),
        resultSummary:
          matched.length > 0
            ? `Veritabanında ${matched.length} doğrulanmış portföy bulundu (${matched
                .slice(0, 2)
                .map((m) => m.code)
                .join(", ")}).`
            : "Veritabanında bu kriterlere uyan aktif portföy bulunamadı (Sıfır Halüsinasyon Politikası).",
        durationMs: 115,
        status: matched.length > 0 ? "success" : "warning",
      });

      if (matched.length > 0) {
        const top = matched.slice(0, 2);
        toolCalls.push({
          id: `tc-${Date.now()}-send`,
          toolName: "SendPropertyDetails",
          timestamp: nowFull,
          argumentsJson: JSON.stringify({
            propertyCodes: top.map((t) => t.code),
          }),
          resultSummary: `${top.length} adet doğrulanmış portföy kartı müşteriye iletildi.`,
          durationMs: 92,
          status: "success",
        });

        attachedProps = top.map((p) => ({
          id: p.id,
          code: p.code,
          title: p.title,
          price: p.price,
          location: `${p.district} / ${p.neighborhood}`,
          roomCount: p.roomCount,
          netSqm: p.netSqm,
          image: p.images[0],
        }));

        aiReply =
          `Veritabanımızdaki güncel portföylerimizi taradım. Kriterlerinize uyan **${top.length} doğrulanmış portföyümüz** aşağıdadır:\n\n` +
          top
            .map(
              (p) =>
                `• **${p.code} – ${p.title}**\n  Konum: ${p.district} / ${p.neighborhood} | ${p.roomCount} (${p.netSqm} m² Net) | **${formatTRY(p.price)}**`
            )
            .join("\n\n") +
          `\n\nBu portföylerimizden birini yerinde görmek için randevu oluşturmamı ister misiniz?`;
      } else {
        aiReply =
          "Şu anda güncel portföy veritabanımızda belirttiğiniz spesifik kriterlere birebir uyan aktif bir ilanımız bulunmamaktadır (yalnızca doğrulanmış portföylerimizi paylaşıyoruz). Talebinizi CRM sistemimize kaydettim; uygun bir gayrimenkul portföyümüze eklendiği anda size otomatik WhatsApp bildirimi göndermemi ister misiniz?";
      }
    }

    const aiMsg: ChatMessage = {
      id: `msg-${Date.now()}-ai`,
      sender: "ai",
      content: aiReply,
      timestamp: nowTime,
      toolCalls,
      attachedProperties: attachedProps,
    };

    setAllConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              status: newStatus || c.status,
              lastMessageAt: nowTime,
              messages: [...c.messages, userMsg, aiMsg],
            }
          : c
      )
    );
  };

  const sendAgentMessage = (conversationId: string, text: string) => {
    const nowTime = new Date().toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const agentMsg: ChatMessage = {
      id: `msg-${Date.now()}-ag`,
      sender: "agent",
      content: text,
      timestamp: nowTime,
    };
    setAllConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessageAt: nowTime,
              messages: [...c.messages, agentMsg],
            }
          : c
      )
    );
  };

  const transferConversationToHuman = (conversationId: string) => {
    const nowTime = new Date().toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const sysMsg: ChatMessage = {
      id: `msg-${Date.now()}-sys`,
      sender: "system",
      content:
        "Görüşme manuel olarak danışman kontrolüne alındı. AI otomatik yanıtlayıcı bu sohbet için duraklatıldı.",
      timestamp: nowTime,
    };
    setAllConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              status: "Temsilciye Aktarıldı",
              messages: [...c.messages, sysMsg],
            }
          : c
      )
    );
  };

  const addAppointment: EstateStoreContextType["addAppointment"] = (apt) => {
    const created: Appointment = {
      ...apt,
      id: `apt-${Date.now()}`,
      tenantId: currentTenantId,
    };
    setAllAppointments((prev) => [created, ...prev]);
  };

  const updateAppointmentStatus = (
    id: string,
    status: Appointment["status"]
  ) => {
    setAllAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const toggleAutomation = (id: string) => {
    setAutomations((prev) =>
      prev.map((job) =>
        job.id === id ? { ...job, isActive: !job.isActive } : job
      )
    );
  };

  const triggerAutomationNow = (id: string) => {
    const job = automations.find((j) => j.id === id);
    if (!job) return;
    const nowStr = new Date().toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    setAutomations((prev) =>
      prev.map((j) =>
        j.id === id
          ? { ...j, lastRunAt: nowStr, totalRuns30d: j.totalRuns30d + 1 }
          : j
      )
    );
    setAutomationLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        jobId: job.id,
        jobName: job.name,
        executedAt: nowStr,
        durationMs: 245,
        status: "Başarılı",
        detail: "Elle başlatıldı ve başarıyla tamamlandı.",
        affectedEntity: job.name,
      },
      ...prev,
    ]);
  };

  return (
    <EstateStoreContext.Provider
      value={{
        currentTenant,
        tenants,
        switchTenant,
        updateTenantInfo,
        properties,
        addProperty,
        updateProperty,
        deleteProperty,
        customers,
        addCustomer,
        updateCustomerStatus,
        updateCustomer,
        conversations,
        sendCustomerSimulationMessage,
        sendAgentMessage,
        transferConversationToHuman,
        appointments,
        addAppointment,
        updateAppointmentStatus,
        automations,
        automationLogs,
        toggleAutomation,
        triggerAutomationNow,
      }}
    >
      {children}
    </EstateStoreContext.Provider>
  );
}

export function useEstateStore() {
  const ctx = useContext(EstateStoreContext);
  if (!ctx) {
    throw new Error("useEstateStore must be used within EstateStoreProvider");
  }
  return ctx;
}
