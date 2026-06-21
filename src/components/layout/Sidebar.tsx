"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { DuckyMark } from "./DuckyMark";
import { DuckyWordmark } from "./DuckyWordmark";
import { navItems } from "./navItems";

// 임시 데이터
const currentUser = {
  name: "덕키",
  email: "ducky@naver.com",
};

export function Sidebar() {
  const pathname = usePathname();

  function handleLogout() {
    // 로그아웃 로직 연결 해야함
    console.log("logout");
  }

  return (
    <aside
      suppressHydrationWarning
      className="sticky top-0 hidden h-dvh w-64 shrink-0 border-r border-[#ECE7DC] bg-[#FFFCF5] px-3.5 py-5 transition-colors dark:border-white/5 dark:bg-[#1C1812] md:flex md:flex-col"
    >
      <Link
        href="/dashboard"
        className="mb-6 flex items-center gap-2 px-2.5 py-1.5"
      >
        <DuckyMark size={34} className="shrink-0" />
        <DuckyWordmark />
      </Link>

      <p className="px-3.5 pb-2 text-[11px] font-semibold tracking-wide text-[#A99B72] dark:text-[#7A7264]">
        메뉴
      </p>

      <nav
        aria-label="주요 메뉴"
        className="flex flex-1 flex-col gap-px overflow-y-auto"
      >
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
                "group relative flex min-h-10 items-center gap-2.5 rounded-[9px] py-2 pl-4 pr-3 text-[13.5px] font-normal text-[#5C574A] transition-colors hover:bg-[#FFF7E0]/60 dark:text-[#BEB7A6] dark:hover:bg-white/5",
                isActive &&
                  "bg-[#FFF7E0] font-medium text-[#5A4300] hover:bg-[#FFF7E0] dark:bg-transparent dark:text-[#FBF6EC] dark:hover:bg-transparent",
              )}
            >
              {isActive && (
                <span className="absolute -left-3.5 top-1.5 bottom-1.5 w-[3px] rounded-full bg-[#FECA43]" />
              )}
              <Icon
                className={cn(
                  "size-[17px] shrink-0 text-[#9B9483] dark:text-[#948C7C]",
                  isActive && "text-[#B88700] dark:text-[#FECA43]",
                )}
                aria-hidden="true"
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* 유저 프로필 / 로그아웃 */}
      <div className="mt-4 rounded-[14px] border border-[#ECE7DC] bg-[#FFF7E0] p-3 dark:border-transparent dark:bg-white/5">
        <div className="flex items-center gap-2.5">
          <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-[#E7DDC8] dark:bg-white/10">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="8"
                cy="5.6"
                r="3.1"
                className="fill-[#8C8470] dark:fill-[#BEB7A6]"
              />
              <path
                d="M2 15c0-3.6 2.7-5.4 6-5.4s6 1.8 6 5.4"
                className="fill-[#8C8470] dark:fill-[#BEB7A6]"
              />
            </svg>
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-[13px] font-medium text-[#2E2A22] dark:text-[#FBF6EC]">
              {currentUser.name}
            </span>
            <span className="truncate text-[11px] text-[#8C8470] dark:text-[#948C7C]">
              {currentUser.email}
            </span>
          </span>
          <ChevronDown
            className="size-3.5 shrink-0 text-[#8C8470] dark:text-[#948C7C]"
            aria-hidden="true"
          />
        </div>

        <div className="my-2.5 h-px bg-[#ECE7DC] dark:bg-[#352C20]" />

        <button
          type="button"
          onClick={handleLogout}
          className="flex min-h-9 w-full items-center justify-center gap-1.5 rounded-[9px] border border-[#E3D6A8] bg-white text-[12.5px] font-medium text-[#6B5200] outline-none transition-colors hover:bg-[#FFF7E0] focus-visible:ring-2 focus-visible:ring-[#FECA43]/60 dark:border-[#3C3327] dark:bg-transparent dark:text-[#BEB7A6] dark:hover:bg-white/5"
        >
          <LogOut className="size-[15px]" aria-hidden="true" />
          로그아웃
        </button>
      </div>
    </aside>
  );
}
