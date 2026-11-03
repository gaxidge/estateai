export type PropertyCategory =
  | "Daire"
  | "Müstakil Ev"
  | "Villa"
  | "Arsa"
  | "Tarla"
  | "İş Yeri"
  | "Dükkan"
  | "Ticari Gayrimenkul";

export type ListingType = "Satılık" | "Kiralık";

export type PropertyStatus = "Aktif" | "Opsiyonlu" | "Satıldı" | "Kiralandı";

export interface PropertyOwner {
  fullName: string;
  phone: string;
  email?: string;
  commissionRate: string;
  authorizationEnd: string;
}

export interface Property {
  id: string;
  tenantId: string;
  code: string;
  title: string;
  description: string;
  category: PropertyCategory;
  listingType: ListingType;
  status: PropertyStatus;
  price: number;
  city: string;
  district: string;
  neighborhood: string;
  address: string;
  grossSqm: number;
  netSqm: number;
  roomCount: string; // örn. "3+1", "4+2", "Arsa/Bölümsüz"
  buildingAge: number;
  floorInfo: string; // örn. "4. Kat / 8 Katlı", "Müstakil", "Zemin Kat"
  heatingType: string; // örn. "Yerden Isıtma", "Doğalgaz (Kombi)", "VRV Merkezi", "Yok"
  features: string[];
  images: string[];
  owner: PropertyOwner;
  assignedAgent: string;
  viewsCount: number;
  aiMatchCount: number;
  createdAt: string;
}

export type CustomerStatus =
  | "Potansiyel"
  | "Aktif"
  | "Görüşme Aşamasında"
  | "Tamamlandı";

export interface CustomerInteraction {
  id: string;
  date: string;
  channel: "WhatsApp" | "Telefon" | "Yüz Yüze" | "AI Asistan" | "E-posta";
  summary: string;
  agentName: string;
}

export interface Customer {
  id: string;
  tenantId: string;
  fullName: string;
  phone: string;
  email: string;
  minBudget: number;
  maxBudget: number;
  interestedRegions: string[]; // örn. ["İstanbul / Kadıköy", "İstanbul / Ataşehir"]
  preferredCategories: PropertyCategory[];
  preferredRooms: string[];
  listingPreference: ListingType;
  status: CustomerStatus;
  notes: string;
  lastContactDate: string;
  source: "WhatsApp AI" | "Sahibinden / Hepsiemlak" | "Web Formu" | "Referans";
  assignedAgent: string;
  aiLeadScore: number; // 0-100
  matchedPropertyIds: string[];
  interactions: CustomerInteraction[];
}

export type ToolCallName =
  | "SearchProperties"
  | "CreateCustomer"
  | "UpdateCustomer"
  | "GetCustomerDetails"
  | "CreateAppointment"
  | "SendPropertyDetails"
  | "TransferToHuman";

export interface AIToolCallLog {
  id: string;
  toolName: ToolCallName;
  timestamp: string;
  argumentsJson: string;
  resultSummary: string;
  durationMs: number;
  status: "success" | "warning";
}

export interface ChatMessage {
  id: string;
  sender: "customer" | "ai" | "agent" | "system";
  content: string;
  timestamp: string;
  toolCalls?: AIToolCallLog[];
  attachedProperties?: {
    id: string;
    code: string;
    title: string;
    price: number;
    location: string;
    roomCount: string;
    netSqm: number;
    image: string;
  }[];
}

export interface AIConversation {
  id: string;
  tenantId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  channel: "WhatsApp Cloud API" | "Web Canlı Destek";
  status: "AI Aktif" | "Temsilciye Aktarıldı" | "Randevu Alındı" | "Tamamlandı";
  unreadCount: number;
  lastMessageAt: string;
  extractedContext: {
    intent: ListingType;
    budgetRange: string;
    locations: string[];
    category: PropertyCategory;
    roomPreference: string;
    urgency: "Yüksek" | "Orta" | "Normal";
    sentiment: "Pozitif" | "Nötr" | "Kararsız";
  };
  aiSummary: string;
  messages: ChatMessage[];
}

export type AppointmentStatus =
  | "Onaylandı"
  | "Beklemede"
  | "Tamamlandı"
  | "İptal Edildi";

export interface Appointment {
  id: string;
  tenantId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  propertyId: string;
  propertyCode: string;
  propertyTitle: string;
  propertyLocation: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  status: AppointmentStatus;
  agentName: string;
  createdBy: "AI Asistan" | "Danışman";
  reminderSent: boolean;
  reminderChannel: "WhatsApp + SMS" | "WhatsApp" | "E-posta";
  notes: string;
}

export interface AutomationJob {
  id: string;
  name: string;
  description: string;
  schedule: string; // Kullanıcıya gösterilen sade çalışma zamanı (örn. "Her gün 19:00")
  category:
    | "Müşteri Kaydı"
    | "Portföy Eşleştirme"
    | "Randevu Hatırlatma"
    | "Müşteri Takibi"
    | "Günlük Özet";
  isActive: boolean;
  lastRunAt: string;
  nextRunAt: string;
  totalRuns30d: number;
  successRate: number;
  steps: string[];
}

export interface AutomationExecutionLog {
  id: string;
  jobId: string;
  jobName: string;
  executedAt: string;
  durationMs: number;
  status: "Başarılı" | "Atlandı" | "Uyarı";
  detail: string;
  affectedEntity: string;
}

export interface TenantOffice {
  id: string;
  name: string;
  plan: "Pro Kurumsal" | "Başlangıç" | "Enterprise";
  city: string;
  taxNumber: string;
  authorizedPerson: string;
  phone: string;
  whatsappConnected: boolean;
  whatsappNumber: string;
  aiModel: string;
  activeUsers: number;
  maxUsers: number;
}
