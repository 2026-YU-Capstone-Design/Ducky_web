"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "./navItems";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-dvh w-64 shrink-0 border-r border-[#ECE7DC] bg-white px-4 py-5 md:flex md:flex-col">
      <Link href="/dashboard" className="mb-8 flex items-center gap-3 px-2">
        <span className="flex size-10 items-center justify-center rounded-lg bg-[#FECA43] text-lg font-bold text-[#2E2A22]">
          D
        </span>
        <span className="text-2xl font-bold tracking-tight text-[#FECA43]">
          Ducky
        </span>
      </Link>

      <nav aria-label="주요 메뉴" className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-h-12 items-center gap-3 rounded-lg px-3 text-sm font-medium text-gray-600 transition-colors hover:bg-[#FFF7E0] hover:text-gray-950",
                isActive && "bg-[#FECA43] text-[#2E2A22] hover:bg-[#FECA43]",
              )}
            >
              <Icon className="size-5 shrink-0" aria-hidden="true" />
              <span className="flex min-w-0 flex-col">
                <span className="truncate">{item.label}</span>
                <span
                  className={cn(
                    "truncate text-xs font-normal text-gray-400",
                    isActive && "text-[#66500B]",
                  )}
                >
                  {item.description}
                </span>
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
