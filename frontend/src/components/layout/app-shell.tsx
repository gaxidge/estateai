"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  LayoutDashboard,
  Home,
  Users,
  Bot,
  CalendarDays,
  Zap,
  Settings,
  Bell,
  Plus,
  Menu,
  X,
  MessageCircle,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEstateStore } from "@/context/estate-store";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  count?: number;
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentTenant, properties, customers, conversations, appointments, automationLogs } =
    useEstateStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const upcomingCount = appointments.filter(
    (a) => a.status === "Onaylandı" || a.status === "Beklemede"
  ).length;
  const waitingChats = conversations.filter((c) => c.status === "Temsilciye Aktarıldı").length;

  const mainNav: NavItem[] = [
    { href: "/", label: "Genel Bakış", icon: LayoutDashboard },
    { href: "/portfoyler", label: "Portföyler", icon: Home, count: properties.length },
    { href: "/crm", label: "Müşteriler", icon: Users, count: customers.length },
    { href: "/randevular", label: "Randevular", icon: CalendarDays, count: upcomingCount },
  ];

  const assistantNav: NavItem[] = [
    { href: "/ai-asistan", label: "AI Asistan", icon: Bot, count: waitingChats || undefined },
    { href: "/otomasyonlar", label: "Otomatik İşlemler", icon: Zap },
  ];

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const NavLink = ({ item, onClick }: { item: NavItem; onClick?: () => void }) => {
    const Icon = item.icon;
    const active = isActive(item.href);
    return (
      <Link
        href={item.href}
        onClick={onClick}
        className={cn(
          "group flex items-center justify-between rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors",
          active
            ? "bg-slate-900 text-white"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        )}
      >
        <span className="flex items-center gap-3">
          <Icon className={cn("h-[18px] w-[18px]", active ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
          {item.label}
        </span>
        {item.count !== undefined && item.count > 0 && (
          <span
            className={cn(
              "min-w-[22px] rounded-md px-1.5 py-0.5 text-center text-[11px] font-semibold",
              active ? "bg-white/15 text-white" : "bg-slate-100 text-slate-500"
            )}
          >
            {item.count}
          </span>
        )}
      </Link>
    );
  };

  const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      <div className="flex h-16 items-center gap-2.5 border-b border-slate-200/70 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
          <Building2 className="h-4 w-4" />
        </div>
        <div className="leading-tight">
          <div className="text-[15px] font-semibold tracking-tight text-slate-900">EstateAI</div>
          <div className="text-[11px] text-slate-500">Emlak Yönetim Platformu</div>
        </div>
      </div>

      <div className="px-4 pt-4">
        <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2.5">
          <div className="text-[11px] text-slate-500">Ofis</div>
          <div className="truncate text-[13px] font-semibold text-slate-800">{currentTenant.name}</div>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        <div className="space-y-0.5">
          <div className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Ana Menü
          </div>
          {mainNav.map((item) => (
            <NavLink key={item.href} item={item} onClick={onNavigate} />
          ))}
        </div>
        <div className="space-y-0.5">
          <div className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Asistan
          </div>
          {assistantNav.map((item) => (
            <NavLink key={item.href} item={item} onClick={onNavigate} />
          ))}
        </div>
      </nav>

      <div className="space-y-1 border-t border-slate-200/70 p-3">
        <NavLink item={{ href: "/ayarlar", label: "Ayarlar", icon: Settings }} onClick={onNavigate} />
        <div className="mt-2 flex items-center justify-between rounded-lg px-3 py-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
              {currentTenant.authorizedPerson
                .split(" ")
                .map((s) => s[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="min-w-0">
              <div className="truncate text-[13px] font-semibold text-slate-900">
                {currentTenant.authorizedPerson}
              </div>
              <div className="truncate text-[11px] text-slate-500">Ofis Yöneticisi</div>
            </div>
          </div>
          <button className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" title="Çıkış yap">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[#F7F8FA] text-slate-900">
      {/* Masaüstü menü */}
      <aside className="fixed inset-y-0 z-30 hidden w-[256px] flex-col border-r border-slate-200/80 bg-white lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobil menü */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-slate-900/30" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative z-10 flex h-full w-72 flex-col bg-white">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute right-3 top-4 rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent onNavigate={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col lg:pl-[256px]">
        {/* Üst bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="hidden text-sm text-slate-500 sm:block" suppressHydrationWarning>
              {new Intl.DateTimeFormat("tr-TR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(new Date())}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/ai-asistan"
              className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 md:flex"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <MessageCircle className="h-3.5 w-3.5 text-slate-500" />
              WhatsApp bağlı
            </Link>

            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50"
                title="Bildirimler"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
              </button>

              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg sm:w-96">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                      <span className="text-sm font-semibold text-slate-900">Bildirimler</span>
                      <Link
                        href="/otomasyonlar"
                        onClick={() => setNotifOpen(false)}
                        className="text-xs font-medium text-slate-500 hover:text-slate-900"
                      >
                        Tümünü gör
                      </Link>
                    </div>
                    <div className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
                      {automationLogs.slice(0, 5).map((log) => (
                        <div key={log.id} className="px-4 py-3 hover:bg-slate-50">
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <span className="font-semibold text-slate-800">{log.affectedEntity}</span>
                            <span className="shrink-0 text-slate-400">{log.executedAt}</span>
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-slate-600">{log.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <Link
              href="/portfoyler"
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Yeni İlan</span>
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
